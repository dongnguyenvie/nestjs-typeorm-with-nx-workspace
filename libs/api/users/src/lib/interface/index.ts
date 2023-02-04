import { IPagination } from '@noinghe/shared/utils/lib/interfaces';

export interface IListPayload {
  pagination: IPagination;
  relations?: string[];
}

export interface ICreateUserPayload {
  email: string;

  password: string;
}
