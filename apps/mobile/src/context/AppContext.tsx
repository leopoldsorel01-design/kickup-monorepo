import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Alert } from 'react-native';
import { Player, SkillLevel, AgeGroup, Position, Stats } from '../types/matchmaking';

// --- Types ---

export type HypeType = 'TECHNIQUE' | 'EFFORT' | 'VISION';

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // Emoji or image URL
    unlocked: boolean;
}

export interface UserProfile {
    id: string;
    username: string;
    age: number; // Actual age for safety checks
    position: Position;
    xp: number;
    skillLevel: SkillLevel;
    badges: Badge[];
    matchesPlayed: number;
    // New Holistic Stats
    streak: number;
    inventory: string[]; // Unlocked items (Vestiaire Évolutif)
    hypeStats: { [key in HypeType]: number }; // Received hype
    bestDrillScore: number; // For Ghost Mode
    stats: Stats;
}

export interface Comment {
    id: string;
    username: string;
    text: string;
    createdAt: string;
}

export interface Post {
    id: string;
    username: string;
    content: string;
    reactions: { [key in HypeType]: number }; // Replaces simple likes
    userReaction?: HypeType; // Current user's reaction
    comments: Comment[];
    createdAt: string;
    isChallenge?: boolean; // For Chrono-Défi
}

export interface MatchRequest {
    id: string;
    fromUserId: string;
    toPlayerId: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
    timestamp: number;
}

interface AppContextType {
    user: UserProfile;
    posts: Post[];
    pendingMatches: MatchRequest[];
    fatigueFlag: boolean;

    // Actions
    reactToPost: (postId: string, type: HypeType) => void;
    addComment: (postId: string, text: string) => void;
    challengePlayer: (player: Player) => void; // Also used for Squad Invite
    gainXp: (amount: number) => void;
    unlockReward: (itemName: string) => void;
    sendSquadInvite: (userId: string) => void;
    logDrillSession: (score: number) => void;
    setFatigueFlag: (status: boolean) => void;
}

// --- Initial State ---

const INITIAL_BADGES: Badge[] = [
    { id: 'b1', name: 'Early Riser', description: 'Complete a drill before 8am', icon: '🌅', unlocked: false },
    { id: 'b2', name: 'Streak Keeper', description: 'Login 7 days in a row', icon: '🔥', unlocked: false },
    { id: 'b3', name: 'Pro Prospect', description: 'Reach 1000 XP', icon: '🏆', unlocked: false },
];

const INITIAL_USER: UserProfile = {
    id: 'u1',
    username: 'KickUpHero',
    age: 16, // Minor for testing safety
    position: Position.MIDFIELDER,
    xp: 850,
    skillLevel: SkillLevel.INTERMEDIATE,
    badges: INITIAL_BADGES,
    matchesPlayed: 12,
    streak: 5,
    inventory: ['Basic Kit'],
    hypeStats: {
        TECHNIQUE: 12,
        EFFORT: 45,
        VISION: 8
    },
    bestDrillScore: 12, // "Record: 12" from prompt
    stats: {
        pace: 75,
        shooting: 60,
        passing: 82,
        dribbling: 85,
        defense: 40,
        physical: 65
    }
};

const INITIAL_POSTS: Post[] = [
    {
        id: '101',
        username: 'MbappeFan',
        content: 'Just hit a 50 streak on the juggling drill! ⚽️🔥',
        reactions: { TECHNIQUE: 5, EFFORT: 20, VISION: 1 },
        comments: [{ id: 'c1', username: 'CoachMike', text: 'Great form!', createdAt: '2m ago' }],
        createdAt: '10m ago',
        isChallenge: true,
    },
    {
        id: '102',
        username: 'LocalLegend',
        content: 'Looking for a keeper for Tuesday night match. DM me.',
        reactions: { TECHNIQUE: 0, EFFORT: 2, VISION: 0 },
        comments: [],
        createdAt: '1h ago',
    },
];

// --- Context ---

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserProfile>(INITIAL_USER);
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [pendingMatches, setPendingMatches] = useState<MatchRequest[]>([]);
    const [fatigueFlag, setFatigueFlag] = useState(false);

    // Gamification Engine: Check for badge unlocks
    useEffect(() => {
        if (user.xp >= 1000) {
            unlockBadge('b3');
        }
    }, [user.xp]);

    const unlockBadge = (badgeId: string) => {
        const badgeIndex = user.badges.findIndex(b => b.id === badgeId);
        if (badgeIndex !== -1 && !user.badges[badgeIndex].unlocked) {
            const newBadges = [...user.badges];
            newBadges[badgeIndex] = { ...newBadges[badgeIndex], unlocked: true };
            setUser(prev => ({ ...prev, badges: newBadges }));
            Alert.alert('🏆 Badge Unlocked!', `You earned the "${newBadges[badgeIndex].name}" badge!`);
        }
    };

    const gainXp = (amount: number) => {
        setUser(prev => ({ ...prev, xp: prev.xp + amount }));
    };

    const reactToPost = (postId: string, type: HypeType) => {
        setPosts(currentPosts =>
            currentPosts.map(post => {
                if (post.id === postId) {
                    // If already reacted with same type, toggle off (optional, but let's just allow switching or adding)
                    // For MVP, let's assume one reaction per user per post, or just increment.
                    // Prompt says "Clicking one sends a specific notification".

                    const isSameReaction = post.userReaction === type;

                    if (isSameReaction) return post; // No change if clicking same

                    const newReactions = { ...post.reactions };

                    // Remove old reaction if exists
                    if (post.userReaction) {
                        newReactions[post.userReaction] = Math.max(0, newReactions[post.userReaction] - 1);
                    }

                    // Add new reaction
                    newReactions[type] = newReactions[type] + 1;

                    // Notify
                    Alert.alert('🔥 Hype Sent!', `You recognized their ${type}!`);

                    return { ...post, reactions: newReactions, userReaction: type };
                }
                return post;
            })
        );
    };

    const addComment = (postId: string, text: string) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            username: user.username,
            text,
            createdAt: 'Just now'
        };

        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === postId
                    ? { ...post, comments: [...post.comments, newComment] }
                    : post
            )
        );
        Alert.alert('💬 Hype!', 'Comment added.');
    };

    const challengePlayer = (player: Player) => {
        const newRequest: MatchRequest = {
            id: Date.now().toString(),
            fromUserId: user.id,
            toPlayerId: player.id,
            status: 'PENDING',
            timestamp: Date.now(),
        };
        setPendingMatches(prev => [...prev, newRequest]);
        Alert.alert('⚔️ Challenge Sent!', `You have challenged ${player.username}. Waiting for response...`);
    };

    const sendSquadInvite = (userId: string) => {
        // Logic to invite a user from feed to a squad/match
        Alert.alert('📨 Squad Invite', `Invite sent to ${userId}! They will appear in your matchmaking queue.`);
        // In a real app, this would create a notification or a specific match request type
    };

    const unlockReward = (itemName: string) => {
        if (!user.inventory.includes(itemName)) {
            setUser(prev => ({ ...prev, inventory: [...prev.inventory, itemName] }));
            Alert.alert('🎁 Vestiaire Évolutif', `You unlocked: ${itemName}!`);
        }
    };

    const logDrillSession = (score: number) => {
        // Check for Ghost Mode record
        if (score > user.bestDrillScore) {
            setUser(prev => ({ ...prev, bestDrillScore: score }));
            // Trigger Loot
            unlockReward(`Elite Kit (Level ${Math.floor(score / 10)})`);
        }

        // Fatigue Logic: Simple simulation
        // If score is high (lots of effort), maybe set fatigue?
        // Or just random for MVP demo as per prompt "Simulate: Fatigue -> HealthCheck"
        if (Math.random() > 0.7) {
            setFatigueFlag(true);
            Alert.alert('⚠️ Fatigue Detected', 'Your AI Garde du Corps suggests checking your Health stats.');
        }
    };

    return (
        <AppContext.Provider value={{
            user,
            posts,
            pendingMatches,
            fatigueFlag,
            reactToPost,
            addComment,
            challengePlayer,
            gainXp,
            unlockReward,
            sendSquadInvite,
            logDrillSession,
            setFatigueFlag
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
