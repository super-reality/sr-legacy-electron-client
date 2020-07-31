# OpenWorld

## Environment setup

### Server dev setup

1. `cd openworld-desktop`

2. *(optional)* `nodenv install`

3. `npm run docker:up`

4. `npm run serve`

#### Environment variables

Stored in `/openworld-server/.env`, will not be committed.

- `ROOT_USERNAME`: bootstrapping username, **disable account after admin made**
- `ROOT_PASSWORD`: bootstrapping password, **disable account after admin made**
- `PORT`: server listening port
- `MONGO_URL`: mongodb url, probably `mongodb://localhost:27017` in docker
- `JWT_ISSUER`: issuer of the jwt
- `JWT_AUDIENCE`: intended audience for the jwt
- `JWT_EXPIRATION`: expiration date for the jwt
- `JWT_SECRET`: secret for jwt hashing

### Desktop dev setup (requires server to be running)

1. `cd openworld-desktop`

2. *(optional)* `nodenv install`

3. `npm install` or `npm run install:wsl` if using WSL (haven't tested with WSL 2)

4. `npm run start` to start parcel and electron

## Building

### Server builds

1. steps 1-2 in server dev

2. `npm run docker:build`

### Desktop builds

1. steps 1-3 in desktop dev

2. `npm run electron:build` for uncompressed, `npm run electron:dist` for compressed with installer

## Contributing

Put additional components or microservices in root-level folders. For example, `/openworld-cv` or `/openworld-xrengine`.

### Making changes

1. Branch from `develop`

2. Submit PR, merge into `develop`

Try to keep `develop` in a buildable and runnable state.
