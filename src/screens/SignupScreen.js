import React, { useState } from 'react';
import { 
  Text, 
  Alert, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Image
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { signUp } from '../services/authService'; // Corrected to named import
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState('');
    
  const handlePhoneNumberChange = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setPhone(text);
    } else {
      Alert.alert('Error', 'Phone number cannot exceed 10 digits.');
    }
  };

  const handleEmergencyContactChange = (text) => {
    if (/^\d{0,10}$/.test(text)) {
      setEmergencyContact(text);
    } else {
      Alert.alert('Error', 'Emergency contact number cannot exceed 10 digits.');
    }
  };

  const handleSignup = async () => {
    if (!username) {
      Alert.alert('Error', 'Please enter your username.');
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email.');
      return;
    }
    if (!phone) {
      Alert.alert('Error', 'Please enter your phone number.');
      return;
    }
    if (userType === 'patient' && !emergencyContact) {
      Alert.alert('Error', 'Please provide an emergency contact number.');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Please enter your password.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!['patient', 'doctor', 'admin'].includes(userType)) {
      Alert.alert('Error', 'Please select a valid user type.');
      return;
    }

    setIsLoading(true);
    try {
      // Add emergency contact to the signup data for patients
      const userData = {
        email,
        password,
        userType,
        name: username, // Changed to match backend expectation
        phone: `${countryCode}${phone}`,
        ...(userType === 'patient' && { emergencyContact: `${countryCode}${emergencyContact}` })
      };
      
      const { token, user } = await signUp(userData); // Use named import directly
      await AsyncStorage.setItem('token', token);
      Alert.alert(
        'Registration Successful', 
        `Thank you for joining Ashvita. Your account has been created.`,
        [{ text: 'OK', onPress: () => navigation.replace('Home') }]
      );
    } catch (error) {
      let errorMessage = error.message;
      if (error.message.includes('already exists')) {
        errorMessage = 'This email is already in use.';
      } else if (error.message.includes('weak-password')) {
        errorMessage = 'Password should be at least 6 characters.';
      }
      Alert.alert('Registration Failed', errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Image 
            source={require('../../assets/splash1.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Ashvita</Text>
          <Text style={styles.headerSubtitle}>Medical Emergency App</Text>
        </View>
        
        <View style={styles.formWrapper}>
          <Text style={styles.sectionTitle}>Create your account</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="person" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#9E9E9E"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInputWrapper}>
              <View style={styles.countryCodePicker}>
                <Picker
                  selectedValue={countryCode}
                  onValueChange={(value) => setCountryCode(value)}
                  style={styles.picker}
                  dropdownIconColor="#E63946"
                >
                  <Picker.Item label="+1 (USA)" value="+1" />
                  <Picker.Item label="+91 (India)" value="+91" />
                  <Picker.Item label="+44 (UK)" value="+44" />
                  <Picker.Item label="+61 (Australia)" value="+61" />
                  <Picker.Item label="+81 (Japan)" value="+81" />
                </Picker>
              </View>
              <View style={[styles.inputContainer, styles.phoneInputContainer]}>
                <MaterialIcons name="phone" size={20} color="#E63946" style={styles.inputIcon} />
                <TextInput
                  style={styles.phoneTextInput}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={handlePhoneNumberChange}
                  placeholderTextColor="#9E9E9E"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>I am a</Text>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity 
                style={[
                  styles.userTypeButton, 
                  userType === 'patient' && styles.selectedUserType
                ]}
                onPress={() => setUserType('patient')}
              >
                <MaterialIcons 
                  name="person" 
                  size={24} 
                  color={userType === 'patient' ? "#FFFFFF" : "#E63946"} 
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'patient' && styles.selectedUserTypeText
                ]}>Patient</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.userTypeButton, 
                  userType === 'doctor' && styles.selectedUserType
                ]}
                onPress={() => setUserType('doctor')}
              >
                <MaterialIcons 
                  name="medical-services" 
                  size={24} 
                  color={userType === 'doctor' ? "#FFFFFF" : "#E63946"} 
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'doctor' && styles.selectedUserTypeText
                ]}>Doctor</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.userTypeButton, 
                  userType === 'admin' && styles.selectedUserType
                ]}
                onPress={() => setUserType('admin')}
              >
                <MaterialIcons 
                  name="admin-panel-settings" 
                  size={24} 
                  color={userType === 'admin' ? "#FFFFFF" : "#E63946"} 
                />
                <Text style={[
                  styles.userTypeText,
                  userType === 'admin' && styles.selectedUserTypeText
                ]}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {userType === 'patient' && (
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Emergency Contact Number</Text>
              <View style={styles.phoneInputWrapper}>
                <View style={styles.countryCodePicker}>
                  <Picker
                    selectedValue={countryCode}
                    onValueChange={(value) => setCountryCode(value)}
                    style={styles.picker}
                    dropdownIconColor="#E63946"
                  >
                    <Picker.Item label="+1 (USA)" value="+1" />
                    <Picker.Item label="+91 (India)" value="+91" />
                    <Picker.Item label="+44 (UK)" value="+44" />
                    <Picker.Item label="+61 (Australia)" value="+61" />
                    <Picker.Item label="+81 (Japan)" value="+81" />
                  </Picker>
                </View>
                <View style={[styles.inputContainer, styles.phoneInputContainer]}>
                  <MaterialIcons name="contact-phone" size={20} color="#E63946" style={styles.inputIcon} />
                  <TextInput
                    style={styles.phoneTextInput}
                    placeholder="Emergency contact number"
                    keyboardType="phone-pad"
                    value={emergencyContact}
                    onChangeText={handleEmergencyContactChange}
                    placeholderTextColor="#9E9E9E"
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Create a strong password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#9E9E9E"
              />
              <TouchableOpacity
                style={styles.eyeIconWrapper}
                onPress={() => setPasswordVisible(!isPasswordVisible)}
              >
                <MaterialIcons
                  name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                  size={24}
                  color="#707070"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm your password"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#9E9E9E"
              />
              <TouchableOpacity
                style={styles.eyeIconWrapper}
                onPress={() => setConfirmPasswordVisible(!isConfirmPasswordVisible)}
              >
                <MaterialIcons
                  name={isConfirmPasswordVisible ? 'visibility-off' : 'visibility'}
                  size={24}
                  color="#707070"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.signupButton}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="app-registration" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>
          
          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emergencyButtonContainer}>
            <TouchableOpacity 
              style={styles.emergencyButton}
              onPress={() => navigation.navigate('Emergency')}
            >
              <MaterialIcons name="warning" size={24} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>EMERGENCY - Get Help Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F8F9FA',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#E63946',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#457B9D',
    marginBottom: 10,
  },
  formWrapper: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    color: '#457B9D',
    fontWeight: '600',
    marginBottom: 8,
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1FAEE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8DADC',
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    padding: 12,
    color: '#1D3557',
    fontSize: 16,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodePicker: {
    width: 110,
    backgroundColor: '#F1FAEE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8DADC',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 8,
  },
  picker: {
    height: 50,
    color: '#1D3557',
  },
  phoneInputContainer: {
    flex: 1,
  },
  phoneTextInput: {
    flex: 1,
    padding: 12,
    color: '#1D3557',
    fontSize: 16,
  },
  eyeIconWrapper: {
    padding: 12,
  },
  userTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E63946',
    backgroundColor: '#FFFFFF',
  },
  selectedUserType: {
    backgroundColor: '#E63946',
    borderColor: '#E63946',
  },
  userTypeText: {
    color: '#1D3557',
    fontWeight: '500',
    marginLeft: 8,
    fontSize: 14,
  },
  selectedUserTypeText: {
    color: '#FFFFFF',
  },
  signupButton: {
    flexDirection: 'row',
    backgroundColor: '#E63946',
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginPrompt: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  loginPromptText: {
    color: '#457B9D',
  },
  loginLink: {
    color: '#E63946',
    fontWeight: 'bold',
  },
  emergencyButtonContainer: {
    marginTop: 30,
  },
  emergencyButton: {
    flexDirection: 'row',
    backgroundColor: '#E63946',
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SignupScreen;