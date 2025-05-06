import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  success: '#06D6A0',
  warning: '#FFD166',
  error: '#EF476F',
  statusNormal: '#E7F9F1',
  statusWarning: '#FFF6E9',
  statusCritical: '#FFEDF1',
  textPrimary: '#2B2D42',
  cardBackground: '#FFFFFF',
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
        return <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />;
      case 'warning':
        return <Ionicons name="warning" size={28} color={COLORS.warning} />;
      case 'critical':
        return <Ionicons name="alert-circle" size={28} color={COLORS.error} />;
      default:
        return <Ionicons name="checkmark-circle" size={28} color={COLORS.success} />;
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

  const getFeedbackText = () => {
    switch (safeStatus) {
      case 'normal':
        return 'Everything looks good!';
      case 'warning':
        return 'Attention needed';
      case 'critical':
        return 'Immediate action required';
      default:
        return 'Status information';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusBackground() }]}>
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <View style={styles.statusIconContainer}>
            {getStatusIcon()}
          </View>
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusText, { color: getStatusColor() }]}>
              {getStatusText()}
            </Text>
            <Text style={styles.feedbackText}>{getFeedbackText()}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#8D99AE" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.messageText}>{safeMessage}</Text>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: getStatusColor() }]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  feedbackText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    opacity: 0.7,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 15,
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginRight: 8,
  },
});