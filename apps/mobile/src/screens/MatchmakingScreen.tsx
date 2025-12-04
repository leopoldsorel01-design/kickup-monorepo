import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Player, SkillLevel, AgeGroup, Position } from '../types/matchmaking';

// Mock Data (since we don't have Apollo Client set up in Mobile yet)
const MOCK_PLAYERS: Player[] = [
    {
        id: '1',
        username: 'Striker99',
        skillLevel: SkillLevel.ADVANCED,
        ageGroup: AgeGroup.ADULT,
        location: { latitude: 40.7128, longitude: -74.0060 },
        distanceKm: 1.2
    },
    {
        id: '2',
        username: 'MidfieldMaestro',
        skillLevel: SkillLevel.INTERMEDIATE,
        ageGroup: AgeGroup.UNDER_18,
        location: { latitude: 40.7138, longitude: -74.0070 },
        distanceKm: 0.5
    }
];

const MatchmakingScreen = () => {
    const insets = useSafeAreaInsets();
    const [players, setPlayers] = useState<Player[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setPlayers(MOCK_PLAYERS);
            setLoading(false);
        }, 1500);
    }, []);

    const renderPlayer = ({ item }: { item: Player }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.distance}>{item.distanceKm} km</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.detail}>Skill: {item.skillLevel}</Text>
                <Text style={styles.detail}>Age: {item.ageGroup}</Text>
            </View>
            <TouchableOpacity style={styles.challengeButton}>
                <Text style={styles.challengeText}>CHALLENGE</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>Nearby Players</Text>
            {loading ? (
                <Text style={styles.loading}>Scanning area...</Text>
            ) : (
                <FlatList
                    data={players}
                    renderItem={renderPlayer}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
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
    loading: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 50,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#FFD700',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    username: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    distance: {
        color: '#AAA',
        fontSize: 14,
    },
    cardBody: {
        marginBottom: 12,
    },
    detail: {
        color: '#CCC',
        fontSize: 14,
        marginBottom: 4,
    },
    challengeButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    challengeText: {
        color: '#FFD700',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    },
});

export default MatchmakingScreen;
