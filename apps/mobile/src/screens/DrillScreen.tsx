import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Camera } from 'react-native-vision-camera'; // Placeholder for actual camera
import { feedbackSessionMachine, ActionableTip } from '@kickup/drill-engine';
import { interpret } from 'xstate';

const { width, height } = Dimensions.get('window');

const DrillScreen = () => {
    const insets = useSafeAreaInsets();
    const [currentTip, setCurrentTip] = useState<ActionableTip | null>(null);
    const [isCorrectForm, setIsCorrectForm] = useState(false);
    const [status, setStatus] = useState('Idle');

    // Initialize XState Machine (v4)
    // In a real app, use useMachine hook or Context Provider
    const [drillService] = useState(() => interpret(feedbackSessionMachine).start());

    useEffect(() => {
        const subscription = drillService.subscribe((state) => {
            setStatus(state.value as string);

            if (state.matches('generating_feedback') && state.context.tips.length > 0) {
                setCurrentTip(state.context.tips[0]); // Show first tip
            }
        });

        return () => subscription.unsubscribe();
    }, [drillService]);

    const startDrill = () => {
        drillService.send('START_SESSION');
        // Simulate flow for demo
        setTimeout(() => drillService.send('BODY_DETECTED'), 1000);
        setTimeout(() => drillService.send('JOINTS_LOCKED'), 2000);
        setTimeout(() => {
            setIsCorrectForm(true); // Simulate "Gold Overlay"
            setTimeout(() => setIsCorrectForm(false), 500);
            drillService.send('DRILL_COMPLETE');
        }, 5000);
    };

    return (
        <View style={styles.container}>
            {/* Camera View Placeholder */}
            <View style={styles.cameraPlaceholder}>
                <Text style={styles.cameraText}>AR Camera Feed</Text>
                {/* Visual Feedback: Gold Overlay */}
                {isCorrectForm && <View style={styles.goldOverlay} />}
            </View>

            {/* Minimal UI Overlay */}
            <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.header}>
                    <Text style={styles.statusText}>{status.toUpperCase()}</Text>
                </View>

                {/* Insight Card: One at a time */}
                {currentTip && (
                    <View style={styles.insightCard}>
                        <Text style={styles.tipTitle}>AI COACH</Text>
                        <Text style={styles.tipText}>{currentTip.text}</Text>
                        <Text style={styles.correctionText}>{currentTip.correction}</Text>
                        <TouchableOpacity onPress={() => setCurrentTip(null)} style={styles.dismissButton}>
                            <Text style={styles.dismissText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* One Tap to Train */}
                {status === 'idle' && (
                    <TouchableOpacity style={styles.startButton} onPress={startDrill}>
                        <View style={styles.innerCircle} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraPlaceholder: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraText: {
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold',
    },
    goldOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 215, 0, 0.3)', // Gold with opacity
        borderWidth: 4,
        borderColor: '#FFD700',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        marginTop: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 1,
    },
    insightCard: {
        position: 'absolute',
        bottom: 120,
        width: width - 40,
        backgroundColor: '#1E1E1E',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#FFD700',
    },
    tipTitle: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 8,
        letterSpacing: 1,
    },
    tipText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    correctionText: {
        color: '#AAA',
        fontSize: 16,
    },
    dismissButton: {
        marginTop: 16,
        alignSelf: 'flex-end',
    },
    dismissText: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
    startButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
    },
});

export default DrillScreen;
