import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  background: '#f5f5f5',
  textPrimary: '#333',
  primary: '#007bff',
};

export default function CommunicationScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <Text style={styles.title}>Communication</Text>
      </View>
      <Text style={styles.message}>This feature is under development.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16, // Keep horizontal padding, remove top/bottom padding
  },
  customHeader: {
    paddingVertical: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  message: {
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
}); 