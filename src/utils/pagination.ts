import { PaginationResponse } from "../interfaces/iSong";

export const paginate = <T>(
  totalCount: number,
  limit: number,
  offset: number,
  data: T[],
): { pagination: PaginationResponse; data: T[] } => {
  const totalPages = Math.ceil(totalCount / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const pagination: PaginationResponse = {
    total_pages: totalPages,
    current_page: currentPage,
    next_page:
      currentPage < totalPages
        ? `/songs?limit=${limit}&offset=${offset + limit}`
        : null,
    previous_page:
      currentPage > 1 ? `/songs?limit=${limit}&offset=${offset - limit}` : null,
  };

  return { pagination, data };
};
