import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { initAuth } from '../features/auth/authSlice';

import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import ProviderDetailScreen from '../screens/ProviderDetailScreen';
import ProviderDashboardScreen from '../screens/ProviderDashboardScreen';
import ProviderProfileSetupScreen from '../screens/ProviderProfileSetupScreen';

const Stack = createNativeStackNavigator();

const HEADER_STYLE = {
  headerStyle: { backgroundColor: '#2563EB' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontWeight: '600' },
  headerBackTitle: '',
};

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { token, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Not logged in → Auth flow
  if (!token) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    );
  }

  // Provider → must complete profile first, then Dashboard
  if (user?.role === 'provider') {
    if (!user?.profileComplete) {
      return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ProfileSetup" component={ProviderProfileSetupScreen} />
        </Stack.Navigator>
      );
    }
    return (
      <Stack.Navigator screenOptions={HEADER_STYLE}>
        <Stack.Screen
          name="Dashboard"
          component={ProviderDashboardScreen}
          options={{ title: 'My Dashboard' }}
        />
      </Stack.Navigator>
    );
  }

  // Customer → Home + Detail
  return (
    <Stack.Navigator screenOptions={HEADER_STYLE}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Find a Provider' }}
      />
      <Stack.Screen
        name="ProviderDetail"
        component={ProviderDetailScreen}
        options={{ title: 'Provider Details' }}
      />
    </Stack.Navigator>
  );
}
