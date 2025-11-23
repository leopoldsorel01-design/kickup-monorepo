import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenName } from '../types';

interface Props {
    onNavigate: (screen: ScreenName) => void;
}

export function RegisterScreen({ onNavigate }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState(''); // Format: YYYY-MM-DD

    const handleRegister = () => {
        // Mock Registration Logic
        if (!email || !password || !dob) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Simple Age Check (Mock)
        const birthYear = parseInt(dob.split('-')[0]);
        const currentYear = new Date().getFullYear();
        const age = currentYear - birthYear;

        if (age < 13) {
            Alert.alert('Parental Consent Required', 'Since you are under 13, we need your parent to approve this account.');
            // In real app, navigate to ParentEmailScreen
        } else {
            onNavigate('Camera');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join the KickUp squad</Text>

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
            <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                placeholderTextColor="#666"
                value={dob}
                onChangeText={setDob}
                keyboardType="numeric"
            />

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => onNavigate('Login')}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
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
        fontSize: 32,
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
        backgroundColor: '#34C759', // Green for Sign Up
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
    linkText: {
        color: '#007AFF',
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
});
