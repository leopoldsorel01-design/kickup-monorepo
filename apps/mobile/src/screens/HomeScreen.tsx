import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/auth';

type HomeScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuWidth = useRef(new Animated.Value(60)).current; // Initial width (button size)

    const toggleMenu = () => {
        const targetWidth = isMenuOpen ? 60 : 250; // Expand to 250, collapse to 60

        Animated.timing(menuWidth, {
            toValue: targetWidth,
            duration: 300,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
            useNativeDriver: false, // Width animation doesn't support native driver
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
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.welcomeText}>Welcome Champion!</Text>
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
        justifyContent: 'space-between', // Push content to top, menu to bottom
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    menuBar: {
        height: 60,
        backgroundColor: 'rgba(10, 25, 41, 0.9)',
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        bottom: 40,
        left: 0,
        borderWidth: 1,
        borderColor: '#FFD700',
        borderLeftWidth: 0, // Attach to side
        overflow: 'hidden', // Hide items when collapsed
    },
    menuButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#B8860B', // Gold button background
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
