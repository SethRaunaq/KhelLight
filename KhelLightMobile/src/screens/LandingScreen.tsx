import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  Discover: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LandingScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/icon.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.signupButton]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align content to the top
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 0, // No margin below subtitle
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'System', // Use the default iOS system font for a clean look
  },
  buttonContainer: {
    width: '100%',
    marginTop: '50%', // Half-page margin to separate buttons from subtitle
    gap: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#8B61C2', // Updated to purple for login button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  signupButton: {
    backgroundColor: '#88D499', // Updated to green for sign up button
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17, // Slightly smaller font for a refined look
    fontWeight: '600',
    letterSpacing: 0.5, // Subtle letter spacing for readability
  },
  logo: {
    width: 300, // Updated width to match new dimensions
    height: 300, // Updated height to match new dimensions
    marginBottom: 20, // Added spacing below the logo
    marginTop: 20, // Add some top margin to position the logo at the top
    opacity: 1,
  },
});