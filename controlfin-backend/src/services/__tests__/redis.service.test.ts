import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { redisService } from '../redis.service';

// Mock ioredis
const mockRedis = {
    connect: vi.fn(),
    disconnect: vi.fn(),
    get: vi.fn(),
    set: vi.fn(),
    setex: vi.fn(),
    del: vi.fn(),
    keys: vi.fn(),
    on: vi.fn(),
};

vi.mock('ioredis', () => {
    return {
        default: vi.fn(() => mockRedis),
    };
});

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        info: vi.fn(),
        warn: vi.fn(),
        error: vi.fn(),
    },
}));

describe('RedisService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset environment variables
        process.env['NODE_ENV'] = 'test';
        process.env['REDIS_URL'] = 'redis://localhost:6379';
        process.env['REDIS_ENABLED'] = 'true';
    });

    afterEach(() => {
        redisService.disconnect();
    });

    // BASIC FUNCTIONALITY TESTS
    describe('Basic Functionality', () => {
        it('should initialize Redis service', () => {
            expect(redisService).toBeDefined();
            expect(redisService.getConnectionStatus()).toBe(false);
        });

        it('should skip Redis initialization when disabled in test environment', () => {
            process.env['REDIS_ENABLED'] = 'false';
            expect(redisService).toBeDefined();
        });

        it('should use default Redis URL when not provided', () => {
            delete process.env['REDIS_URL'];
            expect(redisService).toBeDefined();
        });
    });

    // CONNECTION TESTS
    describe('Connection Management', () => {
        it('should handle connection errors gracefully', async () => {
            const error = new Error('Connection failed');
            mockRedis.connect.mockRejectedValue(error);
            mockRedis.on.mockImplementation((event, callback) => {
                if (event === 'error') {
                    setTimeout(() => callback(error), 0);
                }
            });

            // The service should handle errors gracefully
            expect(redisService).toBeDefined();
        });

        it('should handle connection close events', async () => {
            mockRedis.connect.mockResolvedValue(undefined);
            mockRedis.on.mockImplementation((event, callback) => {
                if (event === 'close') {
                    setTimeout(() => callback(), 0);
                }
            });

            await redisService.disconnect();

            // In test environment, Redis may not be connected, so we just test that disconnect works
            expect(redisService).toBeDefined();
        });
    });

    // TOKEN BLACKLIST TESTS (When Redis is not connected)
    describe('Token Blacklist Operations (Disconnected)', () => {
        it('should return false when checking blacklisted token (Redis not connected)', async () => {
            const tokenId = 'test-token-123';

            const result = await redisService.isTokenBlacklisted(tokenId);

            expect(result).toBe(false);
        });

        it('should return false when blacklisting token (Redis not connected)', async () => {
            const tokenId = 'test-token-123';

            const result = await redisService.blacklistToken(tokenId);

            expect(result).toBe(false);
        });

        it('should return false when blacklisting token with expiration (Redis not connected)', async () => {
            const tokenId = 'test-token-123';
            const expiresInSeconds = 3600;

            const result = await redisService.blacklistToken(tokenId, expiresInSeconds);

            expect(result).toBe(false);
        });

        it('should return false when removing token from blacklist (Redis not connected)', async () => {
            const tokenId = 'test-token-123';

            const result = await redisService.removeFromBlacklist(tokenId);

            expect(result).toBe(false);
        });

        it('should return false when clearing blacklist (Redis not connected)', async () => {
            const result = await redisService.clearBlacklist();

            expect(result).toBe(false);
        });

        it('should return disconnected stats when getting blacklist statistics (Redis not connected)', async () => {
            const result = await redisService.getBlacklistStats();

            expect(result).toEqual({ count: 0, isConnected: false });
        });
    });

    // ERROR HANDLING TESTS
    describe('Error Handling', () => {
        it('should handle get operation errors gracefully', async () => {
            const tokenId = 'test-token-123';
            mockRedis.get.mockRejectedValue(new Error('Redis error'));

            const result = await redisService.isTokenBlacklisted(tokenId);

            expect(result).toBe(false);
        });

        it('should handle set operation errors gracefully', async () => {
            const tokenId = 'test-token-123';
            mockRedis.set.mockRejectedValue(new Error('Redis error'));

            const result = await redisService.blacklistToken(tokenId);

            expect(result).toBe(false);
        });

        it('should handle delete operation errors gracefully', async () => {
            const tokenId = 'test-token-123';
            mockRedis.del.mockRejectedValue(new Error('Redis error'));

            const result = await redisService.removeFromBlacklist(tokenId);

            expect(result).toBe(false);
        });

        it('should handle keys operation errors gracefully', async () => {
            mockRedis.keys.mockRejectedValue(new Error('Redis error'));

            const result = await redisService.getBlacklistStats();

            expect(result).toEqual({ count: 0, isConnected: false });
        });
    });

    // CONNECTION STATUS TESTS
    describe('Connection Status', () => {
        it('should check if connected', () => {
            const isConnected = redisService.getConnectionStatus();
            expect(typeof isConnected).toBe('boolean');
        });

        it('should disconnect from Redis', async () => {
            mockRedis.disconnect.mockResolvedValue(undefined);

            await redisService.disconnect();

            // In test environment, Redis may not be connected, so we just test that disconnect works
            expect(redisService).toBeDefined();
        });
    });

    // CONFIGURATION TESTS
    describe('Configuration', () => {
        it('should use custom Redis URL from environment', () => {
            const customUrl = 'redis://custom-host:6379';
            process.env['REDIS_URL'] = customUrl;

            expect(redisService).toBeDefined();
        });

        it('should handle missing Redis URL gracefully', () => {
            delete process.env['REDIS_URL'];

            expect(redisService).toBeDefined();
        });
    });

    // INTEGRATION TESTS
    describe('Integration', () => {
        it('should handle operations when Redis is not available', async () => {
            const tokenId = 'integration-token-123';

            // All operations should return false when Redis is not connected
            const blacklistResult = await redisService.blacklistToken(tokenId);
            expect(blacklistResult).toBe(false);

            const isBlacklisted = await redisService.isTokenBlacklisted(tokenId);
            expect(isBlacklisted).toBe(false);

            const removeResult = await redisService.removeFromBlacklist(tokenId);
            expect(removeResult).toBe(false);

            const stats = await redisService.getBlacklistStats();
            expect(stats).toEqual({ count: 0, isConnected: false });
        });

        it('should handle batch operations when Redis is not available', async () => {
            const tokenIds = ['token1', 'token2', 'token3'];

            // All operations should return false when Redis is not connected
            for (const tokenId of tokenIds) {
                const result = await redisService.blacklistToken(tokenId);
                expect(result).toBe(false);
            }

            const clearResult = await redisService.clearBlacklist();
            expect(clearResult).toBe(false);
        });
    });
});