import React from 'react';
import { Text } from 'react-native';

interface TextProps {
  style: object;
  bold?: boolean;
  children: React.ReactNode;
}

const AppText = ({ children, bold, style }: TextProps) => (
  <Text style={[style, { fontFamily: bold ? 'MulishBold' : 'MulishRegular' }]}>
    {children}
  </Text>
);

export default AppText