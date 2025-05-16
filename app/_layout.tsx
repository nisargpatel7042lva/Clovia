import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { AVPlaybackStatus, ResizeMode, Video } from 'expo-av';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/AuthContext';
import { StakingProvider } from '../context/StakingContext';
import { UserProvider } from '../context/UserContext';
import { WalletProvider } from '../context/WalletContext';

// Create a PremiumText component for global use
export function PremiumText(props: React.ComponentProps<typeof RNText>) {
  // Use Montserrat-Bold if fontWeight is bold, else Montserrat-Regular
  let fontFamily = 'Montserrat-Regular';
  if (props.style) {
    const stylesArray = Array.isArray(props.style) ? props.style : [props.style];
    if (stylesArray.some(s => s && (s as React.CSSProperties).fontWeight === 'bold')) {
      fontFamily = 'Montserrat-Bold';
    }
  }
  return <RNText {...props} style={[{ fontFamily }, props.style]} />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Montserrat-Regular': require('../assets/fonts/Montserrat/static/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../assets/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'), // for legacy
  });
  const [showSplash, setShowSplash] = useState(true);

  if (!loaded) {
    return null;
  }

  return (
    <WalletProvider>
      <StakingProvider>
        <UserProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack initialRouteName="welcome">
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="welcome" options={{ headerShown: false }} />
                  <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
                {showSplash && (
                  <GestureHandlerRootView
                    style={[
                      StyleSheet.absoluteFill,
                      { backgroundColor: '#18192b', zIndex: 9999, justifyContent: 'center', alignItems: 'center' },
                    ]}
                    pointerEvents="box-none"
                  >
                    <Video
                      source={require('../assets/videos/Clovia.mp4')}
                      style={StyleSheet.absoluteFillObject}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay
                      onPlaybackStatusUpdate={(status: AVPlaybackStatus) => {
                        if (status.isLoaded && status.didJustFinish) {
                          setShowSplash(false);
                        }
                      }}
                    />
                  </GestureHandlerRootView>
                )}
              </ThemeProvider>
            </GestureHandlerRootView>
          </AuthProvider>
        </UserProvider>
      </StakingProvider>
    </WalletProvider>
  );
}
