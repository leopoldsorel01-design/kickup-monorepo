import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/auth';
import { AuthInput, AuthButton, SocialButton } from '../components/AuthComponents';

type LoginScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export const LoginScreen = ({ navigation }: LoginScreenProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '576915762654-k6r7ggc7aj0btgv1l49g31opivt8rn0t.apps.googleusercontent.com',
            iosClientId: '576915762654-v7uo43rdrktck9ftk8j6up7a4t3pi572.apps.googleusercontent.com',
        });
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            await AuthService.login(email, password);
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            await AuthService.signInWithGoogle();
        } catch (error: any) {
            if (error.code !== '12501') {
                Alert.alert('Google Login Failed', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        setLoading(true);
        try {
            await AuthService.signInWithApple();
        } catch (error: any) {
            if (error.code !== '1001') {
                Alert.alert('Apple Login Failed', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/images/auth_stadium.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/images/logo_gold_soccer.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Sign In</Text>
                    </View>

                    <View style={styles.glassContainer}>

                        <AuthInput
                            placeholder="Email Address"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <AuthInput
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />

                        <AuthButton
                            title={loading ? "Signing In..." : "Sign In"}
                            onPress={handleLogin}
                            disabled={loading}
                            style={styles.signInButton}
                        />

                        <View style={styles.dividerContainer}>
                            {/* Implicit space */}
                        </View>

                        <SocialButton
                            provider="google"
                            title="Connect with Google"
                            onPress={handleGoogleLogin}
                            disabled={loading}
                        />

                        <SocialButton
                            provider="apple"
                            title="Connect with Apple"
                            onPress={handleAppleLogin}
                            disabled={loading}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Text
                                style={styles.linkText}
                                onPress={() => navigation.navigate('Register')}
                            >
                                Register
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        paddingBottom: 150, // Increased padding to prevent cut-off
    },
    glassContainer: {
        backgroundColor: 'rgba(10, 25, 47, 0.7)', // Dark Navy Glass
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.5)', // Thin Gold Border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFD700', // Gold
        letterSpacing: 1,
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    signInButton: {
        marginTop: 10,
    },
    dividerContainer: {
        height: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#8899A6',
        fontSize: 14,
    },
    linkText: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
    },
});
