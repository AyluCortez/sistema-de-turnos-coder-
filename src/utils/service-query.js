export const SORT_FIELDS = ["price", "title"];
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

export const applySortCompatibility = (query = {}) => {
  const next = { ...query };

  if (next.sort && !next.sortBy) {
    next.sortBy = "price";
    next.order = next.sort;
  }

  return next;
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildServiceFilter = ({ title, specialty, status, minPrice, maxPrice } = {}) => {
  const filter = {};

  if (specialty) {
    filter.specialty = specialty;
  }

  if (title) {
    filter.title = { $regex: escapeRegex(title), $options: "i" };
  }

  if (status !== undefined) {
    filter.status = status;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  return filter;
};

export const buildSort = ({ sortBy = "price", order = "asc" } = {}) => {
  const field = SORT_FIELDS.includes(sortBy) ? sortBy : "price";
  const direction = order === "desc" ? -1 : 1;
  return { [field]: direction };
};

export const buildPageLinks = ({ path, query = {}, limit, prevPage, nextPage }) => {
  const toLink = (targetPage) => {
    if (targetPage == null) return null;

    const params = new URLSearchParams();
    if (query.title) params.set("title", query.title);
    if (query.specialty) params.set("specialty", query.specialty);
    if (query.status !== undefined) params.set("status", String(query.status));
    if (query.minPrice !== undefined) params.set("minPrice", String(query.minPrice));
    if (query.maxPrice !== undefined) params.set("maxPrice", String(query.maxPrice));
    params.set("page", String(targetPage));
    params.set("limit", String(limit));
    if (query.sortBy) params.set("sortBy", query.sortBy);
    if (query.order) params.set("order", query.order);
    return `${path}?${params.toString()}`;
  };

  return {
    prevLink: toLink(prevPage),
    nextLink: toLink(nextPage),
  };
};
