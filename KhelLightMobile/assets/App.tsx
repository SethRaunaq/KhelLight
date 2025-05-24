import './src/polyfills';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/contexts/AuthContext';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DiscoverScreen from './src/screens/DiscoverScreen';
import VideoGalleryScreen from './src/screens/VideoGalleryScreen';
import VideoPlayerScreen from './src/screens/VideoPlayerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen 
            name="Landing" 
            component={LandingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Signup" 
            component={SignupScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Discover" 
            component={DiscoverScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="VideoGallery" 
            component={VideoGalleryScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="VideoPlayer" 
            component={VideoPlayerScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
