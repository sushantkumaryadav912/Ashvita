import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import CommunicationScreen from '../screens/CommunicationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, marginTop: 8 }}>
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
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Emergency" component={EmergencyScreen} />
          <Tab.Screen name="Communication" component={CommunicationScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
}