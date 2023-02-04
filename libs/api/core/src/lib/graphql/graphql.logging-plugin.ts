import { Plugin } from '@nestjs/apollo';
import { ApolloServerPlugin, GraphQLRequestListener } from 'apollo-server-plugin-base';

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin {}

// requestDidStart(requestContext): GraphQLRequestListener {
//   if (requestContext.request.http?.headers.has('x-apollo-tracing')) {
//     return;
//   }
//   const query = requestContext.request.query?.replace(/\s+/g, ' ').trim();
//   const variables = JSON.stringify(requestContext.request.variables);
//   console.log(
//     new Date().toISOString(),
//     `- [Request Started] { query: ${query}, variables: ${variables}, operationName: ${requestContext.request.operationName} }`,
//   );
//   return;
// }
