-- CreateTable
CREATE TABLE "songs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "writer" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "playsJune" INTEGER NOT NULL,
    "playsJuly" INTEGER NOT NULL,
    "playsAugust" INTEGER NOT NULL
);
