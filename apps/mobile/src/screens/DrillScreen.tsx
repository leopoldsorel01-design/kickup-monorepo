import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMachine } from '@xstate/react';
import { jugglingDrillMachine } from '@kickup/drill-engine';
import { GlassButton } from '@kickup/ui-kit';

export default function DrillScreen() {
    const navigation = useNavigation();
    const [state, send] = useMachine(jugglingDrillMachine);
    const { juggles, duration } = state.context;

    // Refs for intervals
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const juggleSimRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Active Drill Logic (Timer + Simulation)
    useEffect(() => {
        if (state.matches('active')) {
            // Start Timer
            timerRef.current = setInterval(() => {
                send({ type: 'TICK' });
            }, 1000);

            // Simulate Juggles (Mock Vision)
            juggleSimRef.current = setInterval(() => {
                // Randomly increment juggles to simulate detection
                if (Math.random() > 0.3) {
                    send({ type: 'DETECT_BALL' });
                }
            }, 2000);

            return () => {
                if (timerRef.current) clearInterval(timerRef.current);
                if (juggleSimRef.current) clearInterval(juggleSimRef.current);
            };
        }
    }, [state.value, send]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <View style={styles.container}>
            {/* Header / Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Main Content based on State */}
            <View style={styles.content}>
                {state.matches('calibration') && (
                    <View style={styles.centerContent}>
                        <Text style={styles.title}>Calibration</Text>
                        <Text style={styles.instructions}>Point camera at the floor</Text>
                        <TouchableOpacity style={styles.startButton} onPress={() => send({ type: 'PLANE_DETECTED' })}>
                            <Text style={styles.startButtonText}>PLANE DETECTED</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {state.matches('anchor_placement') && (
                    <View style={styles.centerContent}>
                        <Text style={styles.title}>Place Anchor</Text>
                        <Text style={styles.instructions}>Tap to place the ball anchor</Text>
                        <TouchableOpacity style={styles.startButton} onPress={() => send({ type: 'USER_CONFIRM' })}>
                            <Text style={styles.startButtonText}>CONFIRM ANCHOR</Text>
                            <GlassButton title="CONFIRM ANCHOR" onPress={() => send({ type: 'USER_CONFIRM' })} />
                    </View>
                )}

                {state.matches('body_fit') && (
                    <View style={styles.centerContent}>
                        <Text style={styles.title}>Body Fit</Text>
                        <Text style={styles.instructions}>Stand in the frame</Text>
                        <GlassButton title="START DRILL" onPress={() => send({ type: 'POSE_VALID' })} />
                    </View>
                )}

                {state.matches('active') && (
                    <View style={styles.activeContainer}>
                        <View style={styles.statsContainer}>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>TIME</Text>
                                <Text style={styles.statValue}>{formatTime(duration)}</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statLabel}>JUGGLES</Text>
                                <Text style={styles.statValue}>{juggles}</Text>
                            </View>
                        </View>

                        <View style={styles.cameraPlaceholder}>
                            <Text style={styles.cameraText}>[ Camera Feed Simulation ]</Text>
                            <Text style={styles.cameraSubText}>AI Tracking Active...</Text>
                        </View>

                        <GlassButton title="STOP DRILL" variant="secondary" onPress={() => send({ type: 'STOP' })} style={{ marginHorizontal: 40 }} />
                    </View>
                )}

                {state.matches('summary') && (
                    <View style={styles.centerContent}>
                        <Text style={styles.title}>Great Session!</Text>
                        <Text style={styles.scoreText}>{juggles} Juggles</Text>
                        <Text style={styles.timeText}>Time: {formatTime(duration)}</Text>

                        <GlassButton title="DONE" variant="secondary" onPress={() => navigation.goBack()} />
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 10,
    },
    backButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    instructions: {
        color: '#AAAAAA',
        fontSize: 16,
        marginBottom: 40,
    },
    startButton: {
        backgroundColor: '#FFD700',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        marginBottom: 20,
    },
    startButtonText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    activeContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'space-between',
        paddingVertical: 60,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
    },
    statBox: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#AAAAAA',
        fontSize: 14,
        fontWeight: 'bold',
    },
    statValue: {
        color: '#FFFFFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    cameraPlaceholder: {
        flex: 1,
        margin: 20,
        backgroundColor: '#1E1E1E',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#333333',
        borderStyle: 'dashed',
    },
    cameraText: {
        color: '#666666',
        fontSize: 18,
        fontWeight: 'bold',
    },
    cameraSubText: {
        color: '#444444',
        marginTop: 10,
    },
    stopButton: {
        backgroundColor: '#FF4444',
        marginHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
        alignItems: 'center',
    },
    stopButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    scoreText: {
        color: '#FFD700',
        fontSize: 60,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    timeText: {
        color: '#FFFFFF',
        fontSize: 20,
        marginBottom: 40,
    },
});
