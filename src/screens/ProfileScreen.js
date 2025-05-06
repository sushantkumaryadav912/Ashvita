import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import ProfileInfoCard from '../components/ProfileInfoCard';
import EmergencyContactsList from '../components/EmergencyContactsList';
import MedicalRecordsList from '../components/MedicalRecordsList';

const COLORS = {
  background: '#f5f5f5',
  textPrimary: '#333',
  textSecondary: '#666',
  error: '#ff4d4d',
};

const API_BASE_URL = 'https://localhost:5000/api';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [profileResponse, contactsResponse, recordsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/profile`),
          axios.get(`${API_BASE_URL}/emergency-contacts`),
          axios.get(`${API_BASE_URL}/medical-records`),
        ]);

        setProfile(profileResponse.data);
        setEmergencyContacts(contactsResponse.data);
        setMedicalRecords(recordsResponse.data);
      } catch (err) {
        setError('Failed to fetch profile data. Please try again later.');
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.textPrimary} />
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
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        {profile ? (
          <ProfileInfoCard profile={profile} />
        ) : (
          <Text style={styles.noDataText}>No profile information available.</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        {emergencyContacts.length > 0 ? (
          <EmergencyContactsList contacts={emergencyContacts} />
        ) : (
          <Text style={styles.noDataText}>No emergency contacts available.</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Records</Text>
        {medicalRecords.length > 0 ? (
          <MedicalRecordsList records={medicalRecords} />
        ) : (
          <Text style={styles.noDataText}>No medical records available.</Text>
        )}
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
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
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