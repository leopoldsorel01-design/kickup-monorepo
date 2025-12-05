import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { db, Player } from './services/DatabaseService';

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

  enum Position {
    GOALKEEPER
    DEFENDER
    MIDFIELDER
    FORWARD
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
    position: Position!
    location: Location!
    distanceKm: Float
    badges: [Badge!]
  }

  type Badge {
    id: ID!
    name: String!
    icon: String!
    description: String!
  }

  type Comment {
    id: ID!
    username: String!
    text: String!
    createdAt: String!
  }

  type Post {
    id: ID!
    username: String!
    content: String!
    imageUrl: String
    likes: Int!
    comments: [Comment!]!
    createdAt: String!
  }

  type DigitalAsset {
    id: ID!
    name: String!
    type: String! # e.g., "Jersey", "Boots"
    imageUrl: String!
  }

  type Event {
    id: ID!
    title: String!
    date: String!
    location: String!
    type: String! # "Match", "Training"
  }

  input MatchRequest {
    latitude: Float!
    longitude: Float!
    radiusKm: Float!
    skillLevel: SkillLevel
    ageGroup: AgeGroup
    position: Position
  }

  type Query {
    hello: String
    findPlayers(filter: MatchRequest!): [Player!]!
    getFeed: [Post!]!
    getLockerRoom: [DigitalAsset!]!
    getEvents: [Event!]!
  }

  type Mutation {
    likePost(postId: ID!): Post
    createPost(content: String!, imageUrl: String): Post
  }
`;

// Haversine formula to calculate distance between two points
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat1)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// Secure helper to get user age from auth token
function getUserAge(authToken: string | undefined): number {
  // In a real app, verify JWT and extract birthDate.
  // MOCK: If no token, assume ADULT for safety or reject.
  // For this exercise, we'll simulate a user based on a header or default to 16 (Minor).
  if (authToken === 'adult-token') return 25;
  // TODO: Decode Firebase token here using firebase-admin
  return 16; // Default to minor for safety if unknown
}

interface UserContext {
  token?: string;
  id?: string;
  role?: string;
  birthDate?: string;
}

const resolvers = {
  Query: {
    hello: () => 'Hello KickUp!',
    findPlayers: (_: unknown, { filter }: { filter: any }, context: UserContext) => {
      const allPlayers = db.getAllPlayers();

      // 1. Secure Age Determination
      const requesterAge = getUserAge(context.token);
      const isRequesterMinor = requesterAge < 18;

      // 2. Privacy Filter (Source 32)
      // Strict separation: Under 18s cannot see Adults, and Adults cannot see Under 18s.
      const privacyFiltered = allPlayers.filter(player => {
        const isPlayerAdult = player.ageGroup === 'ADULT';
        if (isRequesterMinor && isPlayerAdult) return false;
        if (!isRequesterMinor && !isPlayerAdult) return false;
        return true;
      });

      // 3. Geospatial & Attribute Filtering
      return privacyFiltered
        .map(player => {
          const distance = getDistanceFromLatLonInKm(
            filter.latitude, filter.longitude,
            player.location.latitude, player.location.longitude
          );
          return { ...player, distanceKm: distance };
        })
        .filter(player => {
          if (player.distanceKm > filter.radiusKm) return false;
          if (filter.skillLevel && player.skillLevel !== filter.skillLevel) return false;
          if (filter.position && player.position !== filter.position) return false;
          // Age group is already partially handled by privacy, but if specific group requested:
          if (filter.ageGroup && player.ageGroup !== filter.ageGroup) return false;
          return true;
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);
    },
    getFeed: () => db.getFeed(),
    getLockerRoom: () => db.getLockerRoom(),
    getEvents: () => db.getEvents()
  },
  Mutation: {
    likePost: (_: any, { postId }: { postId: string }) => {
      return db.likePost(postId);
    },
    createPost: (_: any, { content, imageUrl }: { content: string, imageUrl?: string }) => {
      // Mock username from context
      return db.createPost('CurrentUser', content, imageUrl);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

console.log('Apollo Server configured.');
