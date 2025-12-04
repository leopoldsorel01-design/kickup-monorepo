import React from 'react';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { View } from 'react-native';

interface JerseyIconProps {
    primaryColor: string;
    secondaryColor: string;
    number: string;
    size?: number;
}

export const JerseyIcon: React.FC<JerseyIconProps> = ({
    primaryColor,
    secondaryColor,
    number,
    size = 50,
}) => {
    return (
        <View style={{ width: size, height: size }}>
            <Svg width="100%" height="100%" viewBox="0 0 512 512">
                <G>
                    {/* Base T-Shirt Shape */}
                    <Path
                        d="M378.5,64.5 L338.5,24.5 L173.5,24.5 L133.5,64.5 L64.5,133.5 L104.5,173.5 L133.5,144.5 L133.5,448.5 L378.5,448.5 L378.5,144.5 L407.5,173.5 L447.5,133.5 L378.5,64.5 Z"
                        fill={primaryColor}
                        stroke="black"
                        strokeWidth="5"
                    />
                    {/* Collar/Neck */}
                    <Path
                        d="M173.5,24.5 C173.5,24.5 200.5,64.5 256,64.5 C311.5,64.5 338.5,24.5 338.5,24.5"
                        fill="none"
                        stroke={secondaryColor}
                        strokeWidth="10"
                    />
                    {/* Sleeves Detail */}
                    <Path
                        d="M64.5,133.5 L104.5,173.5"
                        stroke={secondaryColor}
                        strokeWidth="10"
                    />
                    <Path
                        d="M447.5,133.5 L407.5,173.5"
                        stroke={secondaryColor}
                        strokeWidth="10"
                    />
                    {/* Number */}
                    <SvgText
                        x="256"
                        y="300"
                        fontSize="150"
                        fill={secondaryColor}
                        textAnchor="middle"
                        fontWeight="bold"
                        alignmentBaseline="middle"
                    >
                        {number}
                    </SvgText>
                </G>
            </Svg>
        </View>
    );
};
