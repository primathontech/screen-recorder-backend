<p align="center">
  <a href="https://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A backend solution for handling real-time screen recording using WebSocket and Node.js, built with the NestJS framework.</p>

<p align="center">
<a href="https://www.npmjs.com/~nestjs" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjs" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjs" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
</p>

## Description

This project is a backend service for screen recording applications. It supports real-time video chunk handling via WebSocket connections and provides functionalities to save and merge video chunks efficiently.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## WebSocket Endpoints

### `video-chunk`
- **Description:** Receives video chunks and saves them.
- **Payload:** `{ callId: string, chunk: Buffer, timestamp: number }`

### `recording-complete`
- **Description:** Merges all chunks for a given `callId` and emits the path of the merged file.
- **Response:** `{ path: string }`

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Key Features

- **Real-Time Communication:** WebSocket-based communication for receiving video chunks in real time.
- **Video Chunk Handling:** Efficient saving and merging of video chunks on the server.
- **CORS Enabled:** Cross-origin requests supported for flexible integration.

## Deployment

To deploy the application:

```bash
# Build the project
$ npm run build

# Serve the application
$ npm run serve
```

### For cloud deployment:

Use [Mau](https://mau.nestjs.com) for streamlined deployment on AWS:

```bash
$ npm install -g mau
$ mau deploy
```

## Project Structure

- **`main.ts`**: Application bootstrap with WebSocket adapter and CORS enabled.
- **`app.module.ts`**: Defines the main application module.
- **`screen-recording.gateway.ts`**: Handles WebSocket events for video chunk transmission.
- **`screen-recording.service.ts`**: Manages file storage and merging logic for video chunks.

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [NestJS Courses](https://courses.nestjs.com)
- [NestJS Mau](https://mau.nestjs.com)
- [Enterprise Support](https://enterprise.nestjs.com)
- [Jobs Board](https://jobs.nestjs.com)

## Author

- **Sumit Kumar**

## License

This project is [MIT licensed](https://opensource.org/licenses/MIT).

