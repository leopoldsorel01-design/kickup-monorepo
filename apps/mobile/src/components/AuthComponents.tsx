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

import Svg, { Path } from 'react-native-svg';

interface AuthInputProps extends TextInputProps {
    placeholder: string;
}

export const AuthInput = ({ placeholder, style, ...props }: AuthInputProps) => {
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor="rgba(255, 255, 255, 0.5)" // White/Gray placeholder
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
                style={[styles.buttonContainer, styles.primaryButton, style]}
                activeOpacity={0.8}
                {...props}
            >
                <Text style={styles.primaryButtonText}>{title}</Text>
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
    const renderIcon = () => {
        if (provider === 'google') {
            return (
                <Svg width={24} height={24} viewBox="0 0 24 24" style={styles.socialIcon}>
                    <Path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 0.507 5.387 0 12s5.36 12 12 12c3.613 0 6.36-1.187 7.667-2.533 2.547-2.747 2.547-7.253 2.547-7.253h-9.733z"
                        fill="#FFD700"
                    />
                </Svg>
            );
        }
        return (
            <Svg width={24} height={24} viewBox="0 0 24 24" style={styles.socialIcon}>
                <Path
                    d="M17.05 20.28c-.98.95-2.05 1.72-3.71 1.72-1.53 0-2.48-.87-4.15-.87-1.66 0-2.29.84-3.89.84-3.6 0-7.26-4.53-7.26-10.71 0-4.29 2.45-7.12 5.85-7.12 1.63 0 2.92.92 4.14.92 1.19 0 2.71-1.05 4.73-1.05 1.03.04 3.32.32 4.87 2.41-4.18 2.08-3.47 8.27.72 10.16-.58 1.59-1.42 3.19-2.42 4.2l-.69.76zM12.05 3.18c.88-1.28 1.5-2.94 1.33-4.58-1.48.08-3.22.95-4.19 2.14-.82 1.01-1.53 2.78-1.35 4.32 1.66.13 3.35-.64 4.21-1.88z"
                    fill="#FFD700"
                />
            </Svg>
        );
    };

    return (
        <TouchableOpacity style={[styles.socialButton, style]} activeOpacity={0.8} {...props}>
            {renderIcon()}
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
        backgroundColor: 'transparent', // Transparent background
        borderWidth: 1,
        borderColor: '#FFD700', // Gold border
        borderRadius: 12,
        padding: 16,
        color: '#FFD700', // Gold text
        fontSize: 16,
        width: '100%',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 16,
        borderRadius: 25, // Rounded corners 25
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButton: {
        backgroundColor: '#FFD700', // Solid Gold
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        borderRadius: 25, // Rounded corners 25
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginBottom: 16,
    },
    secondaryButton: {
        backgroundColor: '#000000',
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    primaryButtonText: {
        color: '#000000', // Bold Black text
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
        borderColor: '#FFD700', // Gold border
        borderRadius: 25, // Rounded corners 25
        paddingVertical: 14,
        width: '100%',
        marginBottom: 12,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialButtonText: {
        color: '#FFFFFF', // White text
        fontSize: 16,
        fontWeight: '600',
    },
});
