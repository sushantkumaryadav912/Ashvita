import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AlertsSection from '../components/AlertsSection';
import DoctorNotesList from '../components/DoctorNotesList';
import HealthStatusCard from '../components/HealthStatusCard';
import VitalsCard from '../components/VitalsCard';

const COLORS = {
  background: '#f5f5f5',
  textPrimary: '#333',
  textSecondary: '#666',
  primary: '#007bff',
  error: '#ff4d4d',
};

// Base URL for the Azure backend API (replace with your actual API URL)
const API_BASE_URL = 'https://localhost:5000/api';

export default function DashboardScreen() {
  const [vitals, setVitals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data concurrently
        const [vitalsResponse, alertsResponse, healthStatusResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/vitals`),
          axios.get(`${API_BASE_URL}/alerts`),
          axios.get(`${API_BASE_URL}/health-status`),
        ]);

        setVitals(vitalsResponse.data);
        setAlerts(alertsResponse.data);
        setHealthStatus(healthStatusResponse.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health Dashboard</Text>
        <Text style={styles.headerSubtitle}>Real-time health overview</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Status</Text>
        {healthStatus ? (
          <HealthStatusCard status={healthStatus.status} message={healthStatus.message} />
        ) : (
          <Text style={styles.noDataText}>No health status available.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vitals</Text>
        <View style={styles.vitalsContainer}>
          {vitals.length > 0 ? (
            vitals.map((vital, index) => (
              <VitalsCard
                key={index}
                title={vital.title}
                value={vital.value}
                unit={vital.unit}
                icon={vital.icon}
                color={vital.color}
                trend={vital.trend}
              />
            ))
          ) : (
            <Text style={styles.noDataText}>No vitals data available.</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts</Text>
        {alerts.length > 0 ? (
          <AlertsSection alerts={alerts} />
        ) : (
          <Text style={styles.noDataText}>No alerts available.</Text>
        )}
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
    paddingHorizontal: 16,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.error,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});