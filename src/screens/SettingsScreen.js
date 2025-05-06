import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Platform,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Translations
const translations = {
  en: {
    settings: 'Settings',
    notifications: 'Notifications',
    privacy: 'Privacy',
    language: 'Language',
    backup: 'Backup',
    about: 'About',
    resetSettings: 'Reset Settings',
    resetConfirm: 'Are you sure you want to reset all settings?',
    cancel: 'Cancel',
    settingsSaved: 'Settings saved successfully',
    settingsError: 'Failed to save settings',
    english: 'English',
    spanish: 'Español',
  },
  es: {
    settings: 'Configuración',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    language: 'Idioma',
    backup: 'Copia de Seguridad',
    about: 'Acerca de',
    resetSettings: 'Restablecer Configuraciones',
    resetConfirm: '¿Estás seguro de querer restablecer todas las configuraciones?',
    cancel: 'Cancelar',
    settingsSaved: 'Configuraciones guardadas exitosamente',
    settingsError: 'No se pudieron guardar las configuraciones',
    english: 'Inglés',
    spanish: 'Español',
  },
};

// Settings configuration
const SETTING_ITEMS = [
  { id: '1', icon: 'notifications-outline', title: 'notifications', hasSwitch: true },
  { id: '2', icon: 'lock-closed-outline', title: 'privacy', hasSwitch: false },
  { id: '3', icon: 'language-outline', title: 'language', hasSwitch: false },
  { id: '4', icon: 'cloud-outline', title: 'backup', hasSwitch: true },
  { id: '5', icon: 'information-circle-outline', title: 'about', hasSwitch: false },
];

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en',
    backup: false,
  });
  const [selectModal, setSelectModal] = useState(null);
  const t = translations[settings.language] || translations.en;

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem('APP_SETTINGS');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings(parsed);
        }
      } catch (error) {
        Alert.alert(t.settingsError, t.settingsError);
      }
    };
    loadSettings();
  }, [t]);

  // Save settings
  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('APP_SETTINGS', JSON.stringify(newSettings));
      setSettings(newSettings);
      Alert.alert(t.settingsSaved, t.settingsSaved);
    } catch (error) {
      Alert.alert(t.settingsError, t.settingsError);
    }
  };

  // Handle setting toggle
  const handleToggle = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  // Reset settings
  const resetSettings = () => {
    Alert.alert(
      t.resetSettings,
      t.resetConfirm,
      [
        { text: t.cancel, style: 'cancel' },
        {
          text: t.resetSettings,
          style: 'destructive',
          onPress: () => {
            const defaultSettings = {
              notifications: true,
              language: 'en',
              backup: false,
            };
            saveSettings(defaultSettings);
          },
        },
      ]
    );
  };

  // Render language select modal
  const renderSelectModal = () => {
    if (!selectModal) return null;
    const options = ['en', 'es'];
    const optionLabels = [t.english, t.spanish];

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={!!selectModal}
        onRequestClose={() => setSelectModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={styles.modalOption}
                onPress={() => {
                  handleToggle(selectModal.title, option);
                  setSelectModal(null);
                }}
              >
                <Text style={styles.modalOptionText}>{optionLabels[index]}</Text>
                {settings[selectModal.title] === option && (
                  <Ionicons name="checkmark" size={24} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setSelectModal(null)}
            >
              <Text style={styles.modalCancelText}>{t.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.settings}</Text>
      </View>

      {/* Settings List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsContainer}>
          {SETTING_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.settingItem}
              onPress={() => {
                if (item.id === '2') navigation.navigate('Privacy');
                else if (item.id === '5') navigation.navigate('About');
                else if (item.hasSwitch) handleToggle(item.title, !settings[item.title]);
                else setSelectModal(item);
              }}
            >
              <View style={styles.settingItemContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={24} color="#007AFF" />
                </View>
                <Text style={styles.settingItemTitle}>{t[item.title]}</Text>
              </View>
              {item.hasSwitch ? (
                <Switch
                  trackColor={{ false: '#ccc', true: '#007AFF' }}
                  thumbColor={Platform.OS === 'ios' ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#ccc"
                  value={settings[item.title]}
                  onValueChange={(value) => handleToggle(item.title, value)}
                />
              ) : (
                <Ionicons name="chevron-forward" size={24} color="#666" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Reset Button */}
      <View style={styles.resetButton}>
        <TouchableOpacity onPress={resetSettings} style={styles.resetButtonInner}>
          <Ionicons name="refresh" size={24} color="#fff" />
          <Text style={styles.resetButtonText}>{t.resetSettings}</Text>
        </TouchableOpacity>
      </View>

      {renderSelectModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  settingsContainer: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  resetButton: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resetButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#007AFF',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SettingsScreen;