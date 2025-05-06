import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  textPrimary: '#2B2D42',
  textSecondary: '#8D99AE',
  cardBackground: '#FFFFFF',
  primary: '#4361EE',
  secondary: '#4CC9F0',
  warning: '#FFD166',
  success: '#06D6A0',
  error: '#EF476F',
  primaryLight: '#EBF0FF',
};

export default function VitalsCard({ title, value, unit, icon, color, trend }) {
  // Validate and set default props
  const safeTitle = typeof title === 'string' && title.trim() ? title : 'Unknown Vital';
  const safeValue = value != null ? (typeof value === 'number' ? value.toFixed(1) : value.toString()) : '--';
  const safeUnit = typeof unit === 'string' && unit.trim() ? unit : '';
  const safeIcon = typeof icon === 'string' && icon.trim() ? icon : 'heart';
  const safeColor = typeof color === 'string' && color.trim() ? color : COLORS.primary;
  const safeTrend = ['up', 'down', 'stable'].includes(trend) ? trend : null;

  const getColorCode = () => {
    switch (safeColor) {
      case 'primary': return COLORS.primary;
      case 'secondary': return COLORS.secondary;
      case 'warning': return COLORS.warning;
      case 'success': return COLORS.success;
      case 'error': return COLORS.error;
      default: return safeColor;
    }
  };

  const renderIcon = () => {
    const iconColor = getColorCode();
    
    switch (safeIcon) {
      case 'heart':
        return <Ionicons name="heart" size={22} color={iconColor} />;
      case 'activity':
        return <Ionicons name="pulse" size={22} color={iconColor} />;
      case 'droplet':
        return <Ionicons name="water" size={22} color={iconColor} />;
      case 'thermometer':
        return <Ionicons name="thermometer" size={22} color={iconColor} />;
      case 'fitness':
        return <Ionicons name="fitness" size={22} color={iconColor} />;
      default:
        return <Ionicons name="medical" size={22} color={iconColor} />;
    }
  };

  const renderTrendIcon = () => {
    switch (safeTrend) {
      case 'up':
        return <Ionicons name="trending-up" size={16} color={COLORS.warning} />;
      case 'down':
        return <Ionicons name="trending-down" size={16} color={COLORS.info} />;
      case 'stable':
        return <Ionicons name="remove" size={16} color={COLORS.success} />;
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${getColorCode()}10` }]}>
          {renderIcon()}
        </View>
        {safeTrend && <View style={styles.trendIcon}>{renderTrendIcon()}</View>}
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{safeValue}</Text>
        {safeUnit && <Text style={styles.unit}>{safeUnit}</Text>}
      </View>
      
      <Text style={styles.title}>{safeTitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 26,
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
