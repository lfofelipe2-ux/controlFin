import Redis from 'ioredis';
import logger from '../utils/logger';

class RedisService {
    private client: Redis | null = null;
    private isConnected = false;

    constructor() {
        this.initializeRedis();
    }

    private async initializeRedis() {
        // Skip Redis initialization in test environment if disabled
        if (process.env['NODE_ENV'] === 'test' && process.env['REDIS_ENABLED'] === 'false') {
            logger.info('Redis disabled for tests');
            return;
        }

        try {
            const redisUrl = process.env['REDIS_URL'] || 'redis://localhost:6379';

            this.client = new Redis(redisUrl, {
                maxRetriesPerRequest: 3,
                lazyConnect: true,
                connectTimeout: 10000,
                commandTimeout: 5000,
            });

            this.client.on('connect', () => {
                logger.info('Redis connected successfully');
                this.isConnected = true;
            });

            this.client.on('error', (error) => {
                logger.error('Redis connection error:', error);
                this.isConnected = false;
            });

            this.client.on('close', () => {
                logger.warn('Redis connection closed');
                this.isConnected = false;
            });

            // Connect to Redis
            await this.client.connect();
        } catch (error) {
            logger.error('Failed to initialize Redis:', error);
            this.isConnected = false;
        }
    }

    async isTokenBlacklisted(tokenId: string): Promise<boolean> {
        if (!this.client || !this.isConnected) {
            logger.warn('Redis not available, allowing token');
            return false;
        }

        try {
            const result = await this.client.get(`blacklist:${tokenId}`);
            return result !== null;
        } catch (error) {
            logger.error('Error checking token blacklist:', error);
            return false; // Allow token if Redis is unavailable
        }
    }

    async blacklistToken(tokenId: string, expiresInSeconds?: number): Promise<boolean> {
        if (!this.client || !this.isConnected) {
            logger.warn('Redis not available, cannot blacklist token');
            return false;
        }

        try {
            const key = `blacklist:${tokenId}`;

            if (expiresInSeconds) {
                await this.client.setex(key, expiresInSeconds, 'blacklisted');
            } else {
                await this.client.set(key, 'blacklisted');
            }

            logger.info(`Token blacklisted: ${tokenId}`);
            return true;
        } catch (error) {
            logger.error('Error blacklisting token:', error);
            return false;
        }
    }

    async removeFromBlacklist(tokenId: string): Promise<boolean> {
        if (!this.client || !this.isConnected) {
            logger.warn('Redis not available, cannot remove from blacklist');
            return false;
        }

        try {
            const key = `blacklist:${tokenId}`;
            const result = await this.client.del(key);

            if (result > 0) {
                logger.info(`Token removed from blacklist: ${tokenId}`);
                return true;
            }

            return false;
        } catch (error) {
            logger.error('Error removing token from blacklist:', error);
            return false;
        }
    }

    async clearBlacklist(): Promise<boolean> {
        if (!this.client || !this.isConnected) {
            logger.warn('Redis not available, cannot clear blacklist');
            return false;
        }

        try {
            const keys = await this.client.keys('blacklist:*');
            if (keys.length > 0) {
                await this.client.del(...keys);
                logger.info(`Cleared ${keys.length} blacklisted tokens`);
            }
            return true;
        } catch (error) {
            logger.error('Error clearing blacklist:', error);
            return false;
        }
    }

    async getBlacklistStats(): Promise<{ count: number; isConnected: boolean }> {
        if (!this.client || !this.isConnected) {
            return { count: 0, isConnected: false };
        }

        try {
            const keys = await this.client.keys('blacklist:*');
            return { count: keys.length, isConnected: true };
        } catch (error) {
            logger.error('Error getting blacklist stats:', error);
            return { count: 0, isConnected: false };
        }
    }

    async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.disconnect();
            this.isConnected = false;
            logger.info('Redis disconnected');
        }
    }

    getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

// Export singleton instance
export const redisService = new RedisService();
export default redisService;
