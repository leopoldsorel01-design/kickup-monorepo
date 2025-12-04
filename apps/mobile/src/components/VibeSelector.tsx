import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export enum Vibe {
    CHILL = 'CHILL',
    TRAINING = 'TRAINING',
    COMPETITIVE = 'COMPETITIVE',
}

interface VibeSelectorProps {
    selectedVibe: Vibe;
    onSelectVibe: (vibe: Vibe) => void;
}

const VIBE_CONFIG = {
    [Vibe.CHILL]: {
        label: 'Just for Fun',
        color: '#4CAF50', // Green
        emoji: '😌',
    },
    [Vibe.TRAINING]: {
        label: 'Practice',
        color: '#FFC107', // Gold
        emoji: '💪',
    },
    [Vibe.COMPETITIVE]: {
        label: 'Tryhard',
        color: '#F44336', // Red
        emoji: '🔥',
    },
};

export const VibeSelector: React.FC<VibeSelectorProps> = ({
    selectedVibe,
    onSelectVibe,
}) => {
    return (
        <View style={styles.container}>
            {Object.values(Vibe).map((vibe) => {
                const isSelected = selectedVibe === vibe;
                const config = VIBE_CONFIG[vibe];

                return (
                    <TouchableOpacity
                        key={vibe}
                        onPress={() => onSelectVibe(vibe)}
                        activeOpacity={0.8}
                        style={[
                            styles.button,
                            {
                                backgroundColor: isSelected ? config.color : '#f0f0f0',
                                transform: [{ scale: isSelected ? 1.05 : 1 }],
                                borderColor: config.color,
                                borderWidth: isSelected ? 0 : 2,
                            },
                        ]}
                    >
                        <Text style={styles.emoji}>{config.emoji}</Text>
                        <Text
                            style={[
                                styles.label,
                                { color: isSelected ? 'white' : '#333' },
                            ]}
                        >
                            {config.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#fff',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    emoji: {
        fontSize: 20,
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});
