# Multi-stage build for React frontend

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app
ARG REACT_APP_TRAVELER_SERVICE_URL
ARG REACT_APP_OWNER_SERVICE_URL
ARG REACT_APP_PROPERTY_SERVICE_URL
ARG REACT_APP_BOOKING_SERVICE_URL
ARG REACT_APP_AGENT_URL

ENV REACT_APP_TRAVELER_SERVICE_URL=$REACT_APP_TRAVELER_SERVICE_URL
ENV REACT_APP_OWNER_SERVICE_URL=$REACT_APP_OWNER_SERVICE_URL
ENV REACT_APP_PROPERTY_SERVICE_URL=$REACT_APP_PROPERTY_SERVICE_URL
ENV REACT_APP_BOOKING_SERVICE_URL=$REACT_APP_BOOKING_SERVICE_URL
ENV REACT_APP_AGENT_URL=$REACT_APP_AGENT_URL

RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Copy built files from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


