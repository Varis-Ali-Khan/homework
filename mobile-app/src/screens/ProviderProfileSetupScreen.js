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
import { setupProfileRequest } from '../features/providers/providerSlice';

export default function ProviderProfileSetupScreen() {
  const [service, setService] = useState('');
  const [area, setArea] = useState('');
  const [experience, setExperience] = useState('');
  const dispatch = useDispatch();
  const { setupLoading, setupError } = useSelector((state) => state.providers);

  useEffect(() => {
    if (setupError) Alert.alert('Error', setupError);
  }, [setupError]);

  const handleSubmit = () => {
    if (!service.trim() || !area.trim() || !experience.trim()) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    dispatch(
      setupProfileRequest({
        service: service.trim(),
        area: area.trim(),
        experience: Number(experience),
      })
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Step 1 of 1</Text>
        </View>

        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Customers search for providers by service and area. Fill in your details to appear in listings.
        </Text>

        <Text style={styles.label}>Service Type</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Plumber, Electrician, Carpenter"
          value={service}
          onChangeText={setService}
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Area / Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Whitefield, Koramangala"
          value={area}
          onChangeText={setArea}
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Years of Experience</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 5"
          value={experience}
          onChangeText={setExperience}
          keyboardType="numeric"
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={setupLoading}
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
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  inner: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  badge: {
    backgroundColor: '#EFF6FF',
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: { color: '#2563EB', fontSize: 12, fontWeight: '600' },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 18,
  },
  button: {
    backgroundColor: '#2563EB',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
