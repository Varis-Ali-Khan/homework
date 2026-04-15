import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function ProviderDashboardScreen() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const signOut = () => dispatch(logout());
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name || 'Provider'}</Text>
        <Text style={styles.roleLabel}>Service Provider</Text>
      </View>

      {/* Profile section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <InfoRow label="Name" value={user?.name || '—'} />
        <InfoRow label="Phone" value={user?.phone || '—'} />
        <InfoRow label="Role" value="Provider" last />
      </View>

      {/* Subscription section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        <View
          style={[
            styles.statusCard,
            user?.isSubscribed ? styles.activeCard : styles.inactiveCard,
          ]}
        >
          <Text style={styles.statusIcon}>{user?.isSubscribed ? '✅' : '🔒'}</Text>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.statusTitle,
                { color: user?.isSubscribed ? '#065F46' : '#991B1B' },
              ]}
            >
              {user?.isSubscribed ? 'Subscription Active' : 'Not Subscribed'}
            </Text>
            <Text style={styles.statusSub}>
              {user?.isSubscribed
                ? 'Your phone number is visible to customers.'
                : 'Subscribe to make your contact visible to customers.'}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function InfoRow({ label, value, last }) {
  return (
    <View style={[styles.row, !last && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  hero: {
    backgroundColor: '#2563EB',
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#2563EB' },
  name: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  roleLabel: { fontSize: 14, color: '#BFDBFE' },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  rowLabel: { color: '#64748B', fontSize: 14 },
  rowValue: { color: '#1E293B', fontSize: 14, fontWeight: '500' },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 10,
    padding: 14,
  },
  activeCard: { backgroundColor: '#ECFDF5' },
  inactiveCard: { backgroundColor: '#FEF2F2' },
  statusIcon: { fontSize: 22, marginTop: 1 },
  statusTitle: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  statusSub: { color: '#64748B', fontSize: 13, lineHeight: 18 },
  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  logoutText: { color: '#DC2626', fontWeight: '600', fontSize: 15 },
});
