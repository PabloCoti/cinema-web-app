FROM node:alpine

WORKDIR /app

COPY . .
RUN npm install --production

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/entrypoint.sh"]