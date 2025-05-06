import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce';

// Simplified i18n-like translations
const translations = {
  en: {
    settings: 'Settings',
    appearance: 'Appearance',
    general: 'General',
    theme: 'Theme',
    fontSize: 'Font Size',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    dataSaving: 'Data Saving',
    account: 'Account Settings',
    privacy: 'Privacy',
    reset: 'Reset All Settings',
    save: 'Save Changes',
    username: 'Username',
    email: 'Email',
    shareAnalytics: 'Share Analytics',
    personalizedAds: 'Personalized Ads',
    success: 'Success',
    error: 'Error',
    resetConfirm: 'Are you sure you want to reset all settings to default?',
    settingsSaved: 'Settings saved successfully',
    settingsError: 'Failed to save settings',
    accountSaved: 'Account information saved',
    accountError: 'Failed to save account information',
    privacySaved: 'Privacy settings saved',
    privacyError: 'Failed to save privacy settings',
    invalidEmail: 'Please enter a valid email address',
    invalidUsername: 'Username must be at least 3 characters',
  },
  es: {
    settings: 'Configuración',
    appearance: 'Apariencia',
    general: 'General',
    theme: 'Tema',
    fontSize: 'Tamaño de fuente',
    darkMode: 'Modo oscuro',
    language: 'Idioma',
    notifications: 'Notificaciones',
    dataSaving: 'Ahorro de datos',
    account: 'Configuración de cuenta',
    privacy: 'Privacidad',
    reset: 'Restablecer todas las configuraciones',
    save: 'Guardar cambios',
    username: 'Nombre de usuario',
    email: 'Correo electrónico',
    shareAnalytics: 'Compartir análisis',
    personalizedAds: 'Anuncios personalizados',
    success: 'Éxito',
    error: 'Error',
    resetConfirm: '¿Estás seguro de que quieres restablecer todas las configuraciones a los valores predeterminados?',
    settingsSaved: 'Configuraciones guardadas exitosamente',
    settingsError: 'No se pudieron guardar las configuraciones',
    accountSaved: 'Información de cuenta guardada',
    accountError: 'No se pudo guardar la información de cuenta',
    privacySaved: 'Configuraciones de privacidad guardadas',
    privacyError: 'No se pudieron guardar las configuraciones de privacidad',
    invalidEmail: 'Por favor, introduce una dirección de correo válida',
    invalidUsername: 'El nombre de usuario debe tener al menos 3 caracteres',
  },
  fr: {
    settings: 'Paramètres',
    appearance: 'Apparence',
    general: 'Général',
    theme: 'Thème',
    fontSize: 'Taille de la police',
    darkMode: 'Mode sombre',
    language: 'Langue',
    notifications: 'Notifications',
    dataSaving: 'Économie de données',
    account: 'Paramètres du compte',
    privacy: 'Confidentialité',
    reset: 'Réinitialiser tous les paramètres',
    save: 'Enregistrer les modifications',
    username: 'Nom d’utilisateur',
    email: 'Email',
    shareAnalytics: 'Partager les analyses',
    personalizedAds: 'Annonces personnalisées',
    success: 'Succès',
    error: 'Erreur',
    resetConfirm: 'Êtes-vous sûr de vouloir réinitialiser tous les paramètres par défaut ?',
    settingsSaved: 'Paramètres enregistrés avec succès',
    settingsError: 'Échec de l’enregistrement des paramètres',
    accountSaved: 'Informations du compte enregistrées',
    accountError: 'Échec de l’enregistrement des informations du compte',
    privacySaved: 'Paramètres de confidentialité enregistrés',
    privacyError: 'Échec de l’enregistrement des paramètres de confidentialité',
    invalidEmail: 'Veuillez entrer une adresse email valide',
    invalidUsername: 'Le nom d’utilisateur doit comporter au moins 3 caractères',
  },
};

// Theme context for app-wide theme management
const ThemeContext = React.createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');
  const [language, setLanguage] = useState('en');

  const theme = themeMode === 'system' ? systemTheme : themeMode;

  const colors = {
    background: theme === 'dark' ? '#121212' : '#f8f9fa',
    card: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    text: theme === 'dark' ? '#f1f1f1' : '#333333',
    secondaryText: theme === 'dark' ? '#a1a1a1' : '#666666',
    border: theme === 'dark' ? '#2a2a2a' : '#eeeeee',
    primary: '#007AFF',
    success: '#4CD964',
    error: '#FF3B30',
  };

  return (
    <ThemeContext.Provider value={{ theme, colors, setThemeMode, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
const useTheme = () => React.useContext(ThemeContext);

// Settings configuration
const SETTINGS_CONFIG = {
  storageKey: 'APP_SETTINGS_V3',
  languages: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ],
  sections: [
    {
      title: 'appearance',
      icon: 'color-palette-outline',
      items: [
        {
          id: 'theme',
          label: 'theme',
          type: 'select',
          options: ['System', 'Light', 'Dark'],
          icon: 'color-palette',
          description: 'Change app appearance',
        },
        {
          id: 'fontSize',
          label: 'fontSize',
          type: 'slider',
          min: 12,
          max: 24,
          step: 2,
          icon: 'text',
          description: 'Adjust text size throughout the app',
        },
        {
          id: 'darkMode',
          label: 'darkMode',
          type: 'switch',
          icon: 'moon',
          description: 'Use dark mode for the app',
        },
      ],
    },
    {
      title: 'general',
      icon: 'settings-outline',
      items: [
        {
          id: 'language',
          label: 'language',
          type: 'select',
          options: ['English', 'Español', 'Français'],
          icon: 'globe',
          description: 'Change app language',
        },
        {
          id: 'notifications',
          label: 'notifications',
          type: 'switch',
          icon: 'notifications',
          description: 'Enable push notifications',
        },
        {
          id: 'dataSaving',
          label: 'dataSaving',
          type: 'switch',
          icon: 'save',
          description: 'Reduce data usage by limiting high-quality content',
        },
        {
          id: 'account',
          label: 'account',
          type: 'navigation',
          icon: 'person',
          description: 'Manage your account details',
        },
        {
          id: 'privacy',
          label: 'privacy',
          type: 'navigation',
          icon: 'shield',
          description: 'Manage privacy settings and data usage',
        },
      ],
    },
  ],
};

// Main Settings Screen Component
export function SettingsScreen({ navigation }) {
  const { theme, colors, setThemeMode, language, setLanguage } = useTheme();
  const [settings, setSettings] = useState({
    theme: 'system',
    fontSize: 16,
    language: 'en',
    notifications: true,
    darkMode: false,
    dataSaving: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const t = translations[language] || translations.en;

  // Load settings with retry logic
  const loadSettings = useCallback(async (retries = 3) => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_CONFIG.storageKey);
      if (stored) {
        const parsedSettings = JSON.parse(stored);
        setSettings(parsedSettings);
        setThemeMode(parsedSettings.theme.toLowerCase());
        setLanguage(parsedSettings.language);
      }
    } catch (error) {
      if (retries > 0) {
        setTimeout(() => loadSettings(retries - 1), 1000);
        return;
      }
      console.error('Failed to load settings:', error);
      Alert.alert(t.error, t.settingsError);
    } finally {
      setLoading(false);
    }
  }, [setThemeMode, setLanguage, t]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Debounced save settings
  const saveSettings = useCallback(
    debounce(async (newSettings) => {
      setSaving(true);
      try {
        await AsyncStorage.setItem(
          SETTINGS_CONFIG.storageKey,
          JSON.stringify(newSettings)
        );
        setSettings(newSettings);
        if (newSettings.theme !== settings.theme) {
          setThemeMode(newSettings.theme.toLowerCase());
        }
        if (newSettings.language !== settings.language) {
          setLanguage(newSettings.language);
          Alert.alert(t.success, t.settingsSaved);
        }
      } catch (error) {
        console.error('Failed to save settings:', error);
        Alert.alert(t.error, t.settingsError);
      } finally {
        setSaving(false);
      }
    }, 500),
    [settings, setThemeMode, setLanguage, t]
  );

  // Handle setting changes
  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    if (key === 'darkMode') {
      newSettings.theme = value ? 'dark' : 'light';
    }
    if (key === 'theme' && value.toLowerCase() !== 'system') {
      newSettings.darkMode = value.toLowerCase() === 'dark';
    }
    saveSettings(newSettings);
  };

  // Reset settings
  const resetSettings = () => {
    Alert.alert(
      t.reset,
      t.resetConfirm,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: t.reset,
          style: 'destructive',
          onPress: async () => {
            const defaultSettings = {
              theme: 'system',
              fontSize: 16,
              language: 'en',
              notifications: true,
              darkMode: false,
              dataSaving: false,
            };
            await saveSettings(defaultSettings);
            setThemeMode('system');
            setLanguage('en');
            Alert.alert(t.success, t.settingsSaved);
          },
        },
      ]
    );
  };

  // Dynamic styles
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingHorizontal: 8,
    },
    sectionIcon: {
      marginRight: 8,
      color: colors.primary,
    },
    sectionTitle: {
      fontSize: settings.fontSize + 2,
      fontWeight: '600',
      color: colors.text,
    },
    sectionContent: {
      backgroundColor: colors.card,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOpacity: theme === 'dark' ? 0.3 : 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 4 },
      elevation: 5,
    },
    itemContainer: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    itemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    itemText: {
      flex: 1,
    },
    itemLabel: {
      fontSize: settings.fontSize,
      color: colors.text,
      fontWeight: '500',
    },
    itemDescription: {
      fontSize: settings.fontSize - 2,
      color: colors.secondaryText,
      marginTop: 4,
    },
    selectValue: {
      color: colors.primary,
      fontSize: settings.fontSize,
      fontWeight: '500',
    },
    slider: {
      width: 150,
      height: 40,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    fontSizeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sliderValue: {
      color: colors.primary,
      fontSize: settings.fontSize - 2,
      fontWeight: '500',
      marginLeft: 8,
    },
    headerRight: {
      marginRight: 16,
    },
    resetButton: {
      backgroundColor: colors.error,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      margin: 16,
    },
    resetButtonText: {
      color: '#fff',
      fontSize: settings.fontSize,
      fontWeight: '600',
    },
  });

  // Set navigation options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: t.settings,
      headerRight: () => (
        saving ? (
          <ActivityIndicator color={colors.primary} style={dynamicStyles.headerRight} />
        ) : null
      ),
      headerStyle: {
        backgroundColor: colors.card,
      },
      headerTintColor: colors.text,
    });
  }, [navigation, saving, colors, t]);

  if (loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Setting Item Component
  const SettingItem = ({ item, section }) => {
    const renderControl = () => {
      switch (item.type) {
        case 'switch':
          return (
            <Switch
              value={settings[item.id]}
              onValueChange={(val) => handleChange(item.id, val)}
              trackColor={{ true: colors.primary, false: '#ccc' }}
              thumbColor={settings[item.id] ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
            />
          );

        case 'select':
          let displayValue;
          if (item.id === 'language') {
            const languageOption = SETTINGS_CONFIG.languages.find(lang => lang.code === settings[item.id]);
            displayValue = languageOption ? languageOption.name : settings[item.id];
          } else {
            displayValue = settings[item.id].charAt(0).toUpperCase() + settings[item.id].slice(1);
          }

          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SettingsSelect', {
                  title: t[item.label],
                  options: item.options,
                  selected: settings[item.id],
                  onSelect: (value) => handleChange(item.id, value.toLowerCase()),
                });
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={dynamicStyles.selectValue}>{displayValue}</Text>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} style={{ marginLeft: 8 }} />
              </View>
            </TouchableOpacity>
          );

        case 'slider':
          return (
            <View style={dynamicStyles.fontSizeContainer}>
              <Slider
                style={dynamicStyles.slider}
                minimumValue={item.min}
                maximumValue={item.max}
                step={item.step}
                value={settings[item.id]}
                onValueChange={(val) => handleChange(item.id, val)}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
              />
              <Text style={dynamicStyles.sliderValue}>{settings[item.id]}</Text>
            </View>
          );

        case 'navigation':
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate(item.id)}
            >
              <Ionicons name="chevron-forward" size={24} color={colors.primary} />
            </TouchableOpacity>
          );

        default:
          return null;
      }
    };

    const isLastItem = item.id === section.items[section.items.length - 1].id;

    return (
      <Pressable
        style={({ pressed }) => [
          dynamicStyles.itemContainer,
          { opacity: pressed ? 0.8 : 1 },
          isLastItem && { borderBottomWidth: 0 },
        ]}
        onPress={() => {
          if (item.type === 'navigation') {
            navigation.navigate(item.id);
          } else if (item.type === 'select') {
            navigation.navigate('SettingsSelect', {
              title: t[item.label],
              options: item.options,
              selected: settings[item.id],
              onSelect: (value) => handleChange(item.id, value.toLowerCase()),
            });
          }
        }}
      >
        <View style={dynamicStyles.itemContent}>
          <View style={dynamicStyles.iconContainer}>
            <Ionicons name={item.icon} size={18} color={colors.primary} />
          </View>
          <View style={dynamicStyles.itemText}>
            <Text style={dynamicStyles.itemLabel}>{t[item.label]}</Text>
            {item.description && (
              <Text style={dynamicStyles.itemDescription}>{item.description}</Text>
            )}
          </View>
          {renderControl()}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.card}
      />
      <ScrollView
        style={dynamicStyles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {SETTINGS_CONFIG.sections.map((section) => (
          <View key={section.title} style={dynamicStyles.section}>
            <View style={dynamicStyles.sectionHeader}>
              <Ionicons name={section.icon} size={20} style={dynamicStyles.sectionIcon} />
              <Text style={dynamicStyles.sectionTitle}>{t[section.title]}</Text>
            </View>
            <View style={dynamicStyles.sectionContent}>
              {section.items.map((item) => (
                <SettingItem key={item.id} item={item} section={section} />
              ))}
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={dynamicStyles.resetButton}
          onPress={resetSettings}
        >
          <Text style={dynamicStyles.resetButtonText}>{t.reset}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Settings Select Screen Component
export function SettingsSelectScreen({ route, navigation }) {
  const { title, options, selected, onSelect } = route.params;
  const { colors, language } = useTheme();
  const t = translations[language] || translations.en;

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    optionContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      marginTop: 16,
      overflow: 'hidden',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    optionText: {
      fontSize: 16,
      color: colors.text,
    },
    selectedOption: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title,
      headerStyle: {
        backgroundColor: colors.card,
      },
      headerTintColor: colors.text,
    });
  }, [navigation, title, colors]);

  return (
    <View style={dynamicStyles.container}>
      <View style={dynamicStyles.optionContainer}>
        {options.map((option, index) => (
          <Pressable
            key={option}
            style={({ pressed }) => [
              dynamicStyles.option,
              { opacity: pressed ? 0.8 : 1 },
              index === options.length - 1 && { borderBottomWidth: 0 },
            ]}
            onPress={() => {
              onSelect(option);
              navigation.goBack();
            }}
          >
            <Text
              style={[
                dynamicStyles.optionText,
                option.toLowerCase() === selected.toLowerCase() && dynamicStyles.selectedOption,
              ]}
            >
              {option}
            </Text>
            {option.toLowerCase() === selected.toLowerCase() && (
              <Ionicons name="checkmark" size={24} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// Account Settings Screen
export function AccountSettingsScreen({ navigation }) {
  const { colors, language } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const t = translations[language] || translations.en;

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginTop: 16,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  });

  const validateInputs = () => {
    if (username.length < 3) {
      Alert.alert(t.error, t.invalidUsername);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t.error, t.invalidEmail);
      return false;
    }
    return true;
  };

  const saveAccount = async () => {
    if (!validateInputs()) return;
    setSaving(true);
    try {
      await AsyncStorage.setItem('ACCOUNT_INFO', JSON.stringify({ username, email }));
      Alert.alert(t.success, t.accountSaved);
    } catch (error) {
      console.error('Failed to save account info:', error);
      Alert.alert(t.error, t.accountError);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const loadAccount = async () => {
      try {
        const stored = await AsyncStorage.getItem('ACCOUNT_INFO');
        if (stored) {
          const { username: storedUsername, email: storedEmail } = JSON.parse(stored);
          setUsername(storedUsername || '');
          setEmail(storedEmail || '');
        }
      } catch (error) {
        console.error('Failed to load account info:', error);
      }
    };
    loadAccount();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t.account,
      headerStyle: {
        backgroundColor: colors.card,
      },
      headerTintColor: colors.text,
    });
  }, [navigation, colors, t]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <TextInput
        style={dynamicStyles.input}
        value={username}
        onChangeText={setUsername}
        placeholder={t.username}
        placeholderTextColor={colors.secondaryText}
      />
      <TextInput
        style={dynamicStyles.input}
        value={email}
        onChangeText={setEmail}
        placeholder={t.email}
        placeholderTextColor={colors.secondaryText}
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={dynamicStyles.saveButton}
        onPress={saveAccount}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={dynamicStyles.saveButtonText}>{t.save}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Privacy Settings Screen
export function PrivacySettingsScreen({ navigation }) {
  const { colors, language } = useTheme();
  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: true,
    personalizedAds: false,
  });
  const t = translations[language] || translations.en;

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginVertical: 8,
    },
    itemText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
  });

  const toggleSetting = async (key) => {
    const newSettings = { ...privacySettings, [key]: !privacySettings[key] };
    setPrivacySettings(newSettings);
    try {
      await AsyncStorage.setItem('PRIVACY_SETTINGS', JSON.stringify(newSettings));
      Alert.alert(t.success, t.privacySaved);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      Alert.alert(t.error, t.privacyError);
    }
  };

  useEffect(() => {
    const loadPrivacySettings = async () => {
      try {
        const stored = await AsyncStorage.getItem('PRIVACY_SETTINGS');
        if (stored) {
          setPrivacySettings(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load privacy settings:', error);
      }
    };
    loadPrivacySettings();
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: t.privacy,
      headerStyle: {
        backgroundColor: colors.card,
      },
      headerTintColor: colors.text,
    });
  }, [navigation, colors, t]);

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.itemContainer}>
        <Text style={dynamicStyles.itemText}>{t.shareAnalytics}</Text>
        <Switch
          value={privacySettings.shareAnalytics}
          onValueChange={() => toggleSetting('shareAnalytics')}
          trackColor={{ true: colors.primary, false: '#ccc' }}
          thumbColor={privacySettings.shareAnalytics ? '#ffffff' : '#f4f3f4'}
        />
      </View>
      <View style={dynamicStyles.itemContainer}>
        <Text style={dynamicStyles.itemText}>{t.personalizedAds}</Text>
        <Switch
          value={privacySettings.personalizedAds}
          onValueChange={() => toggleSetting('personalizedAds')}
          trackColor={{ true: colors.primary, false: '#ccc' }}
          thumbColor={privacySettings.personalizedAds ? '#ffffff' : '#f4f3f4'}
        />
      </View>
    </SafeAreaView>
  );
}