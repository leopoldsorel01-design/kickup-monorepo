import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    type: 'Match' | 'Training';
}

const MOCK_EVENTS: Event[] = [
    { id: 'e1', title: '5v5 Scrimmage', date: 'Tue, 5:00 PM', location: 'Central Park', type: 'Match' },
    { id: 'e2', title: 'Drill Session', date: 'Wed, 6:00 PM', location: 'Home', type: 'Training' },
    { id: 'e3', title: 'League Game', date: 'Sat, 10:00 AM', location: 'City Stadium', type: 'Match' }
];

const CalendarScreen = () => {
    const insets = useSafeAreaInsets();

    const renderEvent = ({ item }: { item: Event }) => (
        <View style={styles.card}>
            <View style={[styles.typeIndicator, { backgroundColor: item.type === 'Match' ? '#FF4444' : '#44FF44' }]} />
            <View style={styles.content}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.location}>📍 {item.location}</Text>
            </View>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.type}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>Schedule</Text>
            <FlatList
                data={MOCK_EVENTS}
                renderItem={renderEvent}
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
        marginBottom: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'center',
    },
    typeIndicator: {
        width: 6,
        height: '100%',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    date: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    eventTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    location: {
        color: '#AAA',
        fontSize: 14,
    },
    badge: {
        marginRight: 16,
        backgroundColor: '#333',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

export default CalendarScreen;
