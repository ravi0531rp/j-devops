# Builder Phase
FROM node:14-alpine AS builder

WORKDIR '/app'

COPY package.json .

RUN npm install

# No need of the volume system stuff as it will be the prod env

COPY . .

RUN npm run build

# Run Phase
# Build is at /app/build

FROM nginx

COPY --from=builder /app/build /usr/share/nginx/html