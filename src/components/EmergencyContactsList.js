import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  cardBackground: '#fff',
  primary: '#007bff',
  primaryLight: '#e6f3ff',
  textPrimary: '#333',
  textSecondary: '#666',
  secondary: '#6c757d',
  border: '#ddd',
};

export default function EmergencyContactsList({ contacts }) {
  const safeContacts = Array.isArray(contacts) ? contacts.map(contact => ({
    id: contact?.id || `contact-${Math.random().toString(36).substr(2, 9)}`,
    name: typeof contact?.name === 'string' && contact.name.trim() ? contact.name : 'Unknown Contact',
    relationship: typeof contact?.relationship === 'string' && contact.relationship.trim() ? contact.relationship : 'Not Specified',
    phone: typeof contact?.phone === 'string' && contact.phone.trim() ? contact.phone : 'Not Provided',
    email: typeof contact?.email === 'string' && contact.email.trim() ? contact.email : 'Not Provided',
    image: typeof contact?.image === 'string' && contact.image.trim() ? contact.image : null,
  })) : [];

  return (
    <View style={styles.sectionContent}>
      {safeContacts.map((contact) => (
        <View key={contact.id} style={styles.contactItem}>
          <View style={styles.contactImageContainer}>
            {contact.image ? (
              <Image source={{ uri: contact.image }} style={styles.contactImage} />
            ) : (
              <View style={styles.contactImagePlaceholder}>
                <Text style={styles.contactImagePlaceholderText}>
                  {contact.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.contactDetails}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactRelationship}>{contact.relationship}</Text>
            <Text style={styles.contactInfo}>{contact.phone}</Text>
            <Text style={styles.contactInfo}>{contact.email}</Text>
          </View>
          <View style={styles.contactActions}>
            <TouchableOpacity style={styles.contactAction}>
              <Ionicons name="call" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactAction}>
              <Ionicons name="chatbubble" size={18} color={COLORS.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactAction}>
              <Ionicons name="create" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color={COLORS.primary} />
        <Text style={styles.addButtonText}>Add Emergency Contact</Text>
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
  contactItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactImageContainer: {
    marginRight: 12,
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  contactImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactImagePlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  contactRelationship: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contactActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  contactAction: {
    padding: 8,
  },
  addButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});