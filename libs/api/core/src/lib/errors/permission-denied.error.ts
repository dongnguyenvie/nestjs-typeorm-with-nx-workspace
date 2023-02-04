import { HttpStatusCode, PERMISSION_DENIED } from '@noinghe/shared/utils/lib/constants';
import { ApolloError } from 'apollo-server-express';

export class SvPermissionDeniedError extends ApolloError {
  constructor(message = PERMISSION_DENIED, extensions?: Record<string, any>) {
    super(message, String(HttpStatusCode.Forbidden), extensions);
  }
}
