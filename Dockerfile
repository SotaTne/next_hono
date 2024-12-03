# syntax=docker.io/docker/dockerfile:1

FROM node:lts-bookworm

# Install dependencies
RUN apt-get update && apt-get install -y openssl sqlite3

WORKDIR /app

RUN mkdir -p /app/certificates && \
  openssl genpkey -algorithm RSA -out /app/certificates/privatekey.pem && \
  openssl req -new -key /app/certificates/privatekey.pem -out /app/certificates/server.csr -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Example/CN=localhost" && \
  openssl x509 -req -in /app/certificates/server.csr -signkey /app/certificates/privatekey.pem -out /app/certificates/cert.pem -days 365; 

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

COPY prisma ./prisma
COPY .env ./
RUN npx prisma generate
RUN npx prisma migrate dev --name init

EXPOSE 3000

CMD [ "npm", "run", "dev:next:node" ]
