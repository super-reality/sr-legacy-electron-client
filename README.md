# Super Reality Client

## Installing

1. `npm install`

2. if not installed; `npm install foreman -g`

3. run `npm run electron-rebuild`

4. run `npm run pre-build-iohook-win`


## Run from source

If this is the first time after installing:

`npm run build` or `npm run electron-build`

Once finished simply do `npm run start`

## Problem Solving

If electron fails use these to debug the problem:

`electron .`
`npm run electron`

## Building

- `npm run build` for desktop

- `npm run build:web` for web


## Debug

To open DevTools (show console errors, add breakpoints, etc) to the renderer use the keys `Alt + Shift + D`

To open the DevTools and the window of the background (used for OpenCv template matching) process you can use `Alt + Shift + E`


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
