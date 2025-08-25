FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY services/api-gateway/package*.json ./services/api-gateway/
COPY services/common-lib/package*.json ./services/common-lib/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY services/common-lib ./services/common-lib
COPY services/api-gateway ./services/api-gateway

# Build application
WORKDIR /app/services/common-lib
RUN npm run build

WORKDIR /app/services/api-gateway
RUN npm run build

FROM node:18-alpine AS runtime

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

WORKDIR /app

# Copy built application
COPY --from=builder --chown=nestjs:nodejs /app/services/api-gateway/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/services/api-gateway/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/services/common-lib/dist ./common-lib

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]