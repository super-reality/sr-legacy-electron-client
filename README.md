# Super Reality Client

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![GitHub branch checks state](https://img.shields.io/github/checks-status/super-reality/super-reality-client/master)
![GitHub package.json version](https://img.shields.io/github/package-json/v/super-reality/super-reality-client)

## Installing

1. switch to or branch from `develop`

2. `npm install` (make sure to use Node 12.14.0, see [troubleshooting](#troubleshooting))

3. if not installed; `npm install foreman -g`

4. run `npm run electron-rebuild`

5. run `npm run pre-build-iohook-win`


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

1. For every new task Branch from `develop`

2. Submit PR, merge into `develop`

We use [commitzen](https://commitizen.github.io/cz-cli/) to enforce commits format, You can use `npx cz` or `npm run cm` to create a new valid commit. Releases, semantic version numbers, tags, changelogs and publishing will automatically be handled based on these commits thanks to [semantic-release](https://github.com/semantic-release/semantic-release) (WIP).

Try to keep `develop` in a buildable and runnable state.

## Troubleshooting

- Node 12.14.0 is required, you can use [nvm-windows](https://github.com/coreybutler/nvm-windows#installation--upgrades) or [nvm](https://github.com/nvm-sh/nvm) to manage multiple versions of Node
  - Download the nvm installer
  - In a new command prompt, install Node: `nvm install 12.14.0`
  - After that, use that version: `nvm use 12.14.0`
- If you get an error about not being able to find the `/fx` folder try running `npm run electron-build` again