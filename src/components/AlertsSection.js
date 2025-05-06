import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  error: '#ff4d4d',
  warning: '#ffa500',
  info: '#007bff',
  errorLight: '#ffe6e6',
  warningLight: '#fff5e6',
  infoLight: '#e6f3ff',
  textPrimary: '#333',
  textSecondary: '#666',
};

export default function AlertsSection({ alerts }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <Ionicons name="warning" size={18} color={COLORS.error} />;
      case 'warning':
        return <Ionicons name="warning-outline" size={18} color={COLORS.warning} />;
      case 'info':
        return <Ionicons name="information-circle" size={18} color={COLORS.info} />;
      default:
        return <Ionicons name="information-circle" size={18} color={COLORS.info} />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical':
        return COLORS.error;
      case 'warning':
        return COLORS.warning;
      case 'info':
        return COLORS.info;
      default:
        return COLORS.info;
    }
  };

  const getAlertBackground = (type) => {
    switch (type) {
      case 'critical':
        return COLORS.errorLight;
      case 'warning':
        return COLORS.warningLight;
      case 'info':
        return COLORS.infoLight;
      default:
        return COLORS.infoLight;
    }
  };

  return (
    <View style={styles.container}>
      {alerts.map((alert) => (
        <TouchableOpacity 
          key={alert.id} 
          style={[styles.alertCard, { backgroundColor: getAlertBackground(alert.type) }]}
        >
          <View style={styles.alertHeader}>
            <View style={styles.alertIconContainer}>
              {getAlertIcon(alert.type)}
            </View>
            <Text style={[styles.alertType, { color: getAlertColor(alert.type) }]}>
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </Text>
            <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
          </View>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          <Text style={styles.alertMessage}>{alert.message}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  alertCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertIconContainer: {
    marginRight: 8,
  },
  alertType: {
    fontSize: 14,
    fontWeight: '600',
  },
  alertTimestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 'auto',
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});