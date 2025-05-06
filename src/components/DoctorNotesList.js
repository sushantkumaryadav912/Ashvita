import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#007bff',
  textPrimary: '#333',
  textSecondary: '#666',
  cardBackground: '#fff',
  primaryLight: '#e6f3ff',
};

export default function DoctorNotesList() {
  const notes = [
    {
      id: '1',
      doctorName: 'Dr. Sarah Johnson',
      date: '2023-05-10',
      note: 'Patient is responding well to the new medication. Blood pressure is stabilizing.',
      specialty: 'Cardiologist',
    },
    {
      id: '2',
      doctorName: 'Dr. Michael Chen',
      date: '2023-04-28',
      note: 'Recommended physical therapy sessions twice a week for lower back pain.',
      specialty: 'Orthopedic',
    },
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      {notes.map((note) => (
        <TouchableOpacity key={note.id} style={styles.noteCard}>
          <View style={styles.noteHeader}>
            <View style={styles.doctorInfo}>
              <Ionicons name="person" size={16} color={COLORS.primary} />
              <Text style={styles.doctorName}>{note.doctorName}</Text>
              <Text style={styles.doctorSpecialty}> - {note.specialty}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={14} color={COLORS.textSecondary} />
              <Text style={styles.date}>{formatDate(note.date)}</Text>
            </View>
          </View>
          <Text style={styles.noteText}>{note.note}</Text>
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={styles.viewMoreText}>View Full Note</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.allNotesButton}>
        <Text style={styles.allNotesText}>View All Notes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  doctorName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginLeft: 8,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: COLORS.primary,
  },
  allNotesButton: {
    padding: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  allNotesText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});