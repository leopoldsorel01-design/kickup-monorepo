import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Alert, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/auth';
import { AuthButton } from '../components/AuthComponents';

type SettingsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

export const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
    const handleLogout = async () => {
        try {
            await AuthService.logout();
            // Navigation will automatically handle the state change in App.tsx
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
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Account</Text>
                        <AuthButton
                            title="Log Out"
                            onPress={handleLogout}
                            variant="secondary" // Using secondary style (outline) for logout
                            style={styles.logoutButton}
                        />
                    </View>

                    {/* Future settings sections can go here */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.versionText}>KickUp! v1.0.0</Text>
                    </View>
                </View>
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
        backgroundColor: 'rgba(0,0,0,0.5)', // Dark overlay
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 215, 0, 0.3)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 15,
        marginLeft: 5,
    },
    logoutButton: {
        borderColor: '#FF4444', // Red border for destructive action? Or keep gold? Let's stick to theme for now but maybe make text red?
        // For now, sticking to the gold theme as requested, but secondary variant.
    },
    versionText: {
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginTop: 10,
    },
});
