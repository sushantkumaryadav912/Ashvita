import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgetPasswordScreen from '../screens/ForgetPasswordScreen';
import DashboardScreen from '../screens/DashboardScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import CommunicationScreen from '../screens/CommunicationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'home';
          else if (route.name === 'Emergency') iconName = 'alert-circle';
          else if (route.name === 'Communication') iconName = 'chatbubbles';
          else if (route.name === 'Profile') iconName = 'person';
          else if (route.name === 'Settings') iconName = 'settings';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4361EE',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e6e6e6',
          borderTopWidth: 1,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen 
        name="Emergency" 
        component={EmergencyScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle" size={size} color={color} />
          ),
          tabBarActiveTintColor: '#E63946', // Highlight emergency tab in red
        }}
      />
      <Tab.Screen name="Communication" component={CommunicationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgetPassword" component={ForgetPasswordScreen} />
      <Stack.Screen name="Home" component={MainTabs} />
      {/* Add Emergency as a separate stack screen to allow direct navigation */}
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
    </Stack.Navigator>
  );
}