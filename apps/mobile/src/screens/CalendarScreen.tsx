import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getStreak, getFreezeCount, setFreezeCount, isFreezeActive, setFreezeActive } from '../services/storage';
import { useApp } from '../context/AppContext';

export const CalendarScreen = () => {
    const { fatigueFlag } = useApp();
    const [streak, setStreak] = useState(0);
    const [freezeCount, setFreezeCountState] = useState(0);
    const [isFreezeActiveState, setIsFreezeActiveState] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const s = await getStreak();
        const f = await getFreezeCount();
        const a = await isFreezeActive();
        setStreak(s);
        setFreezeCountState(f);
        setIsFreezeActiveState(a);
    };

    const buyFreeze = async () => {
        // In a real app, check currency here.
        const newCount = freezeCount + 1;
        await setFreezeCount(newCount);
        setFreezeCountState(newCount);
        Alert.alert('Success', 'You bought a Streak Freeze!');
    };

    const activateFreeze = async () => {
        if (freezeCount > 0) {
            if (isFreezeActiveState) {
                Alert.alert('Info', 'Freeze is already active!');
                return;
            }
            await setFreezeCount(freezeCount - 1);
            await setFreezeActive(true);
            setFreezeCountState(freezeCount - 1);
            setIsFreezeActiveState(true);
            Alert.alert('Protected', 'Your streak is safe for the next missed day.');
        } else {
            Alert.alert('Error', 'You need to buy a Freeze first!');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Training Calendar</Text>

            {/* --- SMART REST INJECTION --- */}
            {fatigueFlag ? (
                <View style={[styles.eventCard, styles.recoveryCard]}>
                    <Text style={styles.eventTitle}>🧘 Recovery Yoga</Text>
                    <Text style={styles.eventTime}>Today • 18:00</Text>
                    <View style={styles.aiBadge}>
                        <Text style={styles.aiText}>🤖 AI ADAPTED</Text>
                    </View>
                    <Text style={styles.reasonText}>
                        "L'IA a détecté de la fatigue hier. On y va doucement aujourd'hui."
                    </Text>
                </View>
            ) : (
                <View style={[styles.eventCard, styles.trainingCard]}>
                    <Text style={styles.eventTitle}>⚡ High Intensity Sprints</Text>
                    <Text style={styles.eventTime}>Today • 18:00</Text>
                </View>
            )}
            {/* ----------------------------- */}

            <View style={styles.streakContainer}>
                <Text style={styles.streakLabel}>Current Streak</Text>
                <Text style={styles.streakValue}>{streak} 🔥</Text>
            </View>

            <View style={styles.shopContainer}>
                <Text style={styles.shopTitle}>Shop</Text>

                <View style={styles.itemCard}>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName}>Streak Freeze 🥶</Text>
                        <Text style={styles.itemDesc}>Protects your streak for one day.</Text>
                        <Text style={styles.inventory}>Inventory: {freezeCount}</Text>
                    </View>
                    <TouchableOpacity style={styles.buyButton} onPress={buyFreeze}>
                        <Text style={styles.buyButtonText}>Buy</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.actionContainer}>
                    {isFreezeActiveState ? (
                        <View style={styles.activeFreezeBadge}>
                            <Text style={styles.activeFreezeText}>🛡️ Protected Status Active</Text>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={[styles.activateButton, { opacity: freezeCount > 0 ? 1 : 0.5 }]}
                            onPress={activateFreeze}
                            disabled={freezeCount === 0}
                        >
                            <Text style={styles.activateButtonText}>Activate Freeze</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    streakContainer: {
        alignItems: 'center',
        marginBottom: 30,
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    streakLabel: {
        fontSize: 18,
        color: '#666',
        marginBottom: 10,
    },
    streakValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#FF5722',
    },
    shopContainer: {
        marginBottom: 40,
    },
    shopTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    itemInfo: {
        flex: 1,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    itemDesc: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    inventory: {
        fontSize: 12,
        color: '#999',
        fontWeight: 'bold',
    },
    buyButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    buyButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    actionContainer: {
        alignItems: 'center',
    },
    activateButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
    },
    activateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    activeFreezeBadge: {
        backgroundColor: '#E3F2FD',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2196F3',
    },
    activeFreezeText: {
        color: '#2196F3',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // New Styles for Smart Rest
    recoveryCard: {
        backgroundColor: '#2E8B57', // SeaGreen for recovery
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#FFF'
    },
    trainingCard: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 16,
        marginBottom: 20,
        borderLeftWidth: 5,
        borderLeftColor: '#FFD700'
    },
    eventCard: {
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    eventTitle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    eventTime: { color: '#CCC', marginTop: 5 },
    aiBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start',
        padding: 4,
        borderRadius: 4,
        marginTop: 10
    },
    aiText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    reasonText: { color: '#E0E0E0', fontStyle: 'italic', marginTop: 10 }
});
