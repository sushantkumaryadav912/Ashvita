import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  cardBackground: '#fff',
  primary: '#4361ee',
  primaryLight: '#e9efff',
  secondary: '#3f37c9',
  textPrimary: '#333',
  textSecondary: '#666',
  border: '#e6e6e6',
  success: '#4cc9f0',
  warning: '#ffd166',
  danger: '#f72585',
  urgent: '#ffcc00',
};

export default function EmergencyContactsList({ contacts }) {
  const safeContacts = Array.isArray(contacts) ? contacts.map(contact => ({
    id: contact?.id || `contact-${Math.random().toString(36).substr(2, 9)}`,
    name: typeof contact?.name === 'string' && contact.name.trim() ? contact.name : 'Unknown Contact',
    relationship: typeof contact?.relationship === 'string' && contact.relationship.trim() ? contact.relationship : 'Not Specified',
    phone: typeof contact?.phone === 'string' && contact.phone.trim() ? contact.phone : 'Not Provided',
    email: typeof contact?.email === 'string' && contact.email.trim() ? contact.email : 'Not Provided',
    image: typeof contact?.image === 'string' && contact.image.trim() ? contact.image : null,
    isPrimary: typeof contact?.isPrimary === 'boolean' ? contact.isPrimary : false,
  })) : [];

  // Sort contacts with primary contacts first
  const sortedContacts = [...safeContacts].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  const handleCall = (contact) => {
    Alert.alert(`Call ${contact.name}`, `Would you like to call ${contact.name} at ${contact.phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', style: 'default' }
    ]);
  };

  const handleMessage = (contact) => {
    Alert.alert(`Message ${contact.name}`, `Would you like to send a message to ${contact.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Message', style: 'default' }
    ]);
  };

  const handleEdit = (contact) => {
    Alert.alert(`Edit ${contact.name}`, `Edit details for ${contact.name}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', style: 'default' }
    ]);
  };

  return (
    <View style={styles.container}>
      {sortedContacts.map((contact) => (
        <View key={contact.id} style={styles.contactItem}>
          <View style={styles.contactImageContainer}>
            {contact.image ? (
              <Image source={{ uri: contact.image }} style={styles.contactImage} />
            ) : (
              <View style={styles.contactImagePlaceholder}>
                <Text style={styles.contactImagePlaceholderText}>
                  {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </Text>
              </View>
            )}
            {contact.isPrimary && (
              <View style={styles.primaryBadge}>
                <Ionicons name="star" size={10} color="#fff" />
              </View>
            )}
          </View>
          
          <View style={styles.contactDetails}>
            <View style={styles.nameContainer}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {contact.isPrimary && (
                <View style={styles.primaryIndicator}>
                  <Text style={styles.primaryText}>Primary</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.contactRelationship}>{contact.relationship}</Text>
            
            <View style={styles.contactInfoItem}>
              <Ionicons name="call-outline" size={12} color={COLORS.textSecondary} style={styles.infoIcon} />
              <Text style={styles.contactInfo}>{contact.phone}</Text>
            </View>
            
            <View style={styles.contactInfoItem}>
              <Ionicons name="mail-outline" size={12} color={COLORS.textSecondary} style={styles.infoIcon} />
              <Text style={styles.contactInfo}>{contact.email}</Text>
            </View>
          </View>
          
          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={[styles.contactAction, styles.callAction]} 
              onPress={() => handleCall(contact)}
            >
              <Ionicons name="call" size={18} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactAction, styles.messageAction]}
              onPress={() => handleMessage(contact)}
            >
              <Ionicons name="chatbubble" size={16} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactAction, styles.editAction]}
              onPress={() => handleEdit(contact)}
            >
              <Ionicons name="create" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color={COLORS.primary} />
        <Text style={styles.addButtonText}>Add Emergency Contact</Text>
      </TouchableOpacity>
      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color={COLORS.textSecondary} style={styles.infoBoxIcon} />
        <Text style={styles.infoBoxText}>
          Emergency contacts will be contacted in order of priority in case of an emergency.
        </Text>
      </View>
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
  contactItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  contactImageContainer: {
    marginRight: 12,
    position: 'relative',
  },
  contactImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  contactImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  contactImagePlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  primaryBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.urgent,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginRight: 6,
  },
  primaryIndicator: {
    backgroundColor: COLORS.urgent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contactDetails: {
    flex: 1,
  },
  contactRelationship: {
    fontSize: 14,
    color: COLORS.primary,
    marginBottom: 6,
  },
  contactInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  contactInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  contactActions: {
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: 8,
    height: 50,
  },
  contactAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  callAction: {
    backgroundColor: COLORS.success,
  },
  messageAction: {
    backgroundColor: COLORS.primary,
  },
  editAction: {
    backgroundColor: COLORS.secondary,
  },
  addButton: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'flex-start',
  },
  infoBoxIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
}); 