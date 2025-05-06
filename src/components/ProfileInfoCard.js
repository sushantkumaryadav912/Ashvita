import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  cardBackground: '#fff',
  primary: '#4361ee',
  primaryLight: '#e9efff',
  textPrimary: '#333',
  textSecondary: '#666',
  textMuted: '#999',
  border: '#e6e6e6',
  success: '#4cc9f0',
  iconBg: '#f0f3ff',
};

export default function ProfileInfoCard({ profile }) {
  const safeProfile = {
    name: typeof profile?.name === 'string' && profile.name.trim() ? profile.name : 'Not Provided',
    email: typeof profile?.email === 'string' && profile.email.trim() ? profile.email : 'Not Provided',
    phone: typeof profile?.phone === 'string' && profile.phone.trim() ? profile.phone : 'Not Provided',
    dob: typeof profile?.dob === 'string' && profile.dob.trim() ? profile.dob : 'Not Provided',
    gender: typeof profile?.gender === 'string' && profile.gender.trim() ? profile.gender : 'Not Provided',
    address: typeof profile?.address === 'string' && profile.address.trim() ? profile.address : 'Not Provided',
    bloodType: typeof profile?.bloodType === 'string' && profile.bloodType.trim() ? profile.bloodType : 'Not Provided',
    height: typeof profile?.height === 'string' && profile.height.trim() ? profile.height : 'Not Provided',
    weight: typeof profile?.weight === 'string' && profile.weight.trim() ? profile.weight : 'Not Provided',
    allergies: Array.isArray(profile?.allergies) ? profile.allergies.join(', ') : 'None Specified',
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.container}>
      {/* Personal Information Section */}
      <View style={styles.sectionGroup}>
        <Text style={styles.sectionGroupTitle}>Personal Information</Text>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="person" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{safeProfile.name}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{safeProfile.email}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="call" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{safeProfile.phone}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="calendar" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>{safeProfile.dob !== 'Not Provided' ? formatDate(safeProfile.dob) : safeProfile.dob}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="transgender" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{safeProfile.gender}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Medical Information Section */}
      <View style={styles.sectionGroup}>
        <Text style={styles.sectionGroupTitle}>Medical Information</Text>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="water" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Blood Type</Text>
          <Text style={styles.infoValue}>{safeProfile.bloodType}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="resize" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Height</Text>
          <Text style={styles.infoValue}>{safeProfile.height}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="fitness" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Weight</Text>
          <Text style={styles.infoValue}>{safeProfile.weight}</Text>
        </View>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="alert-circle" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoLabel}>Allergies</Text>
          <Text style={styles.infoValue}>{safeProfile.allergies}</Text>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />
      
      {/* Address Section */}
      <View style={styles.sectionGroup}>
        <Text style={styles.sectionGroupTitle}>Address</Text>
        
        <View style={styles.infoItem}>
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.infoValue} numberOfLines={3}>{safeProfile.address}</Text>
        </View>
      </View>

      {/* View Full Profile Button */}
      <TouchableOpacity style={styles.viewFullButton}>
        <Text style={styles.viewFullButtonText}>View Complete Health Profile</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  sectionGroup: {
    marginBottom: 16,
  },
  sectionGroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
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
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 8,
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  viewFullButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginRight: 4,
  },
});