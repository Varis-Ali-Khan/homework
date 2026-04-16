import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dark, light } from '../theme';

const THEME_KEY = '@homework_theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true); // default: dark
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Load saved preference on mount
  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((val) => {
      if (val !== null) setIsDark(val === 'dark');
    });
  }, []);

  const toggleTheme = () => {
    // Brief fade during switch so it doesn't feel jarring
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.85, duration: 120, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1,    duration: 180, useNativeDriver: true }),
    ]).start();

    setIsDark((prev) => {
      const next = !prev;
      AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors: isDark ? dark : light, fadeAnim }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
