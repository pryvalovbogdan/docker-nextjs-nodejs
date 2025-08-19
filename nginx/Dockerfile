FROM nginx:alpine

RUN rm -f /etc/nginx/conf.d/default.conf

COPY default.conf /etc/nginx/conf.d/default.conf
COPY cloudflare-ips.conf /etc/nginx/conf.d/cloudflare-ips.conf

EXPOSE 80
