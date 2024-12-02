import sanitize_queries from "./sanitize_queries";

// Define the function response type
type TResponseOptions = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};

// List of keys that can be part of the query options
export const optionKeys = ["page", "limit", "sortBy", "sortOrder"];

/**
 * Sanitizes and extracts pagination and sorting options from the query.
 * 
 * @param query - The query object containing pagination and sorting options.
 * 
 * @returns An object with sanitized pagination and sorting options, including:
 *   - page: The current page number.
 *   - limit: The number of items per page.
 *   - skip: The number of items to skip for pagination.
 *   - sortBy: The field by which to sort.
 *   - sortOrder: The order of sorting, either 'asc' or 'desc'.
 */
const sanitize_paginate = (query: Record<string, unknown>): TResponseOptions => {
  // Sanitize and extract the options from the query based on the allowed keys
  const options = sanitize_queries(query, optionKeys);

  // Get the page number, defaulting to 1 if not provided
  const page: number = Number(options?.page || 1);

  // Get the limit, defaulting to 10 if not provided
  const limit: number = Number(options?.limit || 10);

  // Calculate the skip value for pagination
  const skip: number = (page - 1) * limit;

  // Get the sort field, defaulting to 'createdAt' if not provided
  const sortBy: string = (options?.sortBy as string) || "createdAt";

  // Get the sort order, defaulting to 'asc' if not provided
  const sortOrder: string = (options?.sortOrder as string) || "asc";

  // Return the sanitized pagination and sorting options
  return { page, limit, skip, sortBy, sortOrder };
};

export default sanitize_paginate;
