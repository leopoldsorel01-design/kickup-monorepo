import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import DrillScreen from './src/screens/DrillScreen';
import MatchmakingScreen from './src/screens/MatchmakingScreen';
import SocialFeedScreen from './src/screens/SocialFeedScreen';
import LockerRoomScreen from './src/screens/LockerRoomScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import HealthCheckScreen from './src/screens/HealthCheckScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { AppProvider } from './src/context/AppContext';
import { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const [isSplashTimeElapsed, setIsSplashTimeElapsed] = useState(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    setIsAuthLoaded(true);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

    // Simulate minimum splash screen time
    const splashTimeout = setTimeout(() => {
      setIsSplashTimeElapsed(true);
    }, 3000); // Show splash for at least 3 seconds

    return () => {
      subscriber();
      clearTimeout(splashTimeout);
    };
  }, []);

  const showSplashScreen = !isAuthLoaded || !isSplashTimeElapsed;

  if (showSplashScreen) {
    return <SplashScreen />;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'black' }
            }}
          >
            {user ? (
              <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Camera" component={CameraScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
                <Stack.Screen name="Drill" component={DrillScreen} />
                <Stack.Screen name="Matchmaking" component={MatchmakingScreen} />
                <Stack.Screen name="SocialFeed" component={SocialFeedScreen} />
                <Stack.Screen name="LockerRoom" component={LockerRoomScreen} />
                <Stack.Screen name="Calendar" component={CalendarScreen} />
                <Stack.Screen name="HealthCheck" component={HealthCheckScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
