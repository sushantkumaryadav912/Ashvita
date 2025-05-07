import React, { useState, useEffect } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import mockData from '../../assets/data/vitals.json';

// Components
import AlertsSection from '../components/AlertsSection';
import DoctorNotesList from '../components/DoctorNotesList';
import HealthStatusCard from '../components/HealthStatusCard';
import VitalsCard from '../components/VitalsCard';

// Design system
const COLORS = {
  primary: '#4361EE',
  primaryDark: '#3A56D4',
  primaryLight: '#EBF0FF',
  secondary: '#4CC9F0',
  success: '#06D6A0',
  warning: '#FFD166',
  error: '#EF476F',
  background: '#F7F9FC',
  cardBackground: '#FFFFFF',
  textPrimary: '#2B2D42',
  textSecondary: '#8D99AE',
  border: '#E9ECEF',
  statusNormal: '#E7F9F1',
  statusWarning: '#FFF6E9',
  statusCritical: '#FFEDF1',
};

// Base URL for the Azure backend API
const API_BASE_URL = process.env.API_BASE_URL || 'https://your-api-url.com/api';

export default function DashboardScreen() {
  const [vitals, setVitals] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [healthStatus, setHealthStatus] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get authentication token from AsyncStorage
      const token = await AsyncStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch all data concurrently
      const [vitalsResponse, alertsResponse, healthStatusResponse, doctorNotesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/vitals`, { headers }).catch(() => ({ data: mockData.vitals })),
        axios.get(`${API_BASE_URL}/alerts`, { headers }).catch(() => ({ data: mockData.alerts })),
        axios.get(`${API_BASE_URL}/health-status`, { headers }).catch(() => ({ data: mockData.healthStatus })),
        axios.get(`${API_BASE_URL}/doctor-notes`, { headers }).catch(() => ({ data: mockData.doctorNotes })),
      ]);

      // Ensure data is in the expected format
      const vitalsData = Array.isArray(vitalsResponse.data) ? vitalsResponse.data : mockData.vitals;
      const alertsData = Array.isArray(alertsResponse.data) ? alertsResponse.data : mockData.alerts;
      const healthStatusData = healthStatusResponse.data && typeof healthStatusResponse.data === 'object' ? healthStatusResponse.data : mockData.healthStatus;
      const doctorNotesData = Array.isArray(doctorNotesResponse.data) ? doctorNotesResponse.data : mockData.doctorNotes;

      setVitals(vitalsData);
      setAlerts(alertsData);
      setHealthStatus(healthStatusData);
      setDoctorNotes(doctorNotesData);
    } catch (err) {
      setError('Failed to fetch data. Using mock data.');
      // Fallback to mock data for all sections
      setVitals(mockData.vitals);
      setAlerts(mockData.alerts);
      setHealthStatus(mockData.healthStatus);
      setDoctorNotes(mockData.doctorNotes);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Option to force mock data for testing
  const useMockData = false; // Set to true to use mock data only
  useEffect(() => {
    if (useMockData) {
      setVitals(mockData.vitals);
      setAlerts(mockData.alerts);
      setHealthStatus(mockData.healthStatus);
      setDoctorNotes(mockData.doctorNotes);
      setLoading(false);
    }
  }, []);

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your health data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      <View style={styles.headerContainer}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerTitle}>Health Dashboard</Text>
              <Text style={styles.headerSubtitle}>Your daily health overview</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="refresh" size={22} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color={COLORS.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchData}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Status</Text>
          {healthStatus ? (
            <HealthStatusCard status={healthStatus.status} message={healthStatus.message} />
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="medical" size={24} color={COLORS.textSecondary} />
              <Text style={styles.noDataText}>No health status available.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vitals</Text>
          {Array.isArray(vitals) && vitals.length > 0 ? (
            <View style={styles.vitalsContainer}>
              {vitals.map((vital, index) => (
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
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="pulse" size={24} color={COLORS.textSecondary} />
              <Text style={styles.noDataText}>No vitals data available.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Alerts</Text>
            {alerts.length > 0 && (
              <View style={styles.alertBadge}>
                <Text style={styles.alertBadgeText}>{alerts.length}</Text>
              </View>
            )}
          </View>
          
          {Array.isArray(alerts) && alerts.length > 0 ? (
            <AlertsSection alerts={alerts} />
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="notifications" size={24} color={COLORS.textSecondary} />
              <Text style={styles.noDataText}>No alerts available.</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Doctor Notes</Text>
          {Array.isArray(doctorNotes) && doctorNotes.length > 0 ? (
            <DoctorNotesList notes={doctorNotes} />
          ) : (
            <View style={styles.noDataContainer}>
              <Ionicons name="document-text" size={24} color={COLORS.textSecondary} />
              <Text style={styles.noDataText}>No doctor notes available.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  headerContainer: {
    width: '100%',
    height: 110,
    marginTop: 0,
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  headerContent: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e6f3ff',
    marginTop: 4,
  },
  refreshButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  alertBadge: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  alertBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
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
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  errorContainer: {
    backgroundColor: COLORS.statusCritical,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  noDataContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noDataText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
});