import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'YoungSerif-Regular': require('../../assets/fonts/YoungSerif-Regular.ttf'),
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        navigation.replace(isAuthenticated ? 'Home' : 'Login');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, isLoading, fadeAnim, navigation, isAuthenticated]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.logo}
        />
        <Text style={styles.name}>Smart Health Chain</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  name: {
    fontFamily: 'YoungSerif-Regular',
    fontSize: 32,
    fontWeight: '700',
    color: '#2B2D42',
    textAlign: 'center',
  },
});

export default SplashScreen;