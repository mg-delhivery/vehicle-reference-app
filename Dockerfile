ARG F_REGISTRY

FROM ${F_REGISTRY}fxtrt-base-node:14.17.0  AS builder
ARG F_GITHUB_TOKEN
WORKDIR /usr/app
COPY . .

RUN echo -e "@foxtrotplatform:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=$F_GITHUB_TOKEN" > .npmrc \
    && npm run build

FROM ${F_REGISTRY}fxtrt-base-node:14.17.0
WORKDIR /usr/opt/app
COPY --from=builder /usr/app ./
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
