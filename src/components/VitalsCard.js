import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  textPrimary: '#333',
  textSecondary: '#666',
  cardBackground: '#fff',
  warning: '#ffa500',
  info: '#007bff',
  error: '#ff4d4d',
};

export default function VitalsCard({ title, value, unit, icon, color, trend }) {
  // Validate and set default props
  const safeTitle = typeof title === 'string' && title.trim() ? title : 'Unknown Vital';
  const safeValue = value != null ? (typeof value === 'number' ? value.toFixed(1) : value.toString()) : '--';
  const safeUnit = typeof unit === 'string' && unit.trim() ? unit : '';
  const safeIcon = typeof icon === 'string' && icon.trim() ? icon : 'heart';
  const safeColor = typeof color === 'string' && color.trim() ? color : COLORS.textSecondary;
  const safeTrend = ['up', 'down', 'stable'].includes(trend) ? trend : null;

  const renderIcon = () => {
    switch (safeIcon) {
      case 'heart':
        return <Ionicons name="heart" size={20} color={safeColor} />;
      case 'activity':
        return <Ionicons name="pulse" size={20} color={safeColor} />;
      case 'droplet':
        return <Ionicons name="water" size={20} color={safeColor} />;
      case 'thermometer':
        return <Ionicons name="thermometer" size={20} color={safeColor} />;
      default:
        return <Ionicons name="heart" size={20} color={safeColor} />;
    }
  };

  const renderTrendIcon = () => {
    switch (safeTrend) {
      case 'up':
        return <Ionicons name="trending-up" size={16} color={COLORS.warning} />;
      case 'down':
        return <Ionicons name="trending-down" size={16} color={COLORS.info} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {renderIcon()}
        <Text style={styles.title}>{safeTitle}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{safeValue}</Text>
        {safeUnit ? <Text style={styles.unit}>{safeUnit}</Text> : null}
        {safeTrend && <View style={styles.trendIcon}>{renderTrendIcon()}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  unit: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
    marginBottom: 3,
  },
  trendIcon: {
    marginLeft: 'auto',
  },
});