interface Song {
  id: number;
  title: string;
  artist: string;
  writer: string;
  album: string;
  playsJune: number;
  playsJuly: number;
  playsAugust: number;
}

interface PaginationParams {
  limit: string;
  offset: string;
}

interface SongParams {
  year: string;
  period: string;
}

interface SongQuery extends PaginationParams {
  q: string;
}

interface SongSort extends PaginationParams {
  sortBy: string;
  sortOrder: string;
}

interface PopularSong extends Song {
  totalPlays: number;
}

interface PaginationResponse {
  total_pages: number;
  current_page: number;
  next_page: string | null;
  previous_page: string | null;
}

export type {
  Song,
  PaginationParams,
  SongParams,
  SongQuery,
  SongSort,
  PopularSong,
  PaginationResponse,
};
