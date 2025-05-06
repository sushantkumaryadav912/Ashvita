import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  error: '#EF476F',
  warning: '#FFD166',
  info: '#4CC9F0',
  errorLight: '#FFEDF1',
  warningLight: '#FFF6E9',
  infoLight: '#EBF0FF',
  textPrimary: '#2B2D42',
  textSecondary: '#8D99AE',
  cardBackground: '#FFFFFF',
};

export default function AlertsSection({ alerts }) {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
        return <Ionicons name="warning" size={20} color={COLORS.error} />;
      case 'warning':
        return <Ionicons name="warning-outline" size={20} color={COLORS.warning} />;
      case 'info':
        return <Ionicons name="information-circle" size={20} color={COLORS.info} />;
      default:
        return <Ionicons name="information-circle" size={20} color={COLORS.info} />;
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

  // Ensure alerts is an array before mapping
  const alertsArray = Array.isArray(alerts) ? alerts : [];

  return (
    <View style={styles.container}>
      {alertsArray.length > 0 ? (
        alertsArray.map((alert) => (
          <TouchableOpacity 
            key={alert.id} 
            style={[styles.alertCard, { backgroundColor: getAlertBackground(alert.type) }]}
            activeOpacity={0.8}
          >
            <View style={styles.alertIconContainer}>
              {getAlertIcon(alert.type)}
            </View>
            
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <Text style={[styles.alertType, { color: getAlertColor(alert.type) }]}>
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                </Text>
                <Text style={styles.alertTimestamp}>{alert.timestamp}</Text>
              </View>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              
              <View style={styles.alertActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={[styles.actionText, { color: getAlertColor(alert.type) }]}>Dismiss</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={[styles.actionText, { color: getAlertColor(alert.type) }]}>Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="notifications" size={20} color={COLORS.textSecondary} />
          <Text style={styles.noDataText}>No alerts available.</Text>
        </View>
      )}

      {alertsArray.length > 0 && (
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All Alerts</Text>
          <Ionicons name="chevron-forward" size={16} color="#4361EE" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  alertCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  alertIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertType: {
    fontSize: 13,
    fontWeight: '700',
  },
  alertTimestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 10,
    lineHeight: 20,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 16,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EBF0FF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: '#4361EE',
    fontWeight: '600',
    marginRight: 4,
  },
  noDataContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  noDataText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});