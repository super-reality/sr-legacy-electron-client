# Super Reality Client

## Installing

1. `npm install`

2. if not installed; `npm install foreman -g`


## Run from source

If this is the first time after installing:

`npm run electron-build` or `npm run build`

Once finished simply do `npm run start`


## Building

- `npm run build` for desktop

- `npm run build:web` for web


## Testing

`npm run jest:ci:watch` opens jest watcher with common CI tests

`npm run test:all` Runs a single pass of lint + jest

To run or develop visual tests;

- Build for web: `npm run build:web`
- Start Jest server: `npm run jest-server`
- Start Jest server: `npm run jest-server` (dont close it)
- Start Jest watcher: `npm run jest:watch`

All visual tests are declared in `src/__tests__/electron.ts` and the code for the test component is in `src/renderer/views/tests/index.tsx`


## Making changes

1. Branch from `develop`

2. Submit PR, merge into `develop`

Try to keep `develop` in a buildable and runnable state.

Merging to `master` triggers automatic version bump.
