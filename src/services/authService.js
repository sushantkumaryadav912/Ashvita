import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for the backend API
// Use http://10.0.2.2:5000 for Android emulator; replace with your machine's IP if using a physical device
const API_BASE_URL = 'http://10.0.2.2:5000/api/auth';

export const signIn = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    const { token, user } = response.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userType', user.userType);
    return response.data; // { token, user: { id, email, userType, name, phone } }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Invalid credentials');
  }
};

export const signUp = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    const { token, user } = response.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userType', user.userType);
    return response.data; // { token, user: { id, email, userType, name, phone } }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create account');
  }
};

export const resetPassword = async (email, currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, {
      email,
      currentPassword,
      newPassword,
    });
    return response.data; // { message }
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to reset password');
  }
};

export const signOut = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('userType');
};