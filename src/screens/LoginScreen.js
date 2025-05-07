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
import { signIn } from '../services/authService'; // Corrected to named import
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await signIn(email, password); // Use named import directly
      await AsyncStorage.setItem('token', token);
      Alert.alert(
        'Welcome Back', 
        `Hello ${user.name}, you've successfully logged in.`,
        [{ text: 'OK', onPress: () => navigation.replace('Home') }]
      );
    } catch (error) {
      let errorMessage = error.message;
      if (error.message.includes('Invalid email') || error.message.includes('wrong password')) {
        errorMessage = 'Invalid email or password.';
      }
      Alert.alert('Login Failed', errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgetPassword = () => {
    navigation.navigate('ForgetPassword');
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
          <Text style={styles.sectionTitle}>Welcome Back</Text>
          
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="email" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor="#9E9E9E"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="lock" size={20} color="#E63946" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                secureTextEntry={!isPasswordVisible}
                value={password}
                onChangeText={setPassword}
                autoCapitalize="none"
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

          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgetPassword}
          >
            <Text style={styles.forgotPasswordText}>
              Forgot password?
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialIcons name="login" size={20} color="#FFFFFF" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Log In</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.signUpWrapper}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignup}>
              <Text style={styles.signUpLinkText}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
          
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
    paddingVertical: 30,
    backgroundColor: '#F8F9FA',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 32,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3557',
    marginBottom: 24,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: 4,
  },
  forgotPasswordText: {
    color: '#E63946',
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: '#E63946',
    padding: 16,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  signUpWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#457B9D',
  },
  signUpLinkText: {
    color: '#E63946',
    fontWeight: 'bold',
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

export default LoginScreen;