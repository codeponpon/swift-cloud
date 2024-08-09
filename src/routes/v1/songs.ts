import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prismaClient";
import {
  PaginationParams,
  PopularSong,
  SongParams,
  SongQuery,
  SongSort,
} from "../../interfaces/iSong";
import { paginate } from "../../utils/pagination";

const songsRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get(
    "/songs",
    async (
      request: FastifyRequest<{ Querystring: PaginationParams }>,
      reply: FastifyReply,
    ) => {
      const limit = request.query.limit
        ? parseInt(request.query.limit, 10)
        : 10;
      const offset = request.query.offset
        ? parseInt(request.query.offset, 10)
        : 0;

      const totalSongs = await prisma.song.count();
      const songs = await prisma.song.findMany({
        take: limit,
        skip: offset,
      });

      const { data, pagination } = paginate(totalSongs, limit, offset, songs);

      reply.send({
        take: limit,
        data,
        pagination,
      });
    },
  );

  fastify.get(
    "/songs/:year",
    async (
      request: FastifyRequest<{
        Params: SongParams;
        Querystring: PaginationParams;
      }>,
      reply: FastifyReply,
    ) => {
      const limit = request.query.limit
        ? parseInt(request.query.limit, 10)
        : 10;
      const offset = request.query.offset
        ? parseInt(request.query.offset, 10)
        : 0;

      const year = parseInt(request.params.year, 10);
      const totalSongs = await prisma.song.count({ where: { year } });
      const songs = await prisma.song.findMany({
        where: {
          year,
        },
        take: limit,
        skip: offset,
      });

      const { data, pagination } = paginate(totalSongs, limit, offset, songs);

      reply.send({
        take: limit,
        data,
        pagination,
      });
    },
  );

  fastify.get(
    "/songs/popular/:period",
    async (
      request: FastifyRequest<{
        Params: SongParams;
        Querystring: PaginationParams;
      }>,
      reply: FastifyReply,
    ) => {
      const limit = request.query.limit
        ? parseInt(request.query.limit, 10)
        : 10;
      const offset = request.query.offset
        ? parseInt(request.query.offset, 10)
        : 0;

      const period = request.params.period;
      let playsColumn: string;
      let popularSongs: PopularSong[];
      const totalSongs = await prisma.song.count();
      switch (period) {
        case "august":
          playsColumn = "playsAugust";
          break;
        case "july":
          playsColumn = "playsJuly";
          break;
        case "june":
          playsColumn = "playsJune";
          break;
        case "all":
          popularSongs = await prisma.$queryRaw`
            SELECT *, (playsJune + playsJuly + playsAugust) as totalPlays
            FROM songs
            ORDER BY totalPlays DESC
            LIMIT ${limit}
          `;

          popularSongs = popularSongs.map((song) => ({
            ...song,
            totalPlays: Number(song.totalPlays),
          }));

          const { data, pagination } = paginate(
            totalSongs,
            limit,
            offset,
            popularSongs,
          );

          return reply.send({
            take: limit,
            data,
            pagination,
          });
        default:
          return reply.code(400).send({ error: "Invalid period" });
      }

      const songs = await prisma.song.findMany({
        orderBy: {
          [playsColumn]: "desc",
        },
        take: limit,
        skip: offset,
      });

      const { data, pagination } = paginate(totalSongs, limit, offset, songs);

      reply.send({
        take: limit,
        data,
        pagination,
      });
    },
  );

  fastify.get(
    "/songs/search",
    async (
      request: FastifyRequest<{
        Querystring: SongQuery;
      }>,
      reply: FastifyReply,
    ) => {
      const query = request.query.q;
      const limit = request.query.limit
        ? parseInt(request.query.limit, 10)
        : 10;
      const offset = request.query.offset
        ? parseInt(request.query.offset, 10)
        : 0;
      const where = {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            artist: {
              contains: query,
            },
          },
          {
            writer: {
              contains: query,
            },
          },
          {
            album: {
              contains: query,
            },
          },
        ],
      };
      const totalSongs = await prisma.song.count({ where });
      const songs = await prisma.song.findMany({
        where,
        take: limit,
        skip: offset,
      });

      const { data, pagination } = paginate(totalSongs, limit, offset, songs);

      reply.send({
        take: limit,
        data,
        pagination,
      });
    },
  );

  fastify.get(
    "/songs/sort",
    async (
      request: FastifyRequest<{ Querystring: SongSort }>,
      reply: FastifyReply,
    ) => {
      const limit = request.query.limit
        ? parseInt(request.query.limit, 10)
        : 10;
      const offset = request.query.offset
        ? parseInt(request.query.offset, 10)
        : 0;

      const sortBy = request.query.sortBy;
      const sortOrder = request.query.sortOrder === "desc" ? "desc" : "asc";
      const totalSongs = await prisma.song.count();

      try {
        const songs = await prisma.song.findMany({
          orderBy: {
            [sortBy]: sortOrder,
          },
          take: limit,
          skip: offset,
        });

        const { data, pagination } = paginate(totalSongs, limit, offset, songs);

        reply.send({
          take: limit,
          data,
          pagination,
        });
      } catch (error) {
        return reply
          .code(400)
          .send({ error: `'${sortBy}' is invalid column.` });
      }
    },
  );
};

export default songsRoute;
