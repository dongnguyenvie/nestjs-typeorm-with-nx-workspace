export interface IPagination {
  limit: number;

  page: number;

  totalCount: number;
}

export interface IListPayload {
  pagination: IPagination;
  relations?: string[];
}
