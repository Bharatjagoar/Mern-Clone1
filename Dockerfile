FROM node:20-alpine

# Alpine ships musl libc with no OpenSSL by default; Prisma's query engine
# needs libssl to load, so its detection at `prisma generate` silently
# fails and the client can't start at runtime without this.
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src
COPY tests ./tests

EXPOSE 3000

CMD ["node", "src/server.js"]
