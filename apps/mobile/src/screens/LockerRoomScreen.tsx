import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { JerseyIcon } from '../components/JerseyIcon';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useApp } from '../context/AppContext';
import { RadarChart } from '../components/RadarChart';

const COLORS = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFFFFF', '#000000', '#FFA500', '#800080'];

export const LockerRoomScreen = () => {
    const { user } = useApp();
    const [primaryColor, setPrimaryColor] = useState('#FFFFFF');
    const [secondaryColor, setSecondaryColor] = useState('#000000');
    const [number, setNumber] = useState('10');

    useEffect(() => {
        loadKit();
    }, []);

    const loadKit = async () => {
        try {
            const savedKit = await AsyncStorage.getItem('KICKUP_KIT');
            if (savedKit) {
                const { primary, secondary, num } = JSON.parse(savedKit);
                setPrimaryColor(primary);
                setSecondaryColor(secondary);
                setNumber(num);
            }
        } catch (e) {
            console.error('Failed to load kit', e);
        }
    };

    const saveKit = async () => {
        try {
            const kit = { primary: primaryColor, secondary: secondaryColor, num: number };
            await AsyncStorage.setItem('KICKUP_KIT', JSON.stringify(kit));
            Alert.alert('Kit Saved!');
        } catch (e) {
            console.error('Failed to save kit', e);
        }
    };

    const getArchetypeTitle = () => {
        if (user.stats.dribbling > 80) return "Architecte Technique 🎨";
        if (user.stats.pace > 80) return "Flèche Vivante ⚡";
        return "Rising Star 🌟";
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Locker Room</Text>

            {/* Radar Chart Section */}
            <View style={styles.chartContainer}>
                <RadarChart stats={user.stats} size={250} />
                <Text style={styles.archetypeText}>{getArchetypeTitle()}</Text>
            </View>

            <Text style={styles.subtitle}>Design Your Kit</Text>

            <View style={styles.previewContainer}>
                <JerseyIcon
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    number={number}
                    size={250}
                />
            </View>

            <View style={styles.controls}>
                <Text style={styles.label}>Jersey Number</Text>
                <TextInput
                    style={styles.input}
                    value={number}
                    onChangeText={(text) => setNumber(text.substring(0, 2))}
                    keyboardType="numeric"
                    maxLength={2}
                />

                <Text style={styles.label}>Primary Color</Text>
                <View style={styles.colorGrid}>
                    {COLORS.map((color) => (
                        <TouchableOpacity
                            key={`primary-${color}`}
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: color, borderWidth: primaryColor === color ? 3 : 1 },
                            ]}
                            onPress={() => setPrimaryColor(color)}
                        />
                    ))}
                </View>

                <Text style={styles.label}>Secondary Color</Text>
                <View style={styles.colorGrid}>
                    {COLORS.map((color) => (
                        <TouchableOpacity
                            key={`secondary-${color}`}
                            style={[
                                styles.colorSwatch,
                                { backgroundColor: color, borderWidth: secondaryColor === color ? 3 : 1 },
                            ]}
                            onPress={() => setSecondaryColor(color)}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={saveKit}>
                    <Text style={styles.saveButtonText}>Save Kit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 30,
    },
    previewContainer: {
        marginBottom: 40,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    controls: {
        width: '100%',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 20,
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#ddd',
        textAlign: 'center',
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    colorSwatch: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: '#ccc',
    },
    saveButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        marginTop: 40,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    chartContainer: {
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        width: '100%',
    },
    archetypeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
        marginTop: 10,
        marginBottom: 10,
    },
});
