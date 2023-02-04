import { HttpStatusCode, RECORD_NOT_FOUND } from '@noinghe/shared/utils/lib/constants';
import { ApolloError } from 'apollo-server-express';

export class SvRecordNotFoundError extends ApolloError {
  constructor(message = RECORD_NOT_FOUND, extensions?: Record<string, any>) {
    super(message, String(HttpStatusCode.NotFound), extensions);
  }
}
