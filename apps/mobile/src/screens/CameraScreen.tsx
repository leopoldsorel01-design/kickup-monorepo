import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const CameraScreen = () => {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);

    useEffect(() => {
        // Simulate permission check
        // In a real app with react-native-vision-camera, we would use Camera.requestCameraPermission()
        const checkPermission = async () => {
            // Mocking a delay and a success response for now
            setTimeout(() => {
                setHasPermission(true);
            }, 500);
        };

        checkPermission();
    }, []);

    const openSettings = () => {
        Linking.openSettings();
    };

    if (hasPermission === null) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.text}>Requesting Camera Permission...</Text>
            </View>
        );
    }

    if (hasPermission === false) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Camera Permission Denied</Text>
                <Text style={styles.subText}>We need camera access to track your drills.</Text>
                <TouchableOpacity style={styles.button} onPress={openSettings}>
                    <Text style={styles.buttonText}>Open Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.secondaryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Simulated Camera Feed */}
            <View style={styles.cameraFeed}>
                <Text style={styles.feedText}>[ Camera Active ]</Text>
                <View style={styles.focusFrame} />
            </View>

            {/* Overlay UI */}
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <View style={styles.controls}>
                    <TouchableOpacity style={styles.captureButton}>
                        <View style={styles.captureInner} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        padding: 20,
    },
    text: {
        color: '#FFF',
        fontSize: 16,
    },
    errorText: {
        color: '#FF4444',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subText: {
        color: '#AAA',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#333',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        padding: 10,
    },
    secondaryButtonText: {
        color: '#AAA',
        fontSize: 14,
    },
    cameraFeed: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222',
    },
    feedText: {
        color: '#555',
        fontSize: 18,
        fontWeight: 'bold',
    },
    focusFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        marginTop: 20,
        borderStyle: 'dashed',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'space-between',
        padding: 20,
    },
    closeButton: {
        alignSelf: 'flex-start',
        padding: 10,
        marginTop: 40,
    },
    closeButtonText: {
        color: '#FFF',
        fontSize: 28,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 5,
    },
    controls: {
        alignItems: 'center',
        marginBottom: 40,
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
    },
});
