import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const DrillScreen = () => {
    const insets = useSafeAreaInsets();
    const { user, logDrillSession } = useApp();

    // Drill State
    const [status, setStatus] = useState<'IDLE' | 'ACTIVE' | 'COMPLETE'>('IDLE');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30); // 30 second drill
    const [paceColor, setPaceColor] = useState('#FFF');

    // Ghost Mode Logic
    const TARGET_PACE = 0.5; // 0.5 reps per second (15 reps in 30s)
    const record = user.bestDrillScore;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (status === 'ACTIVE') {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        endDrill();
                        return 0;
                    }
                    return prev - 1;
                });

                // Ghost Mode Color Logic
                const timeElapsed = 30 - timeLeft;
                const expectedScore = timeElapsed * TARGET_PACE;
                if (score > expectedScore) {
                    setPaceColor('#00FF00'); // Green (Ahead of pace)
                } else {
                    setPaceColor('#FF4444'); // Red (Behind pace)
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [status, timeLeft, score]);

    const startDrill = () => {
        setStatus('ACTIVE');
        setScore(0);
        setTimeLeft(30);
    };

    const handleTap = () => {
        if (status === 'ACTIVE') {
            setScore(prev => prev + 1);
        }
    };

    const endDrill = () => {
        setStatus('COMPLETE');
        logDrillSession(score);
        Alert.alert('🏁 Drill Complete', `Score: ${score}\nBest: ${Math.max(score, record)}`);
    };

    return (
        <View style={styles.container}>
            {/* Camera View Placeholder */}
            <TouchableOpacity
                activeOpacity={1}
                style={styles.cameraPlaceholder}
                onPress={handleTap}
            >
                <Text style={styles.cameraText}>
                    {status === 'IDLE' ? 'Tap Start to Begin' : 'Tap to Count Reps (Simulated AI)'}
                </Text>

                {/* Ghost Mode UI */}
                <View style={styles.ghostOverlay}>
                    <Text style={styles.recordText}>👻 Record: {record}</Text>
                    <Text style={[styles.scoreText, { color: paceColor }]}>
                        {score}
                    </Text>
                    {status === 'ACTIVE' && (
                        <Text style={styles.timerText}>{timeLeft}s</Text>
                    )}
                </View>
            </TouchableOpacity>

            {/* Controls */}
            <View style={[styles.overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.header}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>

                {status === 'IDLE' && (
                    <TouchableOpacity style={styles.startButton} onPress={startDrill}>
                        <View style={styles.innerCircle} />
                    </TouchableOpacity>
                )}

                {status === 'COMPLETE' && (
                    <TouchableOpacity style={styles.restartButton} onPress={() => setStatus('IDLE')}>
                        <Text style={styles.restartText}>Reset</Text>
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
        position: 'absolute',
        top: '40%',
    },
    ghostOverlay: {
        position: 'absolute',
        top: 100,
        alignItems: 'center',
    },
    recordText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    scoreText: {
        fontSize: 80,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    timerText: {
        color: '#FFD700',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 8,
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        pointerEvents: 'box-none', // Allow touches to pass through to camera placeholder
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
    restartButton: {
        marginBottom: 40,
        backgroundColor: '#FFD700',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    restartText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DrillScreen;
