FROM node:12.14-alpine3.9
EXPOSE 3000
COPY . /app
RUN apk update && \
    apk upgrade && \
    apk add git libgit2-dev krb5-libs && \
    apk add python tzdata pkgconfig build-base && \
    mkdir /repo && \
    git init /repo && \
    cd /app && \
    sed  "s/repo: *''/repo: '\/repo'/" config.js.template > config.js && \
    npm install
RUN apk del python tzdata pkgconfig build-base && \
    rm -rf /tmp/* /var/cache/apk/*

CMD cd /app && npm run start
