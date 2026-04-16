import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { signupRequest } from '../../redux/auth/authSlice';
import { useTheme } from '../../context/ThemeContext';

const ROLES = ['customer', 'provider'];

export default function SignupScreen({ navigation }) {
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState('customer');

  const dispatch           = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const { colors }         = useTheme();

  useEffect(() => {
    if (error) Alert.alert('Signup Failed', error);
  }, [error]);

  const handleSignup = () => {
    if (!name.trim() || !phone.trim() || !password.trim()) {
      return Alert.alert('Error', 'Please fill all fields');
    }
    dispatch(signupRequest({ name, phone, password, role }));
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.inner}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join homework today
        </Text>

        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.placeholder}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholderTextColor={colors.placeholder}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.placeholder}
        />

        <Text style={[styles.label, { color: colors.textSecondary }]}>I am a:</Text>
        <View style={styles.roleRow}>
          {ROLES.map((r) => (
            <TouchableOpacity
              key={r}
              style={[
                styles.roleBtn,
                { borderColor: colors.border, backgroundColor: colors.surface },
                role === r && { borderColor: colors.accent, backgroundColor: colors.accentBg },
              ]}
              onPress={() => setRole(r)}
            >
              <Text
                style={[
                  styles.roleBtnText,
                  { color: colors.textSecondary },
                  role === r && { color: colors.accent, fontWeight: '600' },
                ]}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.accent }]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { color: colors.textSecondary }]}>
            Already have an account?{' '}
            <Text style={[styles.linkBold, { color: colors.accent }]}>Login</Text>
          </Text>
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
  title: {
    fontSize:     28,
    fontWeight:   '700',
    textAlign:    'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize:     15,
    textAlign:    'center',
    marginBottom: 32,
  },
  label: {
    fontSize:     14,
    fontWeight:   '500',
    marginBottom: 10,
  },
  input: {
    borderWidth:       1.5,
    borderRadius:      12,
    paddingHorizontal: 16,
    paddingVertical:   14,
    fontSize:          15,
    marginBottom:      14,
  },
  roleRow: {
    flexDirection: 'row',
    gap:           12,
    marginBottom:  24,
  },
  roleBtn: {
    flex:           1,
    paddingVertical: 13,
    borderRadius:   12,
    borderWidth:    1.5,
    alignItems:     'center',
  },
  roleBtnText: { fontWeight: '500', fontSize: 15 },
  button: {
    borderRadius:    12,
    paddingVertical: 15,
    alignItems:      'center',
    marginBottom:    20,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link:       { textAlign: 'center', fontSize: 14 },
  linkBold:   { fontWeight: '600' },
});
