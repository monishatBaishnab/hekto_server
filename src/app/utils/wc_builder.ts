import sanitize_queries from "./sanitize_queries";

/**
 * Build 'where' conditions for a Prisma query based on provided search term and filters.
 * 
 * @param query - The query object containing search and filter parameters.
 * @param searchFields - The fields in which to search for the search term.
 * @param filterKeys - The keys in the query to apply specific filters.
 * 
 * @returns An array of 'where' conditions to be used in a Prisma query.
 */

const wc_builder = (
  query: Record<string, unknown>,
  searchFields: string[],
  filterKeys: string[]
) => {
  // Extract search term from the query
  const { searchTerm } = query;

  // Sanitize and extract filters from the query using the provided filter keys
  const filters = sanitize_queries(query, filterKeys);

  // Initialize an array to hold the 'where' conditions for the Prisma query
  const whereConditions = [];
  
  // Always ensure we exclude deleted records
  whereConditions.push({ isDeleted: false });

  // If a search term is provided, add search conditions to the 'where' conditions
  if (searchTerm) {
    whereConditions.push({
      OR: searchFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      })),
    });
  }

  // If filters are provided, add them to the 'where' conditions
  if (filters) {
    whereConditions.push({
      AND: Object.keys(filters).map((key) => ({
        [key]: { equals: filters[key] },
      })),
    });
  }

  // Return the built 'where' conditions
  return whereConditions;
};

export default wc_builder;
