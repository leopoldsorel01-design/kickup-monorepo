import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, PhotoFile } from 'react-native-vision-camera';
import { StorageService } from '../services/storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Svg, { Path } from 'react-native-svg';

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

    const pickVideo = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'video',
            });

            if (result.assets && result.assets.length > 0) {
                const video = result.assets[0];
                Alert.alert('Video Selected', `URI: ${video.uri}\n(Upload logic to be implemented)`);
                // Here you would typically call a service to upload the video
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick video');
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
                <TouchableOpacity style={styles.closeButton} onPress={() => navigation.navigate('Home')}>
                    <Svg width={30} height={30} viewBox="0 0 24 24">
                        <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                    </Svg>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Svg width={30} height={30} viewBox="0 0 24 24">
                        <Path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="white" />
                    </Svg>
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
                        <TouchableOpacity style={styles.galleryButton} onPress={pickVideo}>
                            <Svg width={24} height={24} viewBox="0 0 24 24">
                                <Path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="white" />
                            </Svg>
                            <Text style={styles.galleryText}>Video Take</Text>
                        </TouchableOpacity>
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
    closeButton: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    captureContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'white',
        borderWidth: 5,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    galleryButton: {
        position: 'absolute',
        left: 30,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    galleryText: {
        color: 'white',
        fontSize: 10,
        marginTop: 4,
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
