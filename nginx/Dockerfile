# Base on offical NGINX image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/



# Install certbot for Nginx
RUN apk add certbot certbot-nginx

# Эта команда не работает в Dockerfile
# RUN certbot --nginx && address@gmail.com && Y && N && 1 2
# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]
