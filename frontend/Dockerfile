FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create a script to replace environment variables at runtime
RUN echo '#!/bin/sh\n\
envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html.tmp\n\
mv /usr/share/nginx/html/index.html.tmp /usr/share/nginx/html/index.html\n\
nginx -g "daemon off;"' > /docker-entrypoint.sh && \
chmod +x /docker-entrypoint.sh

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /docker-entrypoint.sh /docker-entrypoint.sh
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["/docker-entrypoint.sh"] 