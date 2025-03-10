import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, Rect, G } from 'react-native-svg';

const EUFlag = () => (
  <View style={styles.flagContainer}>
    <Svg width="40" height="40" viewBox="0 0 40 40">
      <Rect x="0" y="0" width="40" height="40" fill="#0052B4" />
      <G fill="#FFDA44">
        {/* This is a simplified EU flag with just a circle of stars */}
        <Circle cx="20" cy="20" r="12" fill="none" stroke="#FFDA44" strokeWidth="1" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 20 + 8 * Math.sin(angle);
          const y = 20 - 8 * Math.cos(angle);
          return <Circle key={i} cx={x} cy={y} r="1.5" fill="#FFDA44" />;
        })}
      </G>
    </Svg>
  </View>
);

const USFlag = () => (
  <View style={styles.flagContainer}>
    <Svg width="40" height="40" viewBox="0 0 40 40">
      {/* Simplified US flag */}
      <Rect x="0" y="0" width="40" height="40" fill="#FFFFFF" />
      {Array.from({ length: 7 }).map((_, i) => (
        <Rect key={i} x="0" y={i * 6 + 2} width="40" height="3" fill="#D80027" />
      ))}
      <Rect x="0" y="0" width="20" height="20" fill="#0052B4" />
      {/* Simplified stars */}
      {Array.from({ length: 9 }).map((_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        return (
          <Circle
            key={i}
            cx={col * 6 + 4}
            cy={row * 6 + 4}
            r="1.5"
            fill="#FFFFFF"
          />
        );
      })}
    </Svg>
  </View>
);

const GBPFlag = () => (
  <View style={styles.flagContainer}>
    <Svg width="40" height="40" viewBox="0 0 40 40">
      {/* Simplified UK flag */}
      <Rect x="0" y="0" width="40" height="40" fill="#012169" />
      <Path d="M0,0 L40,40 M40,0 L0,40" stroke="#FFFFFF" strokeWidth="4" />
      <Path d="M20,0 L20,40 M0,20 L40,20" stroke="#FFFFFF" strokeWidth="8" />
      <Path d="M20,0 L20,40 M0,20 L40,20" stroke="#D80027" strokeWidth="4" />
    </Svg>
  </View>
);
export { EUFlag, USFlag, GBPFlag };

const styles = StyleSheet.create({
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 12,
  },
});