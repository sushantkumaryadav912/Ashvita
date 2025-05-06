import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#007bff',
  textPrimary: '#333',
  textSecondary: '#666',
  cardBackground: '#fff',
  primaryLight: '#e6f3ff',
  error: '#ff4d4d',
};

// Base URL for the Azure backend API (replace with your actual API URL)
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
        setError('Failed to fetch doctor notes. Please try again later.');
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
        <Text style={styles.loadingText}>Loading doctor notes...</Text>
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
    <View style={styles.container}>
      {notes.length > 0 ? (
        <>
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
        </>
      ) : (
        <Text style={styles.noDataText}>No doctor notes available.</Text>
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
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: COLORS.error,
    textAlign: 'center',
  },
  noDataText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});