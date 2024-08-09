# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)

This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).

# SwiftCloud!

The #1 app for Taylor Swifties!

## About

SwiftCloud is a web application that provides a comprehensive database of Taylor Swift's songs, along with play counts for a user in the past 3 months.

## API Endpoints

---

### 1. GET `/v1/songs`

Retrieve a list of all songs.

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Song 1",
    "artist": "Artist 1",
    "year": 2020
  },
  {
    "id": 2,
    "title": "Song 2",
    "artist": "Artist 2",
    "year": 2019
  }
]
```

### 2. GET `/v1/songs/:year`

Retrieve a list of songs from a specific year.

Example Request: `GET /v1/songs/2020`

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Song 1",
    "artist": "Artist 1",
    "year": 2020
  }
]
```

### 3. GET `/v1/songs/popular/:period`

Retrieve a list of popular songs from a specific period (e.g. "june", "july", "august", "all").

Example Request:`GET /v1/songs/popular/august`

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Song 1",
    "artist": "Artist 1",
    "year": 2020
  }
]
```

### 4. GET `/v1/songs/search`

Search for songs based on a criteria (e.g. title, artist, writer and album).

Example Request: `GET /v1/songs/search?q=The 1`

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Song 1",
    "artist": "Artist 1",
    "year": 2020
  }
]
```

### 5. GET `/v1/songs/sort`

Retrieve a list of songs sorted by a specific column (e.g. title, artist, writer, album).

Example Request: `GET GET /v1/songs/sort?sortBy=title&sortOrder=asc`

**Example Response:**

```json
[
  {
    "id": 1,
    "title": "Song 1",
    "artist": "Artist 1",
    "year": 2020
  },
  {
    "id": 2,
    "title": "Song 2",
    "artist": "Artist 2",
    "year": 2019
  }
]
```
