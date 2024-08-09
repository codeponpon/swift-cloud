import { PrismaClient } from "@prisma/client";
import { createReadStream } from "fs";
import { join } from "path";
import { parse } from "csv-parse";

const prisma = new PrismaClient();

async function seed() {
  const parser = createReadStream(
    join(__dirname, "data/songs.csv"),
    "utf8",
  ).pipe(
    parse({
      delimiter: ",",
      trim: true,
      columns: true,
    }),
  );

  const songs: { [key: string]: any }[] = [];
  for await (const record of parser) {
    songs.push(record);
  }

  await prisma.song.createMany({
    data: songs.map((song) => ({
      title: song.Song,
      artist: song.Artist,
      writer: song.Writer,
      album: song.Album,
      year: parseInt(song.Year, 10),
      playsJune: parseInt(song["Plays - June"], 10),
      playsJuly: parseInt(song["Plays - July"], 10),
      playsAugust: parseInt(song["Plays - August"], 10),
    })),
  });
}

seed()
  .then(() => {
    console.log("Seed data successfully added to Prisma database");
  })
  .catch((err) => {
    console.error("Error seeding data:", err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
