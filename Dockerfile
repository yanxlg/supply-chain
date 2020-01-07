FROM nginx:1.17
LABEL MAINTAINER="zxwen@i9i8.com"

ADD dist /usr/share/nginx/html
