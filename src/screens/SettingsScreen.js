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
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from '../services/authService'; // Import signOut

const { width } = Dimensions.get('window');

// Translations
const translations = {
  en: {
    settings: 'Settings',
    notifications: 'Notifications',
    privacy: 'Privacy',
    language: 'Language',
    backup: 'Backup & Sync',
    theme: 'Theme',
    about: 'About',
    account: 'Account',
    resetSettings: 'Reset Settings',
    logout: 'Logout', // Added translation for logout
    resetConfirm: 'Are you sure you want to reset all settings?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    settingsSaved: 'Settings saved successfully',
    settingsError: 'Failed to save settings',
    logoutError: 'Failed to log out', // Added translation for logout error
    english: 'English',
    spanish: 'Español',
    hindi: 'हिन्दी',
    light: 'Light',
    dark: 'Dark',
    system: 'System Default',
    notificationSubtitle: 'Control push notifications and alerts',
    privacySubtitle: 'Manage security and data sharing',
    languageSubtitle: 'Change application language',
    backupSubtitle: 'Backup and restore your data',
    themeSubtitle: 'Choose your display theme',
    aboutSubtitle: 'App version and information',
    accountSubtitle: 'Manage your profile settings',
    logoutSubtitle: 'Sign out of your account', // Added subtitle for logout
    currentLanguage: 'Current language:',
    currentTheme: 'Current theme:',
    select: 'Select',
  },
  es: {
    settings: 'Configuración',
    notifications: 'Notificaciones',
    privacy: 'Privacidad',
    language: 'Idioma',
    backup: 'Copia de Seguridad',
    theme: 'Tema',
    about: 'Acerca de',
    account: 'Cuenta',
    resetSettings: 'Restablecer Configuraciones',
    logout: 'Cerrar Sesión', // Added translation for logout
    resetConfirm: '¿Estás seguro de querer restablecer todas las configuraciones?',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    settingsSaved: 'Configuraciones guardadas exitosamente',
    settingsError: 'No se pudieron guardar las configuraciones',
    logoutError: 'No se pudo cerrar sesión', // Added translation for logout error
    english: 'Inglés',
    spanish: 'Español',
    hindi: 'Hindi',
    light: 'Claro',
    dark: 'Oscuro',
    system: 'Predeterminado del sistema',
    notificationSubtitle: 'Controlar notificaciones y alertas',
    privacySubtitle: 'Administrar seguridad y compartición de datos',
    languageSubtitle: 'Cambiar idioma de la aplicación',
    backupSubtitle: 'Respaldar y restaurar tus datos',
    themeSubtitle: 'Elegir tema de visualización',
    aboutSubtitle: 'Versión e información de la aplicación',
    accountSubtitle: 'Administrar configuraciones de perfil',
    logoutSubtitle: 'Cerrar sesión de tu cuenta', // Added subtitle for logout
    currentLanguage: 'Idioma actual:',
    currentTheme: 'Tema actual:',
    select: 'Seleccionar',
  },
  hi: {
    settings: 'सेटिंग्स',
    notifications: 'सूचनाएँ',
    privacy: 'गोपनीयता',
    language: 'भाषा',
    backup: 'बैकअप और सिंक',
    theme: 'थीम',
    about: 'ऐप के बारे में',
    account: 'खाता',
    resetSettings: 'सेटिंग्स रीसेट करें',
    logout: 'लॉगआउट', // Added translation for logout
    resetConfirm: 'क्या आप वाकई सभी सेटिंग्स रीसेट करना चाहते हैं?',
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
    settingsSaved: 'सेटिंग्स सफलतापूर्वक सहेजी गईं',
    settingsError: 'सेटिंग्स सहेजने में विफल',
    logoutError: 'लॉगआउट करने में विफल', // Added translation for logout error
    english: 'अंग्रेज़ी',
    spanish: 'स्पैनिश',
    hindi: 'हिन्दी',
    light: 'हल्का',
    dark: 'गहरा',
    system: 'सिस्टम डिफ़ॉल्ट',
    notificationSubtitle: 'पुश नोटिफिकेशन और अलर्ट नियंत्रित करें',
    privacySubtitle: 'सुरक्षा और डेटा शेयरिंग प्रबंधित करें',
    languageSubtitle: 'एप्लिकेशन भाषा बदलें',
    backupSubtitle: 'अपना डेटा बैकअप और रिस्टोर करें',
    themeSubtitle: 'अपना डिस्प्ले थीम चुनें',
    aboutSubtitle: 'ऐप वर्जन और जानकारी',
    accountSubtitle: 'अपनी प्रोफ़ाइल सेटिंग्स प्रबंधित करें',
    logoutSubtitle: 'अपने खाते से साइन आउट करें', // Added subtitle for logout
    currentLanguage: 'वर्तमान भाषा:',
    currentTheme: 'वर्तमान थीम:',
    select: 'चुनें',
  }
};

// Settings configuration
const SETTING_ITEMS = [
  { 
    id: '1', 
    icon: 'notifications-outline', 
    title: 'notifications', 
    hasSwitch: true,
    subtitleKey: 'notificationSubtitle',
    iconBgColor: '#4361EE',
    iconColor: '#fff'
  },
  { 
    id: '2', 
    icon: 'lock-closed-outline', 
    title: 'privacy', 
    hasSwitch: 'false',
    subtitleKey: 'privacySubtitle',
    iconBgColor: '#3A0CA3',
    iconColor: '#fff'
  },
  { 
    id: '7', 
    icon: 'person-outline', 
    title: 'account', 
    hasSwitch: false,
    subtitleKey: 'accountSubtitle',
    iconBgColor: '#F72585',
    iconColor: '#fff'
  },
  { 
    id: '3', 
    icon: 'language-outline', 
    title: 'language', 
    hasSwitch: false, 
    subtitleKey: 'languageSubtitle',
    iconBgColor: '#4CC9F0',
    iconColor: '#fff'
  },
  { 
    id: '4', 
    icon: 'cloud-outline', 
    title: 'backup', 
    hasSwitch: true,
    subtitleKey: 'backupSubtitle',
    iconBgColor: '#4895EF',
    iconColor: '#fff'
  },
  { 
    id: '6', 
    icon: 'contrast-outline', 
    title: 'theme', 
    hasSwitch: false,
    subtitleKey: 'themeSubtitle',
    iconBgColor: '#560BAD',
    iconColor: '#fff'
  },
  { 
    id: '5', 
    icon: 'information-circle-outline', 
    title: 'about', 
    hasSwitch: false,
    subtitleKey: 'aboutSubtitle',
    iconBgColor: '#7209B7',
    iconColor: '#fff'
  },
  { 
    id: '8', // New item for logout
    icon: 'log-out-outline', 
    title: 'logout', 
    hasSwitch: false,
    subtitleKey: 'logoutSubtitle',
    iconBgColor: '#FF5A5F',
    iconColor: '#fff'
  },
];

const SettingsScreen = ({ navigation }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    language: 'en',
    backup: false,
    theme: 'light',
  });
  const [selectModal, setSelectModal] = useState(null);
  const [isResetModalVisible, setIsResetModalVisible] = useState(false);
  const t = translations[settings.language] || translations.en;
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

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
        console.error('Failed to load settings', error);
      }
    };
    loadSettings();
  }, []);

  // Save settings
  const saveSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('APP_SETTINGS', JSON.stringify(newSettings));
      setSettings(newSettings);
      showSuccessToast();
    } catch (error) {
      Alert.alert(t.settingsError, error.message);
    }
  };

  // Show success toast
  const showSuccessToast = () => {
    Alert.alert(t.settingsSaved);
  };

  // Handle setting toggle
  const handleToggle = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(); // Call the signOut function from authService
      navigation.replace('Login'); // Navigate to Login screen
    } catch (error) {
      Alert.alert(t.logoutError, error.message);
    }
  };

  // Reset settings
  const resetSettings = () => {
    setIsResetModalVisible(true);
  };

  const confirmReset = () => {
    const defaultSettings = {
      notifications: true,
      language: 'en',
      backup: false,
      theme: 'light',
    };
    saveSettings(defaultSettings);
    setIsResetModalVisible(false);
  };

  // Get subtitle based on setting item
  const getSettingSubtitle = (item) => {
    if (item.title === 'language') {
      const languageMap = {
        en: t.english,
        es: t.spanish,
        hi: t.hindi
      };
      return `${t.currentLanguage} ${languageMap[settings.language]}`;
    }
    
    if (item.title === 'theme') {
      const themeMap = {
        light: t.light,
        dark: t.dark,
        system: t.system
      };
      return `${t.currentTheme} ${themeMap[settings.theme]}`;
    }
    
    return t[item.subtitleKey];
  };

  // Render reset confirmation modal
  const renderResetModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isResetModalVisible}
        onRequestClose={() => setIsResetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resetModalContent}>
            <View style={styles.resetModalHeader}>
              <Ionicons name="alert-circle" size={50} color="#FF5A5F" />
              <Text style={styles.resetModalTitle}>{t.resetSettings}</Text>
            </View>
            <Text style={styles.resetModalMessage}>{t.resetConfirm}</Text>
            
            <View style={styles.resetModalButtons}>
              <TouchableOpacity 
                style={[styles.resetModalButton, styles.cancelButton]}
                onPress={() => setIsResetModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t.cancel}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.resetModalButton, styles.confirmButton]}
                onPress={confirmReset}
              >
                <Text style={styles.confirmButtonText}>{t.confirm}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Render language/theme select modal
  const renderSelectModal = () => {
    if (!selectModal) return null;
    
    let options, optionLabels;
    
    if (selectModal.title === 'language') {
      options = ['en', 'es', 'hi'];
      optionLabels = [t.english, t.spanish, t.hindi];
    } else if (selectModal.title === 'theme') {
      options = ['light', 'dark', 'system'];
      optionLabels = [t.light, t.dark, t.system];
    } else {
      return null;
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectModal}
        onRequestClose={() => setSelectModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.selectModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t[selectModal.title]}</Text>
              <TouchableOpacity onPress={() => setSelectModal(null)}>
                <Ionicons name="close-circle" size={28} color="#999" />
              </TouchableOpacity>
            </View>
            
            {options.map((option, index) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.modalOption,
                  settings[selectModal.title] === option && styles.selectedOption
                ]}
                onPress={() => {
                  handleToggle(selectModal.title, option);
                  setSelectModal(null);
                }}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionIconContainer,
                    {backgroundColor: selectModal.iconBgColor + '20'}
                  ]}>
                    <Ionicons 
                      name={selectModal.title === 'language' ? 'globe-outline' : 'color-palette-outline'} 
                      size={20} 
                      color={selectModal.iconBgColor} 
                    />
                  </View>
                  <Text style={[
                    styles.modalOptionText,
                    settings[selectModal.title] === option && styles.selectedOptionText
                  ]}>
                    {optionLabels[index]}
                  </Text>
                </View>
                
                {settings[selectModal.title] === option && (
                  <Ionicons name="checkmark-circle" size={24} color="#4361EE" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  // User avatar icon component
  const UserAvatar = () => {
    const isDarkMode = settings.theme === 'dark';
    const backgroundColor = isDarkMode ? '#333' : '#E1E5F2';
    const textColor = isDarkMode ? '#FFF' : '#4361EE';
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Account')}>
        <View style={[styles.userAvatarContainer, { backgroundColor }]}>
          <Ionicons name="person" size={22} color={textColor} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[
      styles.container,
      {backgroundColor: settings.theme === 'dark' ? '#121212' : '#F8F9FA'}
    ]}>
      <StatusBar 
        barStyle={settings.theme === 'dark' ? "light-content" : "dark-content"} 
        backgroundColor={settings.theme === 'dark' ? '#121212' : '#F8F9FA'} 
      />
      
      {/* Header */}
      <LinearGradient
        colors={settings.theme === 'dark' ? ['#121212', '#121212'] : ['#F8F9FA', '#F1F3F5']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTitleContainer}>
            <Text style={[
              styles.headerTitle,
              {color: settings.theme === 'dark' ? '#FFF' : '#333'}
            ]}>
              {t.settings}
            </Text>
          </View>
          {/* Using the custom UserAvatar component instead of Image */}
          <UserAvatar />
        </View>
      </LinearGradient>

      {/* Settings List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View 
          style={[
            styles.settingsContainer, 
            {opacity: fadeAnim, transform: [{translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}]}
          ]}
        >
          {SETTING_ITEMS.map((item, index) => (
            <Animated.View 
              key={item.id}
              style={{
                opacity: fadeAnim, 
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20 * (index + 1), 0]
                  })
                }]
              }}
            >
              <TouchableOpacity
                style={[
                  styles.settingItem,
                  {
                    backgroundColor: settings.theme === 'dark' ? '#1E1E1E' : '#FFF',
                    borderColor: settings.theme === 'dark' ? '#333' : '#EEE',
                  }
                ]}
                onPress={() => {
                  if (item.id === '2') navigation.navigate('Privacy');
                  else if (item.id === '5') navigation.navigate('About');
                  else if (item.id === '7') navigation.navigate('Account');
                  else if (item.id === '8') handleLogout(); // Handle logout
                  else if (item.hasSwitch) handleToggle(item.title, !settings[item.title]);
                  else setSelectModal(item);
                }}
              >
                <View style={styles.settingItemContent}>
                  <View style={[styles.iconContainer, {backgroundColor: item.iconBgColor}]}>
                    <Ionicons name={item.icon} size={22} color={item.iconColor} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[
                      styles.settingItemTitle,
                      {color: settings.theme === 'dark' ? '#FFF' : '#333'}
                    ]}>
                      {t[item.title]}
                    </Text>
                    <Text style={[
                      styles.settingItemSubtitle,
                      {color: settings.theme === 'dark' ? '#AAA' : '#777'}
                    ]}>
                      {getSettingSubtitle(item)}
                    </Text>
                  </View>
                </View>
                
                {item.hasSwitch ? (
                  <Switch
                    trackColor={{ false: '#ccc', true: '#4361EE80' }}
                    thumbColor={settings[item.title] ? '#4361EE' : Platform.OS === 'ios' ? '#fff' : '#f4f3f4'}
                    ios_backgroundColor="#ccc"
                    value={settings[item.title]}
                    onValueChange={(value) => handleToggle(item.title, value)}
                    style={styles.switch}
                  />
                ) : (
                  <View style={styles.rightActionContainer}>
                    {(item.title === 'language' || item.title === 'theme') && (
                      <Text style={[
                        styles.valueText,
                        {color: settings.theme === 'dark' ? '#AAA' : '#777'}
                      ]}>
                        {item.title === 'language' ? 
                          (settings.language === 'en' ? 'EN' : 
                           settings.language === 'es' ? 'ES' : 'HI') : 
                          (settings.theme === 'light' ? t.light : 
                           settings.theme === 'dark' ? t.dark : t.system)}
                      </Text>
                    )}
                    <Ionicons 
                      name="chevron-forward" 
                      size={22} 
                      color={settings.theme === 'dark' ? '#AAA' : '#777'} 
                    />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Reset Button */}
      <View style={styles.resetButtonContainer}>
        <TouchableOpacity 
          onPress={resetSettings} 
          style={[
            styles.resetButtonInner,
            {backgroundColor: settings.theme === 'dark' ? '#FF5A5F' : '#FF5A5F'}
          ]}
        >
          <Ionicons name="refresh" size={22} color="#fff" />
          <Text style={styles.resetButtonText}>{t.resetSettings}</Text>
        </TouchableOpacity>
      </View>

      {renderSelectModal()}
      {renderResetModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userAvatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  settingsContainer: {
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingItemSubtitle: {
    fontSize: 13,
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    marginRight: 6,
    fontSize: 14,
  },
  switch: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 0.8 }, { scaleY: 0.8 }] : []
  },
  resetButtonContainer: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  resetButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 16,
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
  selectModalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    padding: 15,
    borderRadius: 12,
    marginVertical: 5,
    backgroundColor: '#f5f5f5',
  },
  selectedOption: {
    backgroundColor: '#4361EE15',
    borderWidth: 1,
    borderColor: '#4361EE30',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#4361EE',
    fontWeight: '600',
  },
  resetModalContent: {
    width: '90%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    maxWidth: 400,
  },
  resetModalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resetModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
  },
  resetModalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  resetModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  resetModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f3f5',
  },
  confirmButton: {
    backgroundColor: '#FF5A5F',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;