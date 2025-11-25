import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, ImageBackground } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/auth';
import { AuthInput, AuthButton, SocialButton } from '../components/AuthComponents';

type RegisterScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Register'>;
};

export const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
    const [fullName, setFullName] = useState('');
    const [age, setAge] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !fullName || !age) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await AuthService.register(email, password);
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
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
                        <Text style={styles.title}>Create Your Account</Text>
                    </View>

                    <View style={styles.glassContainer}>

                        <AuthInput
                            placeholder="Full Name"
                            value={fullName}
                            onChangeText={setFullName}
                            autoCapitalize="words"
                        />
                        <AuthInput
                            placeholder="Age"
                            value={age}
                            onChangeText={setAge}
                            keyboardType="numeric"
                        />
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
                        <AuthInput
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        <AuthButton
                            title={loading ? "Creating Account..." : "Register"}
                            onPress={handleRegister}
                            disabled={loading}
                            style={styles.registerButton}
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
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <Text
                                style={styles.linkText}
                                onPress={() => navigation.navigate('Login')}
                            >
                                Sign In
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
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        letterSpacing: 0.5,
        textShadowColor: 'rgba(255, 215, 0, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    registerButton: {
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
