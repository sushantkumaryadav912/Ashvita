import React from 'react';
import { View } from 'react-native';

export default function TabBarIcon({ icon: Icon, color, size = 24 }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={Icon.name} size={size} color={color} />
    </View>
  );
}