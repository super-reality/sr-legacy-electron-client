# OpenWorld

## Environment setup

### Server dev setup

1. `cd openworld-desktop`

2. *(optional)* `nodenv install`

3. `npm run docker:up`

4. `npm run serve`

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
