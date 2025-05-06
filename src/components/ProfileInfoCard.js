import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  cardBackground: '#fff',
  textPrimary: '#333',
  textSecondary: '#666',
  border: '#ddd',
};

export default function ProfileInfoCard({ profile }) {
  const safeProfile = {
    name: typeof profile?.name === 'string' && profile.name.trim() ? profile.name : 'Not Provided',
    email: typeof profile?.email === 'string' && profile.email.trim() ? profile.email : 'Not Provided',
    phone: typeof profile?.phone === 'string' && profile.phone.trim() ? profile.phone : 'Not Provided',
    dob: typeof profile?.dob === 'string' && profile.dob.trim() ? profile.dob : 'Not Provided',
    gender: typeof profile?.gender === 'string' && profile.gender.trim() ? profile.gender : 'Not Provided',
    address: typeof profile?.address === 'string' && profile.address.trim() ? profile.address : 'Not Provided',
  };

  return (
    <View style={styles.sectionContent}>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Full Name</Text>
        <Text style={styles.infoValue}>{safeProfile.name}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{safeProfile.email}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Phone</Text>
        <Text style={styles.infoValue}>{safeProfile.phone}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Date of Birth</Text>
        <Text style={styles.infoValue}>{safeProfile.dob}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Gender</Text>
        <Text style={styles.infoValue}>{safeProfile.gender}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Address</Text>
        <Text style={styles.infoValue}>{safeProfile.address}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContent: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  infoLabel: {
    width: 100,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});