import React, { useState } from 'react';
import { 
  Alert, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { resetPassword } from '../services/authService'; // Corrected to named import

const ForgetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isCurrentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password.');
      return;
    }
    if (!newPassword) {
      Alert.alert('Error', 'Please enter your new password.');
      return;
    }
    if (!confirmPassword) {
      Alert.alert('Error', 'Please confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email, currentPassword, newPassword); // Use named import directly
      Alert.alert(
        'Password Reset Successful', 
        'Your password has been changed successfully.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      let errorMessage = error.message;
      if (error.message.includes('user-not-found')) {
        errorMessage = 'No account exists with this email address.';
      } else if (error.message.includes('wrong-password')) {
        errorMessage = 'Current password is incorrect.';
      }
      Alert.alert('Password Reset Failed', errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
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
          <Text style={styles.sectionTitle}>Reset Password</Text>
          <Text style={styles.sectionDescription}>
            Enter your email and current password to reset your password
          </Text>
          
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
                autoCapitalize="none"
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your current password"
                secureTextEntry={!isCurrentPasswordVisible}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                autoCapitalize="none"
                placeholderTextColor="#9E9E9E"
              />
              <TouchableOpacity
                style={styles.eyeIconWrapper}
                onPress={() => setCurrentPasswordVisible(!isCurrentPasswordVisible)}
              >
                <MaterialIcons
                  name={isCurrentPasswordVisible ? 'visibility-off' : 'visibility'}
                  size={24}
                  color="#707070"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock-reset" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your new password"
                secureTextEntry={!isNewPasswordVisible}
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
                placeholderTextColor="#9E9E9E"
              />
              <TouchableOpacity
                style={styles.eyeIconWrapper}
                onPress={() => setNewPasswordVisible(!isNewPasswordVisible)}
              >
                <MaterialIcons
                  name={isNewPasswordVisible ? 'visibility-off' : 'visibility'}
                  size={24}
                  color="#707070"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock-reset" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm your new password"
                secureTextEntry={!isConfirmPasswordVisible}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
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
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="restore" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Reset Password</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={handleBackToLogin}
          >
            <MaterialIcons name="arrow-back" size={20} color="#457B9D" style={styles.buttonIcon} />
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#457B9D',
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
  eyeIconWrapper: {
    padding: 12,
  },
  resetButton: {
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
  backToLoginButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
  },
  backToLoginText: {
    color: '#457B9D',
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#A8DADC',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#457B9D',
    fontWeight: '500',
  },
  emergencyButtonContainer: {
    marginTop: 10,
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

export default ForgetPasswordScreen;