# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

# Copiamos manifests primero para cachear la capa de dependencias:
# npm ci solo se re-ejecuta cuando cambia el lockfile.
COPY package.json package-lock.json ./
RUN npm ci

# Copiamos el código y compilamos. Las VITE_* se hornean en ESTE paso (build-time).
COPY . .
RUN npm run build

FROM nginx:alpine AS runtime

# Reemplazamos la config por defecto por una con fallback SPA.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Estáticos generados por el builder.
COPY --from=builder /app/dist /usr/share/nginx/html

# No-root: corremos como el usuario 'nginx' en un puerto sin privilegios (8080).
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx \
    && touch /var/run/nginx.pid \
    && chown nginx:nginx /var/run/nginx.pid

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
