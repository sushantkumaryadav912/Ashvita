import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  success: '#28a745',
  warning: '#ffa500',
  error: '#ff4d4d',
  statusNormal: '#e6ffed',
  statusWarning: '#fff5e6',
  statusCritical: '#ffe6e6',
  textPrimary: '#333',
};

export default function HealthStatusCard({ status, message }) {
  const safeStatus = ['normal', 'warning', 'critical'].includes(status) ? status : 'normal';
  const safeMessage = typeof message === 'string' && message.trim() ? message : 'No status message available.';

  const getStatusColor = () => {
    switch (safeStatus) {
      case 'normal':
        return COLORS.success;
      case 'warning':
        return COLORS.warning;
      case 'critical':
        return COLORS.error;
      default:
        return COLORS.success;
    }
  };

  const getStatusBackground = () => {
    switch (safeStatus) {
      case 'normal':
        return COLORS.statusNormal;
      case 'warning':
        return COLORS.statusWarning;
      case 'critical':
        return COLORS.statusCritical;
      default:
        return COLORS.statusNormal;
    }
  };

  const getStatusIcon = () => {
    switch (safeStatus) {
      case 'normal':
        return <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />;
      case 'warning':
        return <Ionicons name="warning" size={24} color={COLORS.warning} />;
      case 'critical':
        return <Ionicons name="alert-circle" size={24} color={COLORS.error} />;
      default:
        return <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />;
    }
  };

  const getStatusText = () => {
    switch (safeStatus) {
      case 'normal':
        return 'Normal';
      case 'warning':
        return 'Warning';
      case 'critical':
        return 'Critical';
      default:
        return 'Normal';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusBackground() }]}>
      <View style={styles.iconContainer}>
        {getStatusIcon()}
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        <Text style={styles.messageText}>{safeMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  iconContainer: {
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
});