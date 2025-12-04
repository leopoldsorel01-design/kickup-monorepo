import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { Stats } from '../types/matchmaking';

interface RadarChartProps {
    stats: Stats;
    size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ stats, size = 300 }) => {
    const center = size / 2;
    const radius = (size / 2) * 0.8; // Leave some padding for labels
    const labels = ['Pace', 'Shooting', 'Passing', 'Dribbling', 'Defense', 'Physical'];
    const data = [
        stats.pace,
        stats.shooting,
        stats.passing,
        stats.dribbling,
        stats.defense,
        stats.physical,
    ];

    const getPoint = (value: number, index: number, maxRadius: number) => {
        const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
        const x = center + (value / 100) * maxRadius * Math.cos(angle);
        const y = center + (value / 100) * maxRadius * Math.sin(angle);
        return { x, y };
    };

    const polygonPoints = data
        .map((value, index) => {
            const { x, y } = getPoint(value, index, radius);
            return `${x},${y}`;
        })
        .join(' ');

    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <View style={styles.container}>
            <Svg height={size} width={size}>
                {/* Grid Lines */}
                {gridLevels.map((level) => {
                    const points = labels
                        .map((_, index) => {
                            const { x, y } = getPoint(level, index, radius);
                            return `${x},${y}`;
                        })
                        .join(' ');
                    return (
                        <Polygon
                            key={`grid-${level}`}
                            points={points}
                            stroke="#e0e0e0"
                            strokeWidth="1"
                            fill="none"
                        />
                    );
                })}

                {/* Axes */}
                {labels.map((label, index) => {
                    const { x, y } = getPoint(100, index, radius);
                    return (
                        <Line
                            key={`axis-${index}`}
                            x1={center}
                            y1={center}
                            x2={x}
                            y2={y}
                            stroke="#e0e0e0"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <Polygon
                    points={polygonPoints}
                    fill="rgba(0, 122, 255, 0.5)"
                    stroke="#007AFF"
                    strokeWidth="2"
                />

                {/* Data Points */}
                {data.map((value, index) => {
                    const { x, y } = getPoint(value, index, radius);
                    return (
                        <Circle
                            key={`point-${index}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#007AFF"
                        />
                    );
                })}

                {/* Labels */}
                {labels.map((label, index) => {
                    const { x, y } = getPoint(115, index, radius); // Push labels out a bit
                    return (
                        <SvgText
                            key={`label-${index}`}
                            x={x}
                            y={y}
                            fontSize="12"
                            fill="#333"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                            {label}
                        </SvgText>
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
});
