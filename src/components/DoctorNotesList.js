import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
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

// Base URL for the Azure backend API
const API_BASE_URL = 'https://localhost:5000/api';

export default function DoctorNotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorNotes = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_BASE_URL}/doctor-notes`);
        setNotes(response.data);
      } catch (err) {
        setError('Failed to fetch doctor notes.');
        console.error('Error fetching doctor notes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorNotes();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading doctor notes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={20} color={COLORS.error} />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notes.length > 0 ? (
        <>
          {notes.map((note) => (
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
                    <Text style={styles.doctorName}>{note.doctorName}</Text>
                    <Text style={styles.doctorSpecialty}>{note.specialty}</Text>
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                  <Text style={styles.date}>{formatDate(note.date)}</Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.noteText} numberOfLines={3}>{note.note}</Text>
              
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
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#FFEDF1',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 8,
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