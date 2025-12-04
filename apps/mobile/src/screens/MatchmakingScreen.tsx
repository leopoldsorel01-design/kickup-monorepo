import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { VibeSelector, Vibe } from '../components/VibeSelector';
import { JerseyIcon } from '../components/JerseyIcon';
import { RadarChart } from '../components/RadarChart';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock Data
const MOCK_PLAYERS = [
    {
        id: '1',
        name: 'Leo',
        vibe: Vibe.COMPETITIVE,
        kit: { primary: '#FF0000', secondary: '#FFFFFF', num: '10' },
        stats: { pace: 85, shooting: 80, passing: 75, dribbling: 90, defense: 40, physical: 60 }
    },
    {
        id: '2',
        name: 'Sam',
        vibe: Vibe.CHILL,
        kit: { primary: '#00FF00', secondary: '#000000', num: '7' },
        stats: { pace: 70, shooting: 60, passing: 85, dribbling: 75, defense: 50, physical: 55 }
    },
    {
        id: '3',
        name: 'Alex',
        vibe: Vibe.TRAINING,
        kit: { primary: '#0000FF', secondary: '#FFFF00', num: '23' },
        stats: { pace: 60, shooting: 50, passing: 70, dribbling: 65, defense: 80, physical: 85 }
    },
    {
        id: '4',
        name: 'Mike',
        vibe: Vibe.COMPETITIVE,
        kit: { primary: '#000000', secondary: '#FFFFFF', num: '9' },
        stats: { pace: 88, shooting: 85, passing: 60, dribbling: 80, defense: 30, physical: 75 }
    },
    {
        id: '5',
        name: 'Tom',
        vibe: Vibe.CHILL,
        kit: { primary: '#FFFFFF', secondary: '#000000', num: '1' },
        stats: { pace: 50, shooting: 40, passing: 60, dribbling: 50, defense: 70, physical: 60 }
    },
];

export const MatchmakingScreen = () => {
    const [selectedVibe, setSelectedVibe] = useState<Vibe>(Vibe.CHILL);
    const [userKit, setUserKit] = useState({ primary: '#FFFFFF', secondary: '#000000', num: '10' });

    useEffect(() => {
        loadUserKit();
    }, []);

    const loadUserKit = async () => {
        try {
            const savedKit = await AsyncStorage.getItem('KICKUP_KIT');
            if (savedKit) {
                setUserKit(JSON.parse(savedKit));
            }
        } catch (e) {
            console.error('Failed to load user kit', e);
        }
    };

    const filteredPlayers = MOCK_PLAYERS.filter(p => p.vibe === selectedVibe);

    const renderPlayer = ({ item }: { item: typeof MOCK_PLAYERS[0] }) => (
        <View style={styles.playerCard}>
            <View style={styles.visualsContainer}>
                <View style={styles.jerseyContainer}>
                    <JerseyIcon
                        primaryColor={item.kit.primary}
                        secondaryColor={item.kit.secondary}
                        number={item.kit.num}
                        size={60}
                    />
                </View>
                <View style={styles.radarContainer}>
                    <RadarChart stats={item.stats} size={80} />
                </View>
            </View>

            <View style={styles.playerInfo}>
                <View style={styles.nameRow}>
                    <Text style={styles.playerName}>{item.name}</Text>
                    <Text style={styles.playerVibe}>{item.vibe}</Text>
                </View>
                <TouchableOpacity style={styles.challengeButton}>
                    <Text style={styles.challengeButtonText}>Challenge</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Find a Match</Text>
                <View style={styles.userPreview}>
                    <Text style={styles.userPreviewText}>You:</Text>
                    <JerseyIcon
                        primaryColor={userKit.primary}
                        secondaryColor={userKit.secondary}
                        number={userKit.num}
                        size={30}
                    />
                </View>
            </View>

            <View style={styles.vibeSelectorContainer}>
                <VibeSelector selectedVibe={selectedVibe} onSelectVibe={setSelectedVibe} />
            </View>

            <FlatList
                data={filteredPlayers}
                renderItem={renderPlayer}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No players found for this vibe.</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    userPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    userPreviewText: {
        fontSize: 14,
        color: '#666',
    },
    vibeSelectorContainer: {
        paddingVertical: 10,
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    listContent: {
        padding: 10,
    },
    playerCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 15,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    visualsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 15,
    },
    jerseyContainer: {
        alignItems: 'center',
    },
    radarContainer: {
        alignItems: 'center',
    },
    playerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 10,
    },
    nameRow: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    playerVibe: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    challengeButton: {
        backgroundColor: '#000',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    challengeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 16,
    },
});
