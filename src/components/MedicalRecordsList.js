import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Modal,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  cardBackground: '#fff',
  primary: '#4361ee',
  primaryLight: '#e9efff',
  secondary: '#3f37c9',
  accent: '#4895ef',
  textPrimary: '#333',
  textSecondary: '#666',
  border: '#e6e6e6',
  success: '#4cc9f0',
  warning: '#ffd166',
  info: '#a5c9fd',
  prescription: '#8ac926',
  labTest: '#480ca8',
  vaccination: '#fb5607',
  consultation: '#ffbe0b',
  modalBackground: 'rgba(0,0,0,0.5)',
};

// Medical record type to icon and color mapping
const RECORD_TYPES = {
  'Prescription': { icon: 'medkit', color: COLORS.prescription },
  'Lab Test': { icon: 'flask', color: COLORS.labTest },
  'Vaccination': { icon: 'fitness', color: COLORS.vaccination },
  'Consultation': { icon: 'document-text', color: COLORS.consultation },
  'Surgery': { icon: 'cut', color: COLORS.danger },
  'Radiology': { icon: 'scan', color: COLORS.info },
  'Allergy Test': { icon: 'alert-circle', color: COLORS.warning },
  'Other': { icon: 'document', color: COLORS.secondary },
};

export default function MedicalRecordsList({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const safeRecords = Array.isArray(records) ? records.map(record => ({
    id: record?.id || `record-${Math.random().toString(36).substr(2, 9)}`,
    title: typeof record?.title === 'string' && record.title.trim() ? record.title : 'Untitled Record',
    date: typeof record?.date === 'string' && record.date.trim() ? record.date : 'Unknown Date',
    provider: typeof record?.provider === 'string' && record.provider.trim() ? record.provider : 'Unknown Provider',
    type: typeof record?.type === 'string' && record.type.trim() ? record.type : 'Other',
    description: typeof record?.description === 'string' ? record.description : '',
    fileType: typeof record?.fileType === 'string' ? record.fileType : 'pdf',
    fileSize: typeof record?.fileSize === 'string' ? record.fileSize : '1.2 MB',
  })) : [];

  // Sort records by date (newest first)
  const sortedRecords = [...safeRecords].sort((a, b) => {
    try {
      return new Date(b.date) - new Date(a.date);
    } catch {
      return 0;
    }
  });

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid Date';
    }
  };

  const getRecordTypeDetails = (type) => {
    return RECORD_TYPES[type] || RECORD_TYPES['Other'];
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleDownload = (record) => {
    Alert.alert(
      'Download Record',
      `Would you like to download "${record.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', style: 'default' }
      ]
    );
  };

  const handleShare = (record) => {
    Alert.alert(
      'Share Record',
      `Share "${record.title}" with healthcare providers`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', style: 'default' }
      ]
    );
  };

  const getFileIcon = (fileType) => {
    switch(fileType.toLowerCase()) {
      case 'pdf': return 'document-text';
      case 'jpg': 
      case 'jpeg':
      case 'png': return 'image';
      case 'doc':
      case 'docx': return 'document';
      default: return 'document';
    }
  };

  return (
    <View style={styles.container}>
      {/* Records Filtering Options */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          <TouchableOpacity style={[styles.filterChip, styles.activeFilterChip]}>
            <Text style={styles.activeFilterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Prescriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Lab Tests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Vaccinations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterChip}>
            <Text style={styles.filterText}>Consultations</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Medical Records List */}
      {sortedRecords.map((record) => {
        const typeDetails = getRecordTypeDetails(record.type);
        
        return (
          <TouchableOpacity 
            key={record.id} 
            style={styles.recordItem}
            onPress={() => handleViewRecord(record)}
          >
            <View style={[styles.recordIconContainer, { backgroundColor: `${typeDetails.color}20` }]}>
              <Ionicons name={typeDetails.icon} size={20} color={typeDetails.color} />
            </View>
            
            <View style={styles.recordDetails}>
              <Text style={styles.recordTitle} numberOfLines={1}>{record.title}</Text>
              
              <View style={styles.recordMeta}>
                <Ionicons name="calendar-outline" size={12} color={COLORS.textSecondary} />
                <Text style={styles.recordDate}>{formatDate(record.date)}</Text>
                <Text style={styles.recordDivider}>•</Text>
                <Text style={styles.recordProvider} numberOfLines={1}>{record.provider}</Text>
              </View>
              
              <View style={styles.recordTypeContainer}>
                <Text style={[styles.recordType, { color: typeDetails.color }]}>{record.type}</Text>
                <View style={styles.fileInfo}>
                  <Ionicons name={getFileIcon(record.fileType)} size={12} color={COLORS.textSecondary} />
                  <Text style={styles.fileType}>{record.fileType.toUpperCase()}</Text>
                  <Text style={styles.fileSize}>{record.fileSize}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.recordActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleDownload(record)}
              >
                <Ionicons name="download-outline" size={18} color={COLORS.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleShare(record)}
              >
                <Ionicons name="share-social-outline" size={18} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        );
      })}
      
      {/* Upload New Record Button */}
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="cloud-upload" size={18} color={COLORS.primary} />
        <Text style={styles.addButtonText}>Upload New Medical Record</Text>
      </TouchableOpacity>
      
      {/* Timeline View Button */}
      <TouchableOpacity style={styles.timelineButton}>
        <Ionicons name="analytics" size={16} color={COLORS.secondary} />
        <Text style={styles.timelineButtonText}>View Health Timeline</Text>
      </TouchableOpacity>

      {/* Record Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Medical Record</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            
            {selectedRecord && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.modalRecordHeader}>
                  <View style={[
                    styles.modalRecordTypeIcon, 
                    { backgroundColor: `${getRecordTypeDetails(selectedRecord.type).color}20` }
                  ]}>
                    <Ionicons 
                      name={getRecordTypeDetails(selectedRecord.type).icon} 
                      size={24} 
                      color={getRecordTypeDetails(selectedRecord.type).color} 
                    />
                  </View>
                  <View style={styles.modalRecordInfo}>
                    <Text style={styles.modalRecordTitle}>{selectedRecord.title}</Text>
                    <Text style={styles.modalRecordType}>{selectedRecord.type}</Text>
                  </View>
                </View>
                
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>Date</Text>
                  <Text style={styles.recordDetailValue}>{formatDate(selectedRecord.date)}</Text>
                </View>
                
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>Healthcare Provider</Text>
                  <Text style={styles.recordDetailValue}>{selectedRecord.provider}</Text>
                </View>
                
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>Description</Text>
                  <Text style={styles.recordDetailValue}>
                    {selectedRecord.description || 'No description provided for this record.'}
                  </Text>
                </View>
                
                <View style={styles.recordDetailItem}>
                  <Text style={styles.recordDetailLabel}>File Info</Text>
                  <View style={styles.fileDetailInfo}>
                    <Ionicons name={getFileIcon(selectedRecord.fileType)} size={16} color={COLORS.textSecondary} />
                    <Text style={styles.fileDetailType}>{selectedRecord.fileType.toUpperCase()}</Text>
                    <Text style={styles.fileDetailSize}>{selectedRecord.fileSize}</Text>
                  </View>
                </View>
                
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.modalActionButton}>
                    <Ionicons name="download" size={18} color="#fff" />
                    <Text style={styles.modalActionText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.modalActionButton, styles.shareButton]}>
                    <Ionicons name="share-social" size={18} color="#fff" />
                    <Text style={styles.modalActionText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </SafeAreaView>
        </View>
      </Modal>
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
  filterContainer: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#f0f2f5',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
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
    borderRadius: 10,
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
    marginRight: 4,
  },
  recordDivider: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 4,
  },
  recordProvider: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
  },
  recordTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordType: {
    fontSize: 12,
    fontWeight: '500',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileType: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 4,
    marginRight: 4,
  },
  fileSize: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  recordActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
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
  timelineButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
  },
  timelineButtonText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalBackground,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  modalRecordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalRecordTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalRecordInfo: {
    flex: 1,
  },
  modalRecordTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  modalRecordType: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  recordDetailItem: {
    marginBottom: 16,
  },
  recordDetailLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  recordDetailValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    lineHeight: 20,
  },
  fileDetailInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileDetailType: {
    fontSize: 14,
    color: COLORS.textPrimary,
    marginLeft: 8,
    marginRight: 8,
  },
  fileDetailSize: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 16,
  },
  modalActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  shareButton: {
    backgroundColor: COLORS.secondary,
    marginRight: 0,
    marginLeft: 8,
  },
  modalActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});