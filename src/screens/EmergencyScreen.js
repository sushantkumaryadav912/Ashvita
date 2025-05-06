import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

// Sound options
const SOUND_OPTIONS = [
  { id: '1', name: 'System Sound', uri: 'system' },
  { id: '2', name: 'Pick from Storage', uri: 'storage' },
];

const EmergencyScreen = () => {
  const [isBuzzerActive, setIsBuzzerActive] = useState(false);
  const [sound, setSound] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);
  const [soundModalVisible, setSoundModalVisible] = useState(false);

  // Load buzzer state and sound selection
  useEffect(() => {
    const loadState = async () => {
      try {
        const buzzerState = await AsyncStorage.getItem('BUZZER_STATE');
        const soundUri = await AsyncStorage.getItem('BUZZER_SOUND');
        if (buzzerState !== null) {
          const active = JSON.parse(buzzerState);
          setIsBuzzerActive(active);
          if (active && soundUri) {
            playBuzzer(soundUri);
          }
        }
        if (soundUri) {
          setSelectedSound({ uri: soundUri, name: soundUri === 'system' ? 'System Sound' : 'Custom Audio' });
        } else {
          setSelectedSound(SOUND_OPTIONS[0]); // Default to system sound
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load emergency settings');
      }
    };
    loadState();

    // Cleanup on unmount
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Play buzzer sound
  const playBuzzer = async (uri) => {
    try {
      let soundSource;
      if (uri === 'system') {
        soundSource = require('../../assets/notification.mp3'); // Ensure this file exists
      } else {
        soundSource = { uri };
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        soundSource,
        { shouldPlay: true, isLooping: true }
      );
      setSound(newSound);
      setIsBuzzerActive(true);
      await AsyncStorage.setItem('BUZZER_STATE', JSON.stringify(true));
    } catch (error) {
      Alert.alert('Error', 'Failed to play emergency alarm');
    }
  };

  // Stop buzzer sound
  const stopBuzzer = async () => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsBuzzerActive(false);
      await AsyncStorage.setItem('BUZZER_STATE', JSON.stringify(false));
    } catch (error) {
      Alert.alert('Error', 'Failed to stop emergency alarm');
    }
  };

  // Pick audio from storage
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
      });
      if (result.type === 'success') {
        const uri = result.uri;
        setSelectedSound({ uri, name: result.name || 'Custom Audio' });
        await AsyncStorage.setItem('BUZZER_SOUND', uri);
        setSoundModalVisible(false);
        if (isBuzzerActive) {
          await stopBuzzer();
          await playBuzzer(uri);
        }
      } else {
        setSoundModalVisible(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick audio file');
      setSoundModalVisible(false);
    }
  };

  // Select sound
  const selectSound = async (option) => {
    if (option.uri === 'storage') {
      await pickAudio();
    } else {
      setSelectedSound(option);
      await AsyncStorage.setItem('BUZZER_SOUND', option.uri);
      setSoundModalVisible(false);
      if (isBuzzerActive) {
        await stopBuzzer();
        await playBuzzer(option.uri);
      }
    }
  };

  // Toggle buzzer
  const toggleBuzzer = () => {
    if (!selectedSound) {
      setSoundModalVisible(true);
      return;
    }
    if (isBuzzerActive) {
      stopBuzzer();
    } else {
      playBuzzer(selectedSound.uri);
    }
  };

  // Render sound selection modal
  const renderSoundModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={soundModalVisible}
      onRequestClose={() => setSoundModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Emergency Sound</Text>
          {SOUND_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.modalOption}
              onPress={() => selectSound(option)}
            >
              <Text style={styles.modalOptionText}>{option.name}</Text>
              {selectedSound && selectedSound.uri === option.uri && (
                <Ionicons name="checkmark" size={24} color="#007bff" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalCancel}
            onPress={() => setSoundModalVisible(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#dc3545" />
      {/* Buzzer Button */}
      <TouchableOpacity
        style={[styles.buzzerButton, { backgroundColor: isBuzzerActive ? '#fff' : '#007bff' }]}
        onPress={toggleBuzzer}
      >
        <Ionicons
          name="alert-circle"
          size={60}
          color={isBuzzerActive ? '#dc3545' : '#fff'}
        />
      </TouchableOpacity>

      {/* Status Message */}
      <Text style={styles.message}>
        {isBuzzerActive ? 'Alarm is ON' : 'Alarm is OFF'}
      </Text>

      {renderSoundModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dc3545',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buzzerButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCancel: {
    marginTop: 16,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: '600',
  },
});

export default EmergencyScreen;