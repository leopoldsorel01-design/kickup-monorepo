import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

export function CameraScreen() {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Requesting Camera Permission...</Text>
            </View>
        );
    }

    if (device == null) {
        return (
            <View style={[styles.container, { backgroundColor: '#1a1a1a' }]}>
                <Text style={{ fontSize: 40, marginBottom: 20 }}>📷</Text>
                <Text style={styles.text}>Camera not available on Simulator</Text>
                <Text style={[styles.text, { fontSize: 14, marginTop: 10, opacity: 0.7 }]}>
                    Run on a physical iPhone to see the live feed.
                </Text>

                {/* We still render the overlay so you can test the UI! */}
                <View style={styles.overlay}>
                    <Text style={styles.overlayText}>KickUp AR View (Simulator Mode)</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
            />
            <View style={styles.overlay}>
                <Text style={styles.overlayText}>KickUp AR View</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    overlay: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 8,
    },
    overlayText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
