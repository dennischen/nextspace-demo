FROM node:18-alpine
WORKDIR /app
COPY node_modules ./node_modules/
COPY build ./build/
COPY package.json next.config.js ./
CMD ["yarn", "start"]
EXPOSE 3000
