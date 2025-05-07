import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#4361EE',
  textPrimary: '#2B2D42',
  textSecondary: '#8D99AE',
  cardBackground: '#FFFFFF',
  primaryLight: '#EBF0FF',
  border: '#E9ECEF',
  error: '#EF476F',
};

export default function DoctorNotesList({ notes }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : 'N/A';
  };

  // Ensure notes is an array
  const notesArray = Array.isArray(notes) ? notes : [];

  return (
    <View style={styles.container}>
      {notesArray.length > 0 ? (
        <>
          {notesArray.map((note) => (
            <TouchableOpacity 
              key={note.id} 
              style={styles.noteCard}
              activeOpacity={0.8}
            >
              <View style={styles.noteHeader}>
                <View style={styles.doctorInfo}>
                  <View style={styles.avatarContainer}>
                    <Ionicons name="person" size={18} color={COLORS.primary} />
                  </View>
                  <View>
                    <Text style={styles.doctorName}>{note.doctor || 'Unknown Doctor'}</Text>
                    <Text style={styles.doctorSpecialty}>{note.specialty || 'General'}</Text>
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.date}>{formatDate(note.date)}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.noteText} numberOfLines={3}>{note.note || 'No note available'}</Text>
              
              <TouchableOpacity style={styles.viewMoreButton}>
                <Text style={styles.viewMoreText}>View Full Note</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.allNotesButton}>
            <Text style={styles.allNotesText}>View All Notes</Text>
            <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="documents-outline" size={24} color={COLORS.textSecondary} />
          <Text style={styles.noDataText}>No doctor notes available.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 12,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 12,
    lineHeight: 20,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  allNotesButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  allNotesText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginRight: 4,
  },
  noDataContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
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