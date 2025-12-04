import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Comment {
    id: string;
    username: string;
    text: string;
    createdAt: string;
}

interface Post {
    id: string;
    username: string;
    content: string;
    likes: number;
    comments: Comment[];
    createdAt: string;
}

const MOCK_FEED: Post[] = [
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

const SocialFeedScreen = () => {
    const insets = useSafeAreaInsets();
    const [posts, setPosts] = useState<Post[]>(MOCK_FEED);

    const handleLike = (postId: string) => {
        setPosts(currentPosts =>
            currentPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    const renderPost = ({ item }: { item: Post }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.avatarPlaceholder} />
                <View>
                    <Text style={styles.username}>{item.username}</Text>
                    <Text style={styles.timestamp}>{item.createdAt}</Text>
                </View>
            </View>

            <Text style={styles.content}>{item.content}</Text>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleLike(item.id)}
                >
                    <Text style={styles.actionText}>👊 {item.likes} Fist Bumps</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>💬 {item.comments.length} Hype</Text>
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
            <Text style={styles.title}>Community Feed</Text>
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
    content: {
        color: '#FFF',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 16,
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#333',
        paddingTop: 12,
    },
    actionButton: {
        marginRight: 24,
    },
    actionText: {
        color: '#FFD700',
        fontWeight: '600',
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
