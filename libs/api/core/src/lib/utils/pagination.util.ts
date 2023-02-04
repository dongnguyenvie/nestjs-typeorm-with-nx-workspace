export function paginationHelper({ limit = 10, page = 1, totalCount = null }) {
  if (page < 1) {
    page = 1;
  }
  const skippedItems = (page - 1) * limit;

  return {
    page,
    skippedItems: skippedItems as number,
    totalCount,
    limit,
  };
}
