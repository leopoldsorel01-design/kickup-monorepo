import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, PhotoFile } from 'react-native-vision-camera';
import { StorageService } from '../services/storage';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type CameraScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Camera'>;
};

export function CameraScreen({ navigation }: CameraScreenProps) {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);
    const [photo, setPhoto] = useState<PhotoFile | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, [hasPermission, requestPermission]);

    const takePhoto = async () => {
        if (camera.current) {
            try {
                const file = await camera.current.takePhoto();
                setPhoto(file);
            } catch (e) {
                Alert.alert('Error', 'Failed to take photo');
            }
        }
    };

    const uploadPhoto = async () => {
        if (!photo) return;

        setUploading(true);
        const fileName = `photo_${Date.now()}.jpg`;
        const { url, error } = await StorageService.uploadFile(photo.path, fileName);
        setUploading(false);

        if (error) {
            Alert.alert('Upload Failed', error);
        } else {
            Alert.alert('Success', 'Photo uploaded to your cloud!');
            setPhoto(null); // Reset for next photo
        }
    };

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
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => navigation.navigate('Settings')}
                >
                    <Text style={styles.settingsText}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {photo ? (
                <View style={styles.previewContainer}>
                    <Image source={{ uri: 'file://' + photo.path }} style={styles.preview} />
                    <View style={styles.controls}>
                        <TouchableOpacity style={styles.button} onPress={() => setPhoto(null)} disabled={uploading}>
                            <Text style={styles.buttonText}>Retake</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.uploadButton]} onPress={uploadPhoto} disabled={uploading}>
                            {uploading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Upload to Cloud</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <>
                    <Camera
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        photo={true}
                    />
                    <View style={styles.captureContainer}>
                        <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    header: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
    },
    settingsButton: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    settingsText: {
        fontSize: 24,
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    captureContainer: {
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    previewContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
    },
    preview: {
        ...StyleSheet.absoluteFillObject,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    button: {
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#333',
        minWidth: 100,
        alignItems: 'center',
    },
    uploadButton: {
        backgroundColor: '#007AFF',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
