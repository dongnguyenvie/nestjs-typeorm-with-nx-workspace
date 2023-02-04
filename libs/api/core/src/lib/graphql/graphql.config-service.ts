import { GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';
import { join } from 'path';
import GraphQLJSON from 'graphql-type-json';
import { ApolloDriverConfig } from '@nestjs/apollo';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): ApolloDriverConfig {
    return {
      context: ({ req, res, connection }) => (connection ? { req: connection.context, res } : { req, res }),
      // subscriptions: {
      //   // onConnect: (connectionParams: any) => {
      //   //   if (connectionParams.authorization) {
      //   //     return { headers: { authorization: connectionParams.authorization } };
      //   //   }
      //   //   return {};
      //   // },
      // },
      path: '/graphql',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      installSubscriptionHandlers: true,
      resolverValidationOptions: {},
      debug: process.env.NODE_ENV === 'development',
      introspection: true,
      playground: process.env.NODE_ENV === 'development',
      resolvers: {
        JSON: GraphQLJSON, // input type json
      },
      // cors: {
      //   credentials: true,
      //   origin: []
      // },
      sortSchema: true,
      // cors: appConfig().cors,
    };
  }
}
