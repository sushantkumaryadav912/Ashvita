import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
  cardBackground: '#fff',
  textPrimary: '#333',
  textSecondary: '#666',
  border: '#ddd',
};

export default function ProfileInfoCard({ profile }) {
  return (
    <View style={styles.sectionContent}>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Full Name</Text>
        <Text style={styles.infoValue}>{profile.name}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Email</Text>
        <Text style={styles.infoValue}>{profile.email}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Phone</Text>
        <Text style={styles.infoValue}>{profile.phone}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Date of Birth</Text>
        <Text style={styles.infoValue}>{profile.dob}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Gender</Text>
        <Text style={styles.infoValue}>{profile.gender}</Text>
      </View>
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>Address</Text>
        <Text style={styles.infoValue}>{profile.address}</Text>
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