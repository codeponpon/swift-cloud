import { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../utils/prismaClient";
import {
  PaginationParams,
  PaginationResponse,
  PopularSong,
  SongParams,
  SongQuery,
  SongSort,
} from "../../interfaces/iSong";

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
      const totalPages = Math.ceil(totalSongs / limit);
      const currentPage = Math.floor(offset / limit) + 1;

      const songs = await prisma.song.findMany({
        take: limit,
        skip: offset,
      });

      const pagination: PaginationResponse = {
        total_pages: totalPages,
        current_page: currentPage,
        next_page:
          currentPage < totalPages
            ? `/songs?limit=${limit}&offset=${offset + limit}`
            : null,
        previous_page:
          currentPage > 1
            ? `/songs?limit=${limit}&offset=${offset - limit}`
            : null,
      };

      reply.send({
        take: limit,
        data: songs,
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
      const totalPages = Math.ceil(totalSongs / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const pagination = {
        total_pages: totalPages,
        current_page: currentPage,
        next_page:
          currentPage < totalPages
            ? `/songs?limit=${limit}&offset=${offset + limit}`
            : null,
        previous_page:
          currentPage > 1
            ? `/songs?limit=${limit}&offset=${offset - limit}`
            : null,
      };

      const songs = await prisma.song.findMany({
        where: {
          year,
        },
        take: limit,
        skip: offset,
      });

      reply.send({
        take: limit,
        data: songs,
        pagination,
      });
      reply.send(songs);
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
      const totalPages = Math.ceil(totalSongs / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const pagination = {
        total_pages: totalPages,
        current_page: currentPage,
        next_page:
          currentPage < totalPages
            ? `/songs?limit=${limit}&offset=${offset + limit}`
            : null,
        previous_page:
          currentPage > 1
            ? `/songs?limit=${limit}&offset=${offset - limit}`
            : null,
      };

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
          // Convert totalPlays to a string
          popularSongs = popularSongs.map((song) => ({
            ...song,
            totalPlays: Number(song.totalPlays),
          }));
          return reply.send({
            take: limit,
            data: popularSongs,
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

      reply.send({
        take: limit,
        data: songs,
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
      const totalPages = Math.ceil(totalSongs / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const pagination = {
        total_pages: totalPages,
        current_page: currentPage,
        next_page:
          currentPage < totalPages
            ? `/songs?limit=${limit}&offset=${offset + limit}`
            : null,
        previous_page:
          currentPage > 1
            ? `/songs?limit=${limit}&offset=${offset - limit}`
            : null,
      };

      const searchResults = await prisma.song.findMany({
        where,
        take: limit,
        skip: offset,
      });

      reply.send({
        take: limit,
        data: searchResults,
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

      const totalSongs = await prisma.song.count();
      const totalPages = Math.ceil(totalSongs / limit);
      const currentPage = Math.floor(offset / limit) + 1;
      const pagination = {
        total_pages: totalPages,
        current_page: currentPage,
        next_page:
          currentPage < totalPages
            ? `/songs?limit=${limit}&offset=${offset + limit}`
            : null,
        previous_page:
          currentPage > 1
            ? `/songs?limit=${limit}&offset=${offset - limit}`
            : null,
      };

      const sortBy = request.query.sortBy;
      const sortOrder = request.query.sortOrder === "desc" ? "desc" : "asc";
      const sortedSongs = await prisma.song.findMany({
        orderBy: {
          [sortBy]: sortOrder,
        },
        take: limit,
        skip: offset,
      });

      reply.send({
        take: limit,
        data: sortedSongs,
        pagination,
      });
    },
  );
};

export default songsRoute;
