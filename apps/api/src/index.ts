import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  type Query {
    hello: String
  }
`;

const resolvers = {
    Query: {
        hello: () => 'Hello KickUp!',
    },
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Note: This is a placeholder. In a real app, we'd use startStandaloneServer
// or expressMiddleware depending on the setup.
console.log('Apollo Server configured.');
