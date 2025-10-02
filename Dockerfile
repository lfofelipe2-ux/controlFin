# Multi-stage build for ControlFin
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY controlfin-frontend/package*.json ./controlfin-frontend/
COPY controlfin-backend/package*.json ./controlfin-backend/

# Install dependencies
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/controlfin-frontend/node_modules ./controlfin-frontend/node_modules
COPY --from=deps /app/controlfin-backend/node_modules ./controlfin-backend/node_modules

# Copy source code
COPY . .

# Build frontend
WORKDIR /app/controlfin-frontend
RUN npm run build

# Build backend
WORKDIR /app/controlfin-backend
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 controlfin

# Copy built applications
COPY --from=builder --chown=controlfin:nodejs /app/controlfin-frontend/dist ./frontend/dist
COPY --from=builder --chown=controlfin:nodejs /app/controlfin-backend/dist ./backend/dist
COPY --from=builder --chown=controlfin:nodejs /app/controlfin-backend/package*.json ./backend/

# Install production dependencies for backend
WORKDIR /app/backend
RUN npm ci --only=production

# Switch to non-root user
USER controlfin

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/server.js"]
