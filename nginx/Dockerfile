# Base on offical NGINX image
FROM nginx:alpine

# Remove any existing config files
RUN rm /etc/nginx/conf.d/*

# Copy config files
# *.conf files in conf.d/ dir get included in main config
COPY ./default.conf /etc/nginx/conf.d/



# Launch NGINX
#RUN apk add certbot certbot-nginx
#RUN certbot --nginx 

CMD [ "nginx", "-g", "daemon off;" ]
