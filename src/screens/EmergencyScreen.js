import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Modal,
  Alert,
  SafeAreaView,
  Dimensions,
  Vibration,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Sound options
const SOUND_OPTIONS = [
  { id: '1', name: 'Siren', uri: 'system' },
  { id: '2', name: 'Alarm Bell', uri: 'alarm' },
  { id: '3', name: 'Pick from Storage', uri: 'storage' },
];

const EmergencyScreen = () => {
  const [isBuzzerActive, setIsBuzzerActive] = useState(false);
  const [sound, setSound] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);
  const [soundModalVisible, setSoundModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const pulseAnim = useState(new Animated.Value(1))[0];

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
            startPulseAnimation();
          }
        }
        if (soundUri) {
          const soundName = soundUri === 'system' ? 'Siren' : 
                           soundUri === 'alarm' ? 'Alarm Bell' : 'Custom Audio';
          setSelectedSound({ uri: soundUri, name: soundName });
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

  // Pulse animation
  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.setValue(1);
    Animated.timing(pulseAnim).stop();
  };

  // Play buzzer sound
  const playBuzzer = async (uri) => {
    try {
      let soundSource;
      if (uri === 'system') {
        soundSource = require('../../assets/notification.mp3'); // Ensure this file exists
      } else if (uri === 'alarm') {
        soundSource = require('../../assets/alarm.mp3'); // Ensure this file exists
      } else {
        soundSource = { uri };
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        soundSource,
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setSound(newSound);
      setIsBuzzerActive(true);
      await AsyncStorage.setItem('BUZZER_STATE', JSON.stringify(true));
      
      // Enhanced intense vibration pattern
      // Format: [wait, vibrate, wait, vibrate, ...] in milliseconds
      // This creates an SOS-like pattern that's more noticeable
      Vibration.vibrate([
        100, 300, 100, 300, 100, 300,  // Three short vibrations (S)
        200, 500, 200, 500, 200, 500,  // Three long vibrations (O)
        100, 300, 100, 300, 100, 300,  // Three short vibrations (S)
        1000                           // Pause before repeating
      ], true);
      
      // Start pulse animation
      startPulseAnimation();
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
      
      // Stop vibration
      Vibration.cancel();
      
      // Stop pulse animation
      stopPulseAnimation();
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
      animationType="slide"
      transparent={true}
      visible={soundModalVisible}
      onRequestClose={() => setSoundModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Emergency Sound</Text>
            <TouchableOpacity onPress={() => setSoundModalVisible(false)}>
              <Ionicons name="close-circle" size={24} color="#777" />
            </TouchableOpacity>
          </View>
          
          {SOUND_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.modalOption,
                selectedSound && selectedSound.uri === option.uri ? styles.selectedOption : null
              ]}
              onPress={() => selectSound(option)}
            >
              <View style={styles.optionContent}>
                <Ionicons 
                  name={option.uri === 'storage' ? 'folder-open' : 'volume-high'} 
                  size={24} 
                  color={selectedSound && selectedSound.uri === option.uri ? "#fff" : "#555"} 
                />
                <Text style={[
                  styles.modalOptionText,
                  selectedSound && selectedSound.uri === option.uri ? {color: '#fff'} : null
                ]}>
                  {option.name}
                </Text>
              </View>
              {selectedSound && selectedSound.uri === option.uri && (
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  // Render settings modal
  const renderSettingsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={settingsModalVisible}
      onRequestClose={() => setSettingsModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Emergency Settings</Text>
            <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
              <Ionicons name="close-circle" size={24} color="#777" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.settingsOption}
            onPress={() => {
              setSettingsModalVisible(false);
              setSoundModalVisible(true);
            }}
          >
            <Ionicons name="musical-note" size={24} color="#555" />
            <View style={styles.settingsTextContainer}>
              <Text style={styles.settingsOptionTitle}>Emergency Sound</Text>
              <Text style={styles.settingsOptionSubtitle}>
                {selectedSound ? selectedSound.name : 'Select a sound'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsOption}>
            <Ionicons name="call" size={24} color="#555" />
            <View style={styles.settingsTextContainer}>
              <Text style={styles.settingsOptionTitle}>Emergency Contacts</Text>
              <Text style={styles.settingsOptionSubtitle}>
                Set up auto-call contacts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsOption}>
            <Ionicons name="location" size={24} color="#555" />
            <View style={styles.settingsTextContainer}>
              <Text style={styles.settingsOptionTitle}>Location Sharing</Text>
              <Text style={styles.settingsOptionSubtitle}>
                Share location during emergency
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={isBuzzerActive ? ['#e72c32', '#991016'] : ['#0a4da0', '#0a387a']}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" backgroundColor={isBuzzerActive ? "#c41a1f" : "#0a4da0"} />
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Emergency Alert</Text>
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
            <Ionicons name="settings-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusIndicator}>
            <View 
              style={[
                styles.statusDot, 
                {backgroundColor: isBuzzerActive ? '#4ADE80' : '#6B7280'}
              ]} 
            />
            <Text style={styles.statusText}>
              {isBuzzerActive ? 'ACTIVE' : 'STANDBY'}
            </Text>
          </View>
          <Text style={styles.soundName}>
            {selectedSound ? selectedSound.name : 'No sound selected'}
          </Text>
        </View>
        
        {/* Main Content */}
        <View style={styles.content}>
          {/* Buzzer Button */}
          <Animated.View style={[
            styles.buzzerContainer,
            { transform: [{ scale: isBuzzerActive ? pulseAnim : 1 }] }
          ]}>
            <TouchableOpacity
              style={[
                styles.buzzerButton, 
                { backgroundColor: isBuzzerActive ? '#fff' : '#fff' }
              ]}
              onPress={toggleBuzzer}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isBuzzerActive ? "alert" : "alert-outline"}
                size={80}
                color={isBuzzerActive ? '#e72c32' : '#0a4da0'}
              />
            </TouchableOpacity>
          </Animated.View>

          {/* Status Message */}
          <Text style={styles.message}>
            {isBuzzerActive ? 'Emergency Alert Active' : 'Press Button to Activate Alert'}
          </Text>
          
          {/* Instructions */}
          <Text style={styles.instructions}>
            {isBuzzerActive 
              ? 'Tap the button again to deactivate' 
              : 'In case of emergency, tap the button above'}
          </Text>
        </View>
        
        {/* Info Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="call" size={22} color="#fff" />
            <Text style={styles.footerButtonText}>Call Help</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.footerButton}
            onPress={() => setSoundModalVisible(true)}
          >
            <Ionicons name="musical-note" size={22} color="#fff" />
            <Text style={styles.footerButtonText}>Sounds</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.footerButton}>
            <Ionicons name="information-circle" size={22} color="#fff" />
            <Text style={styles.footerButtonText}>Help</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      {renderSoundModal()}
      {renderSettingsModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBar: {
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  soundName: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buzzerContainer: {
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  buzzerButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 8,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  message: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  instructions: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  footer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    marginTop: 6,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#0a4da0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  settingsOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  settingsOptionTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  settingsOptionSubtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
});

export default EmergencyScreen;
