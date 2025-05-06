import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import EmergencyButton from '../components/EmergencyButton';
import QRCodeDisplay from '../components/QRCodeDisplay';

export default function EmergencyScreen() {
  const handleEmergency = () => {
    // Trigger AI routing and notifications
    console.log('Emergency triggered');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Emergency Services</Text>
      <EmergencyButton onPress={handleEmergency} />
      <QRCodeDisplay value="patient-id-123" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});