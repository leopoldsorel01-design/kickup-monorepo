import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import { GlassButton } from '@kickup/ui-kit';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const user = auth().currentUser;

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>User not authenticated</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Welcome back,</Text>
                    <Text style={styles.username}>{user.displayName || 'Player'}</Text>
                </View>

                {/* Daily Streak Card */}
                <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.streakCard}>
                    <Text style={styles.streakTitle}>Daily Streak</Text>
                    <Text style={styles.streakCount}>🔥 5 Days</Text>
                    <Text style={styles.streakSubtitle}>Keep it up to unlock rewards!</Text>
                </LinearGradient>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsContainer}>
                    <GlassButton
                        title="Train Now ⚽️"
                        onPress={() => navigation.navigate('Drill')}
                        style={styles.actionButton}
                    />

                    <GlassButton
                        title="Find Squad 🔍"
                        variant="secondary"
                        onPress={() => navigation.navigate('Matchmaking')}
                        style={styles.actionButton}
                    />
                </View>

                {/* Recent Activity / Feed Preview */}
                <Text style={styles.sectionTitle}>Community Pulse</Text>
                <TouchableOpacity
                    style={styles.feedPreview}
                    onPress={() => navigation.navigate('SocialFeed')}
                >
                    <Text style={styles.feedText}>See what's happening in your area...</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    errorText: {
        color: '#FF4444',
        fontSize: 18,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginTop: 40,
        marginBottom: 20,
    },
    greeting: {
        color: '#AAAAAA',
        fontSize: 18,
    },
    username: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    streakCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 30,
        alignItems: 'center',
    },
    streakTitle: {
        color: '#121212',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    streakCount: {
        color: '#121212',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    streakSubtitle: {
        color: '#121212',
        fontSize: 14,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionButton: {
        width: '48%',
        height: 120,
        borderRadius: 15,
        overflow: 'hidden',
    },
    actionGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    actionEmoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    feedPreview: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#333333',
    },
    feedText: {
        color: '#AAAAAA',
        fontSize: 16,
        fontStyle: 'italic',
    },
});
