import React, { useState, useEffect, useCallback } from 'react';
import { 
  ScrollView, View, Text, StyleSheet, ActivityIndicator, 
  RefreshControl, Image, TouchableOpacity, StatusBar, Platform
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProfileInfoCard from '../components/ProfileInfoCard';
import EmergencyContactsList from '../components/EmergencyContactsList';
import MedicalRecordsList from '../components/MedicalRecordsList';

const COLORS = {
  background: '#f8f9fa',
  cardBackground: '#fff',
  primary: '#4361ee',
  primaryLight: '#e9efff',
  secondary: '#3f37c9',
  accent: '#4895ef',
  textPrimary: '#333',
  textSecondary: '#666',
  error: '#f72585',
  border: '#e6e6e6',
  success: '#4cc9f0',
  warning: '#ffd166',
};

const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminPatients, setAdminPatients] = useState([]);
  const [adminDoctors, setAdminDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const token = await AsyncStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch profile, emergency contacts, and medical records
      const [profileResponse, contactsResponse, recordsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/profile`, config),
        axios.get(`${API_BASE_URL}/emergency-contacts`, config),
        axios.get(`${API_BASE_URL}/medical-records`, config),
      ]);

      setProfile(profileResponse.data);
      setEmergencyContacts(contactsResponse.data);
      setMedicalRecords(recordsResponse.data);

      // Fetch admin-specific data if user is an admin
      if (profileResponse.data.userType === 'admin') {
        const [usersRes, patientsRes, doctorsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/users`, config),
          axios.get(`${API_BASE_URL}/admin/patients`, config),
          axios.get(`${API_BASE_URL}/admin/doctors`, config),
        ]);

        setAdminUsers(usersRes.data);
        setAdminPatients(patientsRes.data);
        setAdminDoctors(doctorsRes.data);
      }
    } catch (err) {
      setError('Failed to fetch profile data. Please try again later.');
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <Ionicons name="alert-circle" size={64} color={COLORS.error} />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderDoctorProfessionalInfo = () => {
    if (!profile || profile.userType !== 'doctor') return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medkit" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Professional Information</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Specialization: {profile.specialization || 'Not Provided'}</Text>
          <Text style={styles.infoLabel}>License Number: {profile.licenseNumber || 'Not Provided'}</Text>
          <Text style={styles.infoLabel}>Hospital: {profile.hospitalAffiliation || 'Not Provided'}</Text>
          <Text style={styles.infoLabel}>Experience: {profile.yearsOfExperience || 'Not Provided'}</Text>
        </View>
      </View>
    );
  };

  const renderAdminDashboard = () => {
    if (!profile || profile.userType !== 'admin') return null;
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="people" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Admin Dashboard</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Role: {profile.role || 'Not Provided'}</Text>
          <Text style={styles.infoLabel}>Permissions: {(profile.permissions || []).join(', ') || 'Not Provided'}</Text>
        </View>

        {/* Users List */}
        <Text style={styles.sectionTitle}>Users ({adminUsers.length})</Text>
        {adminUsers.length > 0 ? (
          adminUsers.map(user => (
            <View key={user.id} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{user.name} ({user.userType}) - {user.email}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No users available.</Text>
        )}

        {/* Patients List */}
        <Text style={styles.sectionTitle}>Patients ({adminPatients.length})</Text>
        {adminPatients.length > 0 ? (
          adminPatients.map(patient => (
            <View key={patient.id} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{patient.name} - {patient.email}</Text>
              <Text style={styles.infoSubLabel}>Allergies: {(patient.allergies || []).join(', ') || 'None'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No patients available.</Text>
        )}

        {/* Doctors List */}
        <Text style={styles.sectionTitle}>Doctors ({adminDoctors.length})</Text>
        {adminDoctors.length > 0 ? (
          adminDoctors.map(doctor => (
            <View key={doctor.id} style={styles.infoItem}>
              <Text style={styles.infoLabel}>{doctor.name} - {doctor.email}</Text>
              <Text style={styles.infoSubLabel}>Specialization: {doctor.specialization || 'Not Provided'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No doctors available.</Text>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
      }
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {profile?.avatar ? (
            <Image source={{ uri: profile.avatar }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileImageText}>
                {profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.headerTitle}>
          {profile?.userType === 'admin' ? 'Admin Dashboard' : 'Health Profile'}
        </Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Profile Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Profile Information</Text>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={18} color={COLORS.primary} />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {profile ? (
          <ProfileInfoCard profile={profile} />
        ) : (
          <View style={styles.noDataContainer}>
            <Ionicons name="alert-circle-outline" size={24} color={COLORS.warning} />
            <Text style={styles.noDataText}>No profile information available.</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Profile Info</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Doctor Professional Information Section */}
      {renderDoctorProfessionalInfo()}

      {/* Patient-Specific Sections */}
      {profile && profile.userType === 'patient' && (
        <>
          {/* Emergency Contacts Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Emergency Contacts</Text>
              <TouchableOpacity style={styles.addSmallButton}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addSmallButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
            {emergencyContacts && emergencyContacts.length > 0 ? (
              <EmergencyContactsList contacts={emergencyContacts} />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="people-outline" size={24} color={COLORS.warning} />
                <Text style={styles.noDataText}>No emergency contacts available.</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>Add Emergency Contact</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Medical Records Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Medical Records</Text>
              <TouchableOpacity style={styles.addSmallButton}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addSmallButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
            {medicalRecords && medicalRecords.length > 0 ? (
              <MedicalRecordsList records={medicalRecords} />
            ) : (
              <View style={styles.noDataContainer}>
                <Ionicons name="folder-open-outline" size={24} color={COLORS.warning} />
                <Text style={styles.noDataText}>No medical records available.</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Text style={styles.addButtonText}>Upload Medical Record</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </>
      )}

      {/* Admin Dashboard Section */}
      {renderAdminDashboard()}
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Last updated: {new Date().toLocaleDateString()}
        </Text>
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.helpButtonText}>Help</Text>
        </TouchableOpacity>
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
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingBottom: 20,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  profileImageContainer: {
    marginRight: 12,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  profileImageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: COLORS.cardBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.primaryLight,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  editButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
  },
  addSmallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  addSmallButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
  },
  infoContainer: {
    padding: 16,
  },
  infoItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  infoSubLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.error,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  noDataContainer: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.cardBackground,
  },
  noDataText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginVertical: 8,
  },
  addButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helpButtonText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
});