import { BAD_REQUEST, HttpStatusCode } from '@noinghe/shared/utils/lib/constants';
import { ApolloError } from 'apollo-server-express';

export class SvIntputError extends ApolloError {
  constructor(message = BAD_REQUEST, extensions?: Record<string, any>) {
    super(message, String(HttpStatusCode.BadRequest), extensions);
  }
}
