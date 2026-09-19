FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production WEB_HOST=0.0.0.0 API_HOST=127.0.0.1 API_PORT=4000 API_URL=http://127.0.0.1:4000 DATA_DIR=/app/data
COPY --from=builder --chown=node:node /app /app
RUN mkdir -p /app/data && chown node:node /app/data
USER node
EXPOSE 3000
VOLUME ["/app/data"]
CMD ["npm","start"]
