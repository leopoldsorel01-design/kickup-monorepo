import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const ProfileScreen = () => {
    const insets = useSafeAreaInsets();
    const { user } = useApp();

    const renderBadge = (badge: any) => (
        <View key={badge.id} style={[styles.badgeCard, !badge.unlocked && styles.badgeLocked]}>
            <Text style={styles.badgeIcon}>{badge.unlocked ? badge.icon : '🔒'}</Text>
            <Text style={styles.badgeName}>{badge.name}</Text>
            <Text style={styles.badgeDesc}>{badge.description}</Text>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Digital Card */}
                <View style={styles.card}>
                    <View style={styles.avatarPlaceholder} />
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.position}>{user.position} | Age: {user.age}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user.matchesPlayed}</Text>
                            <Text style={styles.statLabel}>Matches</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user.xp}</Text>
                            <Text style={styles.statLabel}>XP</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.statValue}>{user.skillLevel}</Text>
                            <Text style={styles.statLabel}>Level</Text>
                        </View>
                    </View>
                </View>

                {/* Skill Progress Chart */}
                <Text style={styles.sectionTitle}>Skill Progress</Text>
                <View style={styles.chartContainer}>
                    <View style={styles.chartBarContainer}>
                        <View style={[styles.chartBar, { height: '60%' }]} />
                        <Text style={styles.chartLabel}>Speed</Text>
                    </View>
                    <View style={styles.chartBarContainer}>
                        <View style={[styles.chartBar, { height: '80%' }]} />
                        <Text style={styles.chartLabel}>Shooting</Text>
                    </View>
                    <View style={styles.chartBarContainer}>
                        <View style={[styles.chartBar, { height: '40%' }]} />
                        <Text style={styles.chartLabel}>Defense</Text>
                    </View>
                    <View style={styles.chartBarContainer}>
                        <View style={[styles.chartBar, { height: '70%' }]} />
                        <Text style={styles.chartLabel}>Passing</Text>
                    </View>
                </View>

                {/* Badges */}
                <Text style={styles.sectionTitle}>Trophy Room</Text>
                <View style={styles.badgesGrid}>
                    {user.badges.map(renderBadge)}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
        borderTopWidth: 4,
        borderTopColor: '#FFD700',
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#333',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    username: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    position: {
        color: '#AAA',
        fontSize: 16,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 16,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        color: '#FFD700',
        fontSize: 20,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
        marginTop: 4,
    },
    sectionTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 8,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: 150,
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'flex-end',
    },
    chartBarContainer: {
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        width: 40,
    },
    chartBar: {
        width: '100%',
        backgroundColor: '#FFD700',
        borderRadius: 4,
        marginBottom: 8,
    },
    chartLabel: {
        color: '#AAA',
        fontSize: 10,
    },
    badgesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    badgeCard: {
        width: '48%',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
    },
    badgeLocked: {
        opacity: 0.5,
        backgroundColor: '#111',
    },
    badgeIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    badgeName: {
        color: '#FFF',
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    badgeDesc: {
        color: '#666',
        fontSize: 10,
        textAlign: 'center',
    },
});

export default ProfileScreen;
