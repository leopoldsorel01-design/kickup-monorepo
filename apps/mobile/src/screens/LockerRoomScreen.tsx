import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DigitalAsset {
    id: string;
    name: string;
    type: string;
    imageUrl: string; // Placeholder for now
}

const MOCK_ASSETS: DigitalAsset[] = [
    { id: 'a1', name: 'Golden Boots', type: 'Boots', imageUrl: 'boots_gold' },
    { id: 'a2', name: 'KickUp Jersey', type: 'Jersey', imageUrl: 'jersey_home' },
    { id: 'a3', name: 'Neon Ball', type: 'Equipment', imageUrl: 'ball_neon' }
];

const LockerRoomScreen = () => {
    const insets = useSafeAreaInsets();

    const renderAsset = ({ item }: { item: DigitalAsset }) => (
        <View style={styles.card}>
            <View style={styles.iconPlaceholder}>
                <Text style={styles.iconText}>👕</Text>
            </View>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetType}>{item.type}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>Locker Room</Text>
            <Text style={styles.subtitle}>Your Digital Collection</Text>

            <FlatList
                data={MOCK_ASSETS}
                renderItem={renderAsset}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.grid}
                columnWrapperStyle={styles.row}
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
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#AAA',
        marginBottom: 20,
    },
    grid: {
        paddingBottom: 20,
    },
    row: {
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        width: '48%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    iconPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconText: {
        fontSize: 30,
    },
    assetName: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 4,
    },
    assetType: {
        color: '#FFD700',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});

export default LockerRoomScreen;
