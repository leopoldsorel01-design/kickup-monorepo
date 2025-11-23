import React, { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { LoginScreen } from './src/screens/LoginScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { CameraScreen } from './src/screens/CameraScreen';
import { ScreenName } from './src/types';

function App(): React.JSX.Element {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('Login');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <LoginScreen onNavigate={setCurrentScreen} />;
      case 'Register':
        return <RegisterScreen onNavigate={setCurrentScreen} />;
      case 'Camera':
        return <CameraScreen />;
      default:
        return <LoginScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
      {renderScreen()}
    </SafeAreaView>
  );
}

export default App;
