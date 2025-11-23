import React from 'react';
import {
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
    TextInputProps,
    TouchableOpacityProps,
    Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface AuthInputProps extends TextInputProps {
    placeholder: string;
}

export const AuthInput = ({ placeholder, style, ...props }: AuthInputProps) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor="#B8860B" // Muted gold
                {...props}
            />
        </View>
    );
};

interface AuthButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
}

export const AuthButton = ({ title, variant = 'primary', style, ...props }: AuthButtonProps) => {
    if (variant === 'primary') {
        return (
            <TouchableOpacity
                style={[styles.buttonContainer, style]}
                activeOpacity={0.8}
                {...props}
            >
                <LinearGradient
                    colors={['#FFC107', '#FFD700', '#FFC107']} // Bright Marigold Yellow
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.primaryButtonText}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[styles.button, styles.secondaryButton, style]}
            activeOpacity={0.8}
            {...props}
        >
            <Text style={styles.secondaryButtonText}>{title}</Text>
        </TouchableOpacity>
    );
};

interface SocialButtonProps extends TouchableOpacityProps {
    provider: 'google' | 'apple';
    title: string;
}

export const SocialButton = ({ provider, title, style, ...props }: SocialButtonProps) => {
    const iconSource = provider === 'google'
        ? require('../assets/images/icon_google.png')
        : require('../assets/images/icon_apple.png');

    return (
        <TouchableOpacity style={[styles.socialButton, style]} activeOpacity={0.8} {...props}>
            <Image source={iconSource} style={styles.socialIcon} resizeMode="contain" />
            <Text style={styles.socialButtonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,
        width: '100%',
    },
    input: {
        backgroundColor: '#050B14', // Very dark navy/black
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: 12,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
        width: '100%',
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 30, // Pill shape
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30, // Pill shape
        width: '100%',
    },
    button: {
        borderRadius: 30, // Pill shape
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 16,
    },
    secondaryButton: {
        backgroundColor: '#000000', // Black background
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    primaryButtonText: {
        color: '#3E2723', // Dark Brown text
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    secondaryButtonText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000', // Black background
        borderWidth: 1,
        borderColor: '#FFD700',
        borderRadius: 30, // Pill shape
        paddingVertical: 14,
        width: '100%',
        marginBottom: 12,
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialButtonText: {
        color: '#FFD700',
        fontSize: 16,
        fontWeight: '600',
    },
});
