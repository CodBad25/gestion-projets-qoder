FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create directory for SQLite database
RUN mkdir -p /app/prisma/db

# Initialize database
RUN npx prisma db push && node scripts/init-db.mjs

# Expose port
EXPOSE $PORT

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/prisma/db/production.db"

# Start command
CMD ["sh", "-c", "PORT=${PORT:-3000} npm start"]