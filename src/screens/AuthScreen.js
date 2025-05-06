import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AuthInput from '../components/AuthInput';
import PrimaryButton from '../components/PrimaryButton';
import { signIn, signUp } from '../services/authService';
import { Picker } from 'react-native';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (isSignUp && !['patient', 'doctor', 'admin'].includes(userType)) {
      setError('Please select a valid user type');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password, userType);
      } else {
        await signIn(email, password);
      }
      navigation.replace('Main'); // Navigate to the Main tab navigator
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setEmail('');
    setPassword('');
    setUserType('patient');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Health Chain</Text>
      <Text style={styles.subtitle}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>

      <AuthInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <AuthInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isSignUp && (
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>User Type</Text>
          <Picker
            selectedValue={userType}
            onValueChange={(itemValue) => setUserType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Patient" value="patient" />
            <Picker.Item label="Doctor" value="doctor" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton
        title={isSignUp ? 'Sign Up' : 'Sign In'}
        onPress={handleAuth}
        disabled={isLoading}
      />
      {isLoading && <ActivityIndicator size="small" color="#4361EE" style={styles.loading} />}
      <TouchableOpacity onPress={toggleAuthMode} disabled={isLoading}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F9FC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#2B2D42',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2B2D42',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#2B2D42',
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  error: {
    color: '#EF476F',
    marginBottom: 10,
    textAlign: 'center',
  },
  toggleText: {
    color: '#4361EE',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '500',
  },
  loading: {
    marginVertical: 10,
  },
});