import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '576915762654-k6r7ggc7aj0btgv1l49g31opivt8rn0t.apps.googleusercontent.com',
        });
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        const { user, error } = await AuthService.login(email, password);
        setLoading(false);

        if (error) {
            Alert.alert('Login Failed', error);
        } else {
            navigation.navigate('Camera');
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { user, error } = await AuthService.signInWithGoogle();
        setLoading(false);

        if (error) {
            Alert.alert('Google Login Failed', error);
        } else {
            navigation.navigate('Camera');
        }
    };

    const handleAppleLogin = async () => {
        setLoading(true);
        const { user, error } = await AuthService.signInWithApple();
        setLoading(false);

        if (error) {
            Alert.alert('Apple Login Failed', error);
        } else {
            navigation.navigate('Camera');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>KickUp!</Text>
            <Text style={styles.subtitle}>Login to your account</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>

            <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={[styles.socialButton, styles.googleButton]} onPress={handleGoogleLogin} disabled={loading}>
                <Text style={styles.socialButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
                <TouchableOpacity style={[styles.socialButton, styles.appleButton]} onPress={handleAppleLogin} disabled={loading}>
                    <Text style={styles.socialButtonText}>Sign in with Apple</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.linkText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#CCC',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        backgroundColor: '#1A1A1A',
        color: '#FFF',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 10,
    },
    socialButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    googleButton: {
        backgroundColor: '#FFF',
    },
    appleButton: {
        backgroundColor: '#000',
        borderColor: '#FFF',
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000', // Default for Google
    },
    linkText: {
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});
