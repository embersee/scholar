# Base on offical NGINX Alpine image
FROM nginx

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./nginx-conf/default.conf /etc/nginx/conf.d/



# Launch NGINX
CMD [ "nginx", "-g", "daemon off;" ]