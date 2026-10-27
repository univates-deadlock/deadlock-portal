FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html 404.html /usr/share/caddy/
COPY css/ /usr/share/caddy/css/
COPY js/ /usr/share/caddy/js/
COPY assets/ /usr/share/caddy/assets/

EXPOSE 8080
