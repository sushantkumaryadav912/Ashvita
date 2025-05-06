import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import AlertsSection from '../components/AlertsSection';
import DoctorNotesList from '../components/DoctorNotesList';
import HealthStatusCard from '../components/HealthStatusCard';
import VitalsCard from '../components/VitalsCard';

const COLORS = {
  background: '#f5f5f5',
  textPrimary: '#333',
  textSecondary: '#666',
  primary: '#007bff',
};

// Mock data simulating Azure Cosmos DB or IoT wearable inputs
const mockVitals = [
  { title: 'Heart Rate', value: 72, unit: 'bpm', icon: 'heart', color: '#ff4d4d', trend: 'stable' },
  { title: 'SpO2', value: 98, unit: '%', icon: 'droplet', color: '#007bff', trend: 'up' },
  { title: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'activity', color: '#28a745', trend: 'down' },
  { title: 'Temperature', value: 36.6, unit: '°C', icon: 'thermometer', color: '#ffa500', trend: 'stable' },
];

const mockAlerts = [
  {
    id: 'alert-001',
    type: 'warning',
    title: 'Elevated Heart Rate',
    message: 'Heart rate reached 90 bpm during exercise. Monitor closely.',
    timestamp: '2025-05-06 14:30',
  },
  {
    id: 'alert-002',
    type: 'info',
    title: 'Medication Reminder',
    message: 'Take your prescribed medication at 18:00.',
    timestamp: '2025-05-06 09:00',
  },
];

const mockHealthStatus = {
  status: 'normal',
  message: 'All vitals are within normal ranges. Continue regular monitoring.',
};

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time health overview</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Status</Text>
        <HealthStatusCard status={mockHealthStatus.status} message={mockHealthStatus.message} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vitals</Text>
        <View style={styles.vitalsContainer}>
          {mockVitals.map((vital, index) => (
            <VitalsCard
              key={index}
              title={vital.title}
              value={vital.value}
              unit={vital.unit}
              icon={vital.icon}
              color={vital.color}
              trend={vital.trend}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts</Text>
        <AlertsSection alerts={mockAlerts} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Doctor Notes</Text>
        <DoctorNotesList />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: 16, // Keep horizontal padding, remove top/bottom padding
  },
  header: {
    paddingVertical: 20,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e6f3ff',
    marginTop: 4,
  },
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  vitalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});