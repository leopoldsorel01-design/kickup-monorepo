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
    requesterAge: Int! # Required for privacy filtering
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

const resolvers = {
  Query: {
    hello: () => 'Hello KickUp!',
    findPlayers: (_: any, { filter }: { filter: any }) => {
      // Mock Database
      const mockPlayers = [
        { id: '1', username: 'Striker99', skillLevel: 'ADVANCED', ageGroup: 'ADULT', position: 'FORWARD', location: { latitude: 40.7128, longitude: -74.0060 } }, // NYC
        { id: '2', username: 'MidfieldMaestro', skillLevel: 'INTERMEDIATE', ageGroup: 'UNDER_18', position: 'MIDFIELDER', location: { latitude: 40.7138, longitude: -74.0070 } }, // NYC nearby
        { id: '3', username: 'GoalieOne', skillLevel: 'BEGINNER', ageGroup: 'UNDER_12', position: 'GOALKEEPER', location: { latitude: 40.7580, longitude: -73.9855 } }, // Times Square
        { id: '4', username: 'ProDefender', skillLevel: 'PRO', ageGroup: 'ADULT', position: 'DEFENDER', location: { latitude: 34.0522, longitude: -118.2437 } }, // LA
      ];

      // 1. Privacy Filter (Source 32)
      // Strict separation: Under 18s cannot see Adults, and Adults cannot see Under 18s.
      const isRequesterMinor = filter.requesterAge < 18;

      const privacyFiltered = mockPlayers.filter(player => {
        const isPlayerAdult = player.ageGroup === 'ADULT';
        if (isRequesterMinor && isPlayerAdult) return false;
        if (!isRequesterMinor && !isPlayerAdult) return false;
        return true;
      });

      // 2. Geospatial & Attribute Filtering
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
    getFeed: () => [
      {
        id: '101',
        username: 'MbappeFan',
        content: 'Just hit a 50 streak on the juggling drill! ⚽️🔥',
        likes: 24,
        comments: [{ id: 'c1', username: 'CoachMike', text: 'Great form!', createdAt: '2m ago' }],
        createdAt: '10m ago'
      },
      {
        id: '102',
        username: 'LocalLegend',
        content: 'Looking for a keeper for Tuesday night match. DM me.',
        likes: 5,
        comments: [],
        createdAt: '1h ago'
      }
    ],
    getLockerRoom: () => [
      { id: 'a1', name: 'Golden Boots', type: 'Boots', imageUrl: 'boots_gold.png' },
      { id: 'a2', name: 'KickUp Jersey', type: 'Jersey', imageUrl: 'jersey_home.png' }
    ],
    getEvents: () => [
      { id: 'e1', title: '5v5 Scrimmage', date: 'Tue, 5:00 PM', location: 'Central Park', type: 'Match' },
      { id: 'e2', title: 'Drill Session', date: 'Wed, 6:00 PM', location: 'Home', type: 'Training' }
    ]
  },
  Mutation: {
    likePost: (_: any, { postId }: { postId: string }) => {
      // Mock mutation
      return {
        id: postId,
        username: 'MbappeFan',
        content: 'Just hit a 50 streak on the juggling drill! ⚽️🔥',
        likes: 25, // Incremented
        comments: [],
        createdAt: '10m ago'
      };
    },
    createPost: (_: any, { content }: { content: string }) => {
      return {
        id: 'new_post',
        username: 'CurrentUser',
        content,
        likes: 0,
        comments: [],
        createdAt: 'Just now'
      };
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

console.log('Apollo Server configured.');
