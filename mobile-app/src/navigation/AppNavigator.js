import React, { useEffect } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, Animated } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { initAuth } from '../redux/auth/authSlice';

import { ThemeProvider, useTheme } from '../context/ThemeContext';

import LoginScreen               from '../app/auth/LoginScreen';
import SignupScreen              from '../app/auth/SignupScreen';
import HomeScreen                from '../app/HomeScreen';
import ProviderDetailScreen      from '../app/ProviderDetailScreen';
import ProviderDashboardScreen   from '../app/ProviderDashboardScreen';
import ProviderProfileSetupScreen from '../app/ProviderProfileSetupScreen';
import SettingsScreen            from '../app/SettingsScreen';

const Stack = createNativeStackNavigator();

// Settings gear icon for header
function SettingsIcon({ navigation, tintColor }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Settings')}
      style={{ marginRight: 2, padding: 4 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={{ fontSize: 20 }}>⚙️</Text>
    </TouchableOpacity>
  );
}

// Inner navigator — has access to ThemeContext
function Navigator() {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.auth);
  const { colors, isDark, fadeAnim } = useTheme();

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  const headerStyle = {
    headerStyle:      { backgroundColor: colors.headerBg },
    headerTintColor:  colors.text,
    headerTitleStyle: { fontWeight: '600', color: colors.text },
    headerBackTitle:  '',
    headerShadowVisible: false,
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  // ── Auth screens ──────────────────────────────────────
  if (!token) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login"  component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      </Animated.View>
    );
  }

  // ── Provider: needs profile setup ────────────────────
  if (user?.role === 'provider' && !user?.profileComplete) {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfileSetup" component={ProviderProfileSetupScreen} />
        </Stack.Navigator>
      </Animated.View>
    );
  }

  // ── Provider dashboard ────────────────────────────────
  if (user?.role === 'provider') {
    return (
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <Stack.Navigator screenOptions={headerStyle}>
          <Stack.Screen
            name="Dashboard"
            component={ProviderDashboardScreen}
            options={({ navigation }) => ({
              title: 'My Dashboard',
              headerRight: () => <SettingsIcon navigation={navigation} />,
            })}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
      </Animated.View>
    );
  }

  // ── Customer home ─────────────────────────────────────
  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <Stack.Navigator screenOptions={headerStyle}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: 'Find a Provider',
            headerRight: () => <SettingsIcon navigation={navigation} />,
          })}
        />
        <Stack.Screen
          name="ProviderDetail"
          component={ProviderDetailScreen}
          options={{ title: 'Provider Details' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Stack.Navigator>
    </Animated.View>
  );
}

// Wrap everything in ThemeProvider
export default function AppNavigator() {
  return (
    <ThemeProvider>
      <Navigator />
    </ThemeProvider>
  );
}
