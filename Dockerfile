# Multi-stage production Dockerfile for INOVIX Backend API (Repo Root)
FROM node:20-alpine AS builder

WORKDIR /app

# Copy server package definitions and prisma schema
COPY server/package*.json server/tsconfig.json ./
COPY server/prisma ./prisma/
COPY server/scripts ./scripts/

RUN npm ci
RUN node scripts/prepare-db.js
RUN npx prisma generate

# Compile TypeScript
COPY server/src ./src
RUN npm run build

# Production container
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy package files, scripts, and prisma schema BEFORE running npm ci
COPY server/package*.json ./
COPY server/prisma ./prisma/
COPY server/scripts ./scripts/

RUN npm ci --omit=dev

# Copy generated prisma client and compiled JavaScript from builder
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
