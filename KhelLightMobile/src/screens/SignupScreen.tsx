import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Added a note to keep the app's theme colors in mind for future updates
// Theme colors: Primary - #8B61C2, Secondary - #88D499

type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  Discover: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const themeColors = {
  primary: '#8B61C2',
  secondary: '#88D499',
};

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const { signUp, signInWithGoogle, signInWithApple } = useAuth();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await signUp(email, password, ''); // Added a placeholder for the missing third argument
      Alert.alert('Success', 'Please check your email for verification');
      navigation.navigate('Login');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>
      <Image 
        source={require('../../assets/icon.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />

      <Text style={styles.title}>Sign Up</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.googleButton]} 
        onPress={signInWithGoogle}
      >
        <Text style={styles.buttonText}>Sign Up with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, styles.appleButton]} 
        onPress={signInWithApple}
      >
        <Text style={styles.buttonText}>Sign Up with Apple</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// Removed theme colors from styles and reverted to default colors.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', // Reverted to white background
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000', // Reverted to black color for back button
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B61C2', // Updated to purple
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 2, // Increased border width for emphasis
    borderColor: '#8B61C2', // Updated to purple
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff', // White background for inputs
    color: '#000',
  },
  button: {
    backgroundColor: '#88D499', // Updated to green
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff', // Reverted to white color for button text
    fontSize: 18,
    fontWeight: '600',
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: '#000', // Reverted to black color for link text
    fontSize: 16,
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20, // Removed tintColor to restore original logo colors
  },
});