import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ImageBackground, Animated, Easing, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const SplashScreen = () => {
    const rotateValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const startRotation = () => {
            rotateValue.setValue(0);
            Animated.loop(
                Animated.timing(rotateValue, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        };

        startRotation();
    }, [rotateValue]);

    const spin = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <ImageBackground
            source={require('../assets/images/splash_cinematic.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <View style={styles.topContent}>
                    <Text style={styles.titleText}>
                        Get ready to train{'\n'}like a champion!
                    </Text>
                </View>

                <View style={styles.bottomContent}>
                    <View style={styles.loaderContainer}>
                        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
                        <Text style={styles.loadingText}>LOADING...</Text>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 60,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(0,0,0,0.2)', // Subtle overlay for readability
    },
    topContent: {
        marginTop: 40,
        alignItems: 'center',
    },
    titleText: {
        fontSize: 36,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
        lineHeight: 42,
        letterSpacing: 0.5,
    },
    bottomContent: {
        marginBottom: 40,
        alignItems: 'center',
    },
    loaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    spinner: {
        width: 32,
        height: 32,
        marginRight: 12,
        borderRadius: 16,
        borderWidth: 3,
        borderColor: 'transparent',
        borderTopColor: '#FFD700',
        borderRightColor: '#FFD700',
    },
    loadingText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 2,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
});
