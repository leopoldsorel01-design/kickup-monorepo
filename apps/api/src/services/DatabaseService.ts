export interface Location {
    latitude: number;
    longitude: number;
}

export interface Player {
    id: string;
    username: string;
    skillLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'PRO';
    ageGroup: 'UNDER_12' | 'UNDER_15' | 'UNDER_18' | 'ADULT';
    position: 'GOALKEEPER' | 'DEFENDER' | 'MIDFIELDER' | 'FORWARD';
    location: Location;
    birthDate: string; // ISO Date string for age verification
}

export interface Post {
    id: string;
    username: string;
    content: string;
    imageUrl?: string;
    likes: number;
    comments: Comment[];
    createdAt: string;
}

export interface Comment {
    id: string;
    username: string;
    text: string;
    createdAt: string;
}

export interface DigitalAsset {
    id: string;
    name: string;
    type: string;
    imageUrl: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    type: string;
}

export class DatabaseService {
    private players: Player[] = [
        {
            id: '1',
            username: 'Striker99',
            skillLevel: 'ADVANCED',
            ageGroup: 'ADULT',
            position: 'FORWARD',
            location: { latitude: 40.7128, longitude: -74.0060 },
            birthDate: '1995-05-15'
        },
        {
            id: '2',
            username: 'MidfieldMaestro',
            skillLevel: 'INTERMEDIATE',
            ageGroup: 'UNDER_18',
            position: 'MIDFIELDER',
            location: { latitude: 40.7138, longitude: -74.0070 },
            birthDate: '2007-08-20'
        },
        {
            id: '3',
            username: 'GoalieOne',
            skillLevel: 'BEGINNER',
            ageGroup: 'UNDER_12',
            position: 'GOALKEEPER',
            location: { latitude: 40.7580, longitude: -73.9855 },
            birthDate: '2013-02-10'
        },
        {
            id: '4',
            username: 'ProDefender',
            skillLevel: 'PRO',
            ageGroup: 'ADULT',
            position: 'DEFENDER',
            location: { latitude: 34.0522, longitude: -118.2437 },
            birthDate: '1998-11-30'
        },
    ];

    private posts: Post[] = [
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
    ];

    private lockerRoom: DigitalAsset[] = [
        { id: 'a1', name: 'Golden Boots', type: 'Boots', imageUrl: 'boots_gold.png' },
        { id: 'a2', name: 'KickUp Jersey', type: 'Jersey', imageUrl: 'jersey_home.png' }
    ];

    private events: Event[] = [
        { id: 'e1', title: '5v5 Scrimmage', date: 'Tue, 5:00 PM', location: 'Central Park', type: 'Match' },
        { id: 'e2', title: 'Drill Session', date: 'Wed, 6:00 PM', location: 'Home', type: 'Training' }
    ];

    getAllPlayers(): Player[] {
        return this.players;
    }

    getFeed(): Post[] {
        return this.posts;
    }

    getLockerRoom(): DigitalAsset[] {
        return this.lockerRoom;
    }

    getEvents(): Event[] {
        return this.events;
    }

    createPost(username: string, content: string, imageUrl?: string): Post {
        const newPost: Post = {
            id: Math.random().toString(36).substr(2, 9),
            username,
            content,
            imageUrl,
            likes: 0,
            comments: [],
            createdAt: 'Just now'
        };
        this.posts.unshift(newPost);
        return newPost;
    }

    likePost(postId: string): Post | undefined {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes += 1;
        }
        return post;
    }
}

export const db = new DatabaseService();
