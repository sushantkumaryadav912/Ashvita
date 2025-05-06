import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  cardBackground: '#fff',
  primary: '#007bff',
  primaryLight: '#e6f3ff',
  textPrimary: '#333',
  textSecondary: '#666',
  border: '#ddd',
};

export default function MedicalRecordsList({ records }) {
  const safeRecords = Array.isArray(records) ? records.map(record => ({
    id: record?.id || `record-${Math.random().toString(36).substr(2, 9)}`,
    title: typeof record?.title === 'string' && record.title.trim() ? record.title : 'Untitled Record',
    date: typeof record?.date === 'string' && record.date.trim() ? record.date : 'Unknown Date',
    provider: typeof record?.provider === 'string' && record.provider.trim() ? record.provider : 'Unknown Provider',
    type: typeof record?.type === 'string' && record.type.trim() ? record.type : 'Unknown Type',
  })) : [];

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <View style={styles.sectionContent}>
      {safeRecords.map((record) => (
        <View key={record.id} style={styles.recordItem}>
          <View style={styles.recordIconContainer}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
          </View>
          <View style={styles.recordDetails}>
            <Text style={styles.recordTitle}>{record.title}</Text>
            <View style={styles.recordMeta}>
              <Ionicons name="calendar" size={12} color={COLORS.textSecondary} />
              <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
              <Text style={styles.recordProvider}>{record.provider}</Text>
            </View>
            <Text style={styles.recordType}>{record.type}</Text>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Upload New Record</Text>
      </TouchableOpacity>
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
  recordItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  recordIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordDetails: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  recordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    marginRight: 8,
  },
  recordProvider: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  recordType: {
    fontSize: 12,
    color: COLORS.primary,
  },
  downloadButton: {
    padding: 8,
  },
  addButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});