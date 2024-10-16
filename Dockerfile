FROM node:18-alpine as build-stage
WORKDIR /usr/app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build --mode=production

FROM nginx:1.15.2-alpine
COPY --from=build-stage /usr/app/dist /var/www
COPY entrypoint.sh .
COPY .env.production .

RUN apk add --no-cache --upgrade bash
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]


COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]