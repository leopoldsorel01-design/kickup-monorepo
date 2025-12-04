import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
// Note: In a real implementation, we would use @react-native-community/blur or similar for true glassmorphism.
// For now, we simulate it with semi-transparent backgrounds and borders.

interface GlassButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
    style?: ViewStyle;
}

export const GlassButton: React.FC<GlassButtonProps> = ({ title, onPress, variant = 'primary', style }) => {
    const isPrimary = variant === 'primary';

    return (
        <TouchableOpacity
            style={[
                styles.container,
                isPrimary ? styles.primary : styles.secondary,
                style
            ]}
            onPress={onPress}
        >
            <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)', // Gold tint
    },
    secondary: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryText: {
        color: '#FFD700',
    },
    secondaryText: {
        color: '#FFFFFF',
    },
});
