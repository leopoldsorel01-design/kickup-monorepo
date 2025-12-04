import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const typeDefs = `#graphql
  enum SkillLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
    PRO
  }

  enum AgeGroup {
    UNDER_12
    UNDER_15
    UNDER_18
    ADULT
  }

  type Location {
    latitude: Float!
    longitude: Float!
  }

  type Player {
    id: ID!
    username: String!
    skillLevel: SkillLevel!
    ageGroup: AgeGroup!
    location: Location!
    distanceKm: Float
  }

  input MatchmakingFilter {
    latitude: Float!
    longitude: Float!
    radiusKm: Float!
    skillLevel: SkillLevel
    ageGroup: AgeGroup
  }

  type Query {
    hello: String
    findPlayers(filter: MatchmakingFilter!): [Player!]!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello KickUp!',
    findPlayers: (_: any, { filter }: { filter: any }) => {
      // Mock data - in a real app this would query a geospatial database
      // and apply privacy filters (Source 32: Privacy Filters)
      const mockPlayers = [
        {
          id: '1',
          username: 'Striker99',
          skillLevel: 'ADVANCED',
          ageGroup: 'ADULT',
          location: { latitude: 40.7128, longitude: -74.0060 },
          distanceKm: 1.2
        },
        {
          id: '2',
          username: 'MidfieldMaestro',
          skillLevel: 'INTERMEDIATE',
          ageGroup: 'UNDER_18',
          location: { latitude: 40.7138, longitude: -74.0070 },
          distanceKm: 0.5
        }
      ];

      // Basic filtering logic for the mock
      return mockPlayers.filter(player => {
        if (filter.skillLevel && player.skillLevel !== filter.skillLevel) return false;
        if (filter.ageGroup && player.ageGroup !== filter.ageGroup) return false;
        // In a real implementation, we would filter by distance here using the radiusKm
        return true;
      });
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Note: This is a placeholder. In a real app, we'd use startStandaloneServer
// or expressMiddleware depending on the setup.
console.log('Apollo Server configured.');
