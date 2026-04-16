import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setupProfileRequest } from '../redux/providers/providerSlice';
import { useTheme } from '../context/ThemeContext';

export default function ProviderProfileSetupScreen() {
  const [service, setService]       = useState('');
  const [area, setArea]             = useState('');
  const [experience, setExperience] = useState('');
  const dispatch                    = useDispatch();
  const { setupLoading, setupError } = useSelector((state) => state.providers);
  const { colors }                  = useTheme();

  useEffect(() => {
    if (setupError) Alert.alert('Error', setupError);
  }, [setupError]);

  const handleSubmit = () => {
    if (!service.trim() || !area.trim() || !experience.trim()) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    dispatch(setupProfileRequest({
      service:    service.trim(),
      area:       area.trim(),
      experience: Number(experience),
    }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.badge, { backgroundColor: colors.accentBg }]}>
          <Text style={[styles.badgeText, { color: colors.accent }]}>Step 1 of 1</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Complete Your Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customers search for providers by service and area. Fill in your details to appear in listings.
        </Text>

        <Text style={[styles.label, { color: colors.textSecondary }]}>Service Type</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. Plumber, Electrician, Carpenter"
          value={service}
          onChangeText={setService}
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Area / Location</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. Whitefield, Koramangala"
          value={area}
          onChangeText={setArea}
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>Years of Experience</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="e.g. 5"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          placeholderTextColor={colors.placeholder}
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleSubmit}
          disabled={setupLoading}
          activeOpacity={0.85}
        >
          {setupLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save & Go to Dashboard</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flexGrow:          1,
    justifyContent:    'center',
    paddingHorizontal: 24,
    paddingVertical:   48,
  },
  badge: {
    alignSelf:         'center',
    paddingHorizontal: 14,
    paddingVertical:   5,
    borderRadius:      20,
    marginBottom:      20,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
  title: {
    fontSize:     26,
    fontWeight:   '700',
    textAlign:    'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize:     14,
    textAlign:    'center',
    lineHeight:   20,
    marginBottom: 32,
  },
  label: {
    fontSize:     13,
    fontWeight:   '600',
    marginBottom: 6,
  },
  input: {
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 16,
    paddingVertical:   14,
    fontSize:          15,
    marginBottom:      18,
  },
  button: {
    borderRadius:    12,
    paddingVertical: 15,
    alignItems:      'center',
    marginTop:       4,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
