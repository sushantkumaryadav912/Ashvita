import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import ProfileInfoCard from '../components/ProfileInfoCard';
import EmergencyContactsList from '../components/EmergencyContactsList';
import MedicalRecordsList from '../components/MedicalRecordsList';

const COLORS = {
  background: '#f5f5f5',
  textPrimary: '#333',
};

// Mock data for profile components
const mockProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 555-123-4567',
  dob: '1990-01-01',
  gender: 'Male',
  address: '123 Main St, City, Country',
};

const mockEmergencyContacts = [
  {
    id: 'contact-001',
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+1 555-987-6543',
    email: 'jane.doe@example.com',
  },
];

const mockMedicalRecords = [
  {
    id: 'record-001',
    title: 'Annual Checkup',
    date: '2025-01-15',
    provider: 'City Hospital',
    type: 'Checkup Report',
  },
];

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Information</Text>
        <ProfileInfoCard profile={mockProfile} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <EmergencyContactsList contacts={mockEmergencyContacts} />
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Medical Records</Text>
        <MedicalRecordsList records={mockMedicalRecords} />
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
  section: {
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
});