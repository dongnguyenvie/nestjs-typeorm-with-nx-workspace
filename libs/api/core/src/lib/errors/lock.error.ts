import { HttpStatusCode, RECORD_LOCKED } from '@noinghe/shared/utils/lib/constants';
import { ApolloError } from 'apollo-server-express';

export class SvLockError extends ApolloError {
  constructor(message = RECORD_LOCKED, extensions?: Record<string, any>) {
    super(message, String(HttpStatusCode.Locked), extensions);
  }
}
