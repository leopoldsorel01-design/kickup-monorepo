import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/auth';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const insets = useSafeAreaInsets();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWidth = useRef(new Animated.Value(60)).current;

    const toggleMenu = () => {
        const targetWidth = isMenuOpen ? 60 : 250;
        Animated.timing(menuWidth, {
            toValue: targetWidth,
            duration: 300,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false,
        }).start();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await AuthService.logout();
        } catch (error: any) {
            Alert.alert('Logout Failed', error.message);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/splash_background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>KICKUP!</Text>
                    <Text style={styles.subtitle}>Ready to train?</Text>
                </View>

                <View style={styles.mainActions}>
                    {/* One Tap to Train */}
                    <TouchableOpacity
                        style={styles.trainButton}
                        onPress={() => navigation.navigate('Drill')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.trainIconContainer}>
                            <Text style={styles.trainIcon}>⚽</Text>
                        </View>
                        <Text style={styles.trainText}>START DRILL</Text>
                        <Text style={styles.trainSubtext}>AI-Powered Feedback</Text>
                    </TouchableOpacity>

                    {/* Social Grid */}
                    <View style={styles.grid}>
                        <TouchableOpacity
                            style={styles.gridButton}
                            onPress={() => navigation.navigate('Matchmaking')}
                        >
                            <Text style={styles.gridIcon}>🌍</Text>
                            <Text style={styles.gridText}>SQUAD</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridButton}
                            onPress={() => navigation.navigate('SocialFeed')}
                        >
                            <Text style={styles.gridIcon}>🔥</Text>
                            <Text style={styles.gridText}>FEED</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridButton}
                            onPress={() => navigation.navigate('LockerRoom')}
                        >
                            <Text style={styles.gridIcon}>👕</Text>
                            <Text style={styles.gridText}>LOCKER</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.gridButton}
                            onPress={() => navigation.navigate('Calendar')}
                        >
                            <Text style={styles.gridIcon}>📅</Text>
                            <Text style={styles.gridText}>PLAN</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Health Check */}
                    <TouchableOpacity
                        style={styles.healthButton}
                        onPress={() => navigation.navigate('HealthCheck')}
                    >
                        <Text style={styles.healthText}>❤️ Daily Check-In</Text>
                    </TouchableOpacity>
                </View>

                {/* Expandable Bottom Bar */}
                <Animated.View style={[styles.menuBar, { width: menuWidth }]}>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={toggleMenu}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.menuIcon}>{isMenuOpen ? '✕' : '⚙️'}</Text>
                    </TouchableOpacity>

                    {isMenuOpen && (
                        <View style={styles.menuItems}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => navigation.navigate('Camera')}
                            >
                                <Text style={styles.menuItemText}>📷 Camera</Text>
                            </TouchableOpacity>

                            <View style={styles.divider} />

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={handleLogout}
                            >
                                <Text style={[styles.menuItemText, styles.logoutText]}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Animated.View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        marginTop: 40,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 40,
        fontWeight: '900',
        color: '#FFD700',
        letterSpacing: 2,
        fontStyle: 'italic',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    subtitle: {
        color: '#FFF',
        fontSize: 18,
        opacity: 0.8,
    },
    mainActions: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
    },
    trainButton: {
        width: 280,
        height: 280,
        borderRadius: 140,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFD700',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 10,
    },
    trainIconContainer: {
        marginBottom: 10,
    },
    trainIcon: {
        fontSize: 60,
    },
    trainText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    trainSubtext: {
        color: '#FFD700',
        fontSize: 14,
        marginTop: 5,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16,
        width: '100%',
        paddingHorizontal: 20,
    },
    gridButton: {
        width: '40%',
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
    },
    gridIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    gridText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
        letterSpacing: 1,
    },
    healthButton: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(255, 68, 68, 0.2)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FF4444',
    },
    healthText: {
        color: '#FF4444',
        fontWeight: 'bold',
        fontSize: 14,
    },
    menuBar: {
        height: 60,
        backgroundColor: 'rgba(10, 25, 41, 0.9)',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 1,
        borderColor: '#FFD700',
        borderLeftWidth: 0,
        overflow: 'hidden',
    },
    menuButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B8860B',
    },
    menuIcon: {
        fontSize: 24,
        color: '#000',
    },
    menuItems: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
    },
    menuItem: {
        padding: 10,
    },
    menuItemText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 14,
    },
    logoutText: {
        color: '#FF4444',
    },
    divider: {
        width: 1,
        height: '60%',
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
    }
});
