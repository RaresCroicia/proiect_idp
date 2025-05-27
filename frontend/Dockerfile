FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build the app with environment variables
ARG VITE_API_URL
ARG VITE_AUTH_SERVICE_URL
ARG VITE_COURSE_SERVICE_URL
ARG VITE_BASE_URL
ARG VITE_SERVE_FROM_SUBPATH
ARG VITE_PORT

ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_AUTH_SERVICE_URL=${VITE_AUTH_SERVICE_URL}
ENV VITE_COURSE_SERVICE_URL=${VITE_COURSE_SERVICE_URL}
ENV VITE_BASE_URL=${VITE_BASE_URL}
ENV VITE_SERVE_FROM_SUBPATH=${VITE_SERVE_FROM_SUBPATH}
ENV VITE_PORT=${VITE_PORT}

RUN npm run build

FROM nginx:alpine

# Install envsubst
RUN apk add --no-cache gettext

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"] 