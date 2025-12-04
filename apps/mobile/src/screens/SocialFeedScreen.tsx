import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, Post, HypeType } from '../context/AppContext';

// Simple Challenge Timer Component
const ChallengeTimer = () => {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 hours in seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
    };

    return (
        <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>⏳ Chrono-Défi Ends in:</Text>
            <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>
    );
};

const SocialFeedScreen = () => {
    const insets = useSafeAreaInsets();
    const { posts, reactToPost, sendSquadInvite } = useApp();

    const handleReaction = (postId: string, type: HypeType) => {
        reactToPost(postId, type);
    };

    const handleRecruit = (username: string) => {
        sendSquadInvite(username);
    };

    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.avatarPlaceholder} />
                <View>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.timestamp}>{item.createdAt}</Text>
                </View>
                {/* Mercato Integration */}
                <TouchableOpacity
                    style={styles.recruitButton}
                    onPress={() => handleRecruit(item.username)}
                >
                    <Text style={styles.recruitText}>📝 Recruter</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.content}>{item.content}</Text>

            {/* Chrono-Défi Timer */}
            {item.isChallenge && <ChallengeTimer />}

            {/* Hype Tags Reaction Bar */}
            <View style={styles.reactionBar}>
                <TouchableOpacity
                    style={[styles.reactionButton, item.userReaction === 'TECHNIQUE' && styles.reactionActive]}
                    onPress={() => handleReaction(item.id, 'TECHNIQUE')}
                >
                    <Text style={styles.reactionIcon}>👟</Text>
                    <Text style={styles.reactionCount}>{item.reactions.TECHNIQUE}</Text>
                    <Text style={styles.reactionLabel}>Tech</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.reactionButton, item.userReaction === 'EFFORT' && styles.reactionActive]}
                    onPress={() => handleReaction(item.id, 'EFFORT')}
                >
                    <Text style={styles.reactionIcon}>💪</Text>
                    <Text style={styles.reactionCount}>{item.reactions.EFFORT}</Text>
                    <Text style={styles.reactionLabel}>Effort</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.reactionButton, item.userReaction === 'VISION' && styles.reactionActive]}
                    onPress={() => handleReaction(item.id, 'VISION')}
                >
                    <Text style={styles.reactionIcon}>🧠</Text>
                    <Text style={styles.reactionCount}>{item.reactions.VISION}</Text>
                    <Text style={styles.reactionLabel}>Vision</Text>
                </TouchableOpacity>
            </View>

            {item.comments.length > 0 && (
                <View style={styles.commentsSection}>
                    {item.comments.map(comment => (
                        <View key={comment.id} style={styles.comment}>
                            <Text style={styles.commentUser}>{comment.username}: </Text>
                            <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>Mercato du Feed</Text>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 20,
        marginTop: 10,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FFD700',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#333',
        marginRight: 12,
    },
    username: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timestamp: {
        color: '#AAA',
        fontSize: 12,
    },
    recruitButton: {
        marginLeft: 'auto',
        backgroundColor: '#333',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    recruitText: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    timerContainer: {
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        padding: 8,
        borderRadius: 8,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
    },
    timerLabel: {
        color: '#FF4444',
        fontWeight: 'bold',
    },
    timerValue: {
        color: '#FFF',
        fontFamily: 'monospace',
        fontWeight: 'bold',
    },
    reactionBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 12,
    },
    reactionButton: {
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        minWidth: 60,
    },
    reactionActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    reactionIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    reactionCount: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    reactionLabel: {
        color: '#AAA',
        fontSize: 10,
        marginTop: 2,
    },
    commentsSection: {
        marginTop: 12,
        backgroundColor: '#111',
        padding: 8,
        borderRadius: 8,
    },
    comment: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    commentUser: {
        color: '#AAA',
        fontWeight: 'bold',
    },
    commentText: {
        color: '#DDD',
    },
});

export default SocialFeedScreen;
