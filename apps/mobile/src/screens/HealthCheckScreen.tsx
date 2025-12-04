import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const HealthCheckScreen = () => {
    const insets = useSafeAreaInsets();
    const { fatigueFlag, setFatigueFlag } = useApp();
    const [mood, setMood] = useState(5);
    const [fatigue, setFatigue] = useState(fatigueFlag ? 8 : 5); // Default higher if flagged

    useEffect(() => {
        if (fatigueFlag) {
            Alert.alert(
                '⚠️ Fatigue Detected',
                'Your AI Garde du Corps noticed high intensity. Please check your fatigue levels.',
                [{ text: 'OK' }]
            );
        }
    }, [fatigueFlag]);

    const handleSave = () => {
        // Smart Rest Logic
        if (fatigue >= 8) {
            setFatigueFlag(true);
            Alert.alert(
                '🛌 Smart Rest Activated',
                'Your fatigue is high. We have updated your Calendar to suggest Yoga/Rest instead of heavy training.'
            );
        } else {
            setFatigueFlag(false);
            Alert.alert('✅ Status Logged', 'You are good to go! Stay safe.');
        }
    };

    const renderScale = (value: number, setValue: (val: number) => void, label: string) => (
        <View style={styles.scaleContainer}>
            <Text style={styles.scaleLabel}>{label}: {value}/10</Text>
            <View style={styles.buttonRow}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <TouchableOpacity
                        key={num}
                        style={[
                            styles.scaleButton,
                            value === num && styles.scaleButtonActive
                        ]}
                        onPress={() => setValue(num)}
                    >
                        <Text style={[
                            styles.scaleButtonText,
                            value === num && styles.scaleButtonTextActive
                        ]}>{num}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Text style={styles.title}>Daily Check-In</Text>
            <Text style={styles.subtitle}>Track your physical and mental state.</Text>

            <View style={styles.form}>
                {renderScale(mood, setMood, 'Mood')}
                {renderScale(fatigue, setFatigue, 'Fatigue')}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>LOG STATUS</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFD700',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#AAA',
        marginBottom: 40,
    },
    form: {
        gap: 30,
    },
    scaleContainer: {
        marginBottom: 20,
    },
    scaleLabel: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    scaleButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scaleButtonActive: {
        backgroundColor: '#FFD700',
    },
    scaleButtonText: {
        color: '#AAA',
        fontSize: 12,
    },
    scaleButtonTextActive: {
        color: '#000',
        fontWeight: 'bold',
    },
    saveButton: {
        marginTop: 40,
        backgroundColor: '#FFD700',
        paddingVertical: 16,
        borderRadius: 30,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    },
});

export default HealthCheckScreen;
