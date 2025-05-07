import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authData from '../../assets/data/auth.json';

const API_BASE_URL = process.env.API_BASE_URL || 'http://api.com:5000';

// Mock credentials loaded from auth.json
const MOCK_CREDENTIALS = authData.credentials;

export const signIn = async (email, password) => {
  try {
    // Check mock credentials first
    const mockUser = MOCK_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === password
    );
    if (mockUser) {
      const mockResponse = {
        token: `mock-jwt-token-${mockUser.id}`,
        user: {
          id: mockUser.id,
          email: mockUser.email,
          userType: mockUser.userType || 'standard',
          name: mockUser.name || 'Mock User',
          phone: mockUser.phone || '123-456-7890',
        },
      };
      await AsyncStorage.setItem('token', mockResponse.token);
      await AsyncStorage.setItem('userType', mockResponse.user.userType);
      return mockResponse;
    }

    // Fallback to actual API call
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
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
    // Simulate mock signup by checking if email exists
    const emailExists = MOCK_CREDENTIALS.some(
      (cred) => cred.email === userData.email
    );
    if (emailExists) {
      throw new Error('Email already exists in mock data');
    }

    // Simulate adding to mock data (in real app, this would modify auth.json)
    const mockUser = {
      id: `user-${MOCK_CREDENTIALS.length + 1}`,
      email: userData.email,
      password: userData.password,
      userType: userData.userType || 'standard',
      name: userData.name || 'New User',
      phone: userData.phone || '123-456-7890',
    };
    const mockResponse = {
      token: `mock-jwt-token-${mockUser.id}`,
      user: mockUser,
    };
    await AsyncStorage.setItem('token', mockResponse.token);
    await AsyncStorage.setItem('userType', mockResponse.user.userType);
    return mockResponse;

    // Actual API call (commented out as mock takes precedence)
    /*
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
    const { token, user } = response.data;
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userType', user.userType);
    return response.data; // { token, user: { id, email, userType, name, phone } }
    */
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create account');
  }
};

export const resetPassword = async (email, currentPassword, newPassword) => {
  try {
    // Check mock credentials for reset
    const mockUser = MOCK_CREDENTIALS.find(
      (cred) => cred.email === email && cred.password === currentPassword
    );
    if (mockUser) {
      // Simulate password reset (in real app, this would update auth.json)
      mockUser.password = newPassword;
      return { message: 'Password reset successfully in mock data' };
    }

    // Fallback to actual API call
    const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, {
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