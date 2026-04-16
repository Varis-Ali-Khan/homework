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
import { logout } from '../redux/auth/authSlice';
import { useTheme } from '../context/ThemeContext';

export default function ProviderDashboardScreen({ navigation }) {
  const dispatch     = useDispatch();
  const { user }     = useSelector((state) => state.auth);
  const insets       = useSafeAreaInsets();
  const { colors }   = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: colors.heroBg }]}>
        <View style={[styles.avatarRing, { borderColor: colors.accent + '50' }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent + '22', borderColor: colors.accent }]}>
            <Text style={[styles.avatarText, { color: colors.accent }]}>
              {user?.name?.charAt(0).toUpperCase() || 'P'}
            </Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Provider'}</Text>
        <View style={[styles.rolePill, { backgroundColor: colors.accent + '22' }]}>
          <Text style={[styles.rolePillText, { color: colors.accent }]}>Service Provider</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Profile */}
        <SectionCard title="PROFILE" colors={colors}>
          <InfoRow label="Name"  value={user?.name}  colors={colors} />
          <InfoRow label="Phone" value={user?.phone} colors={colors} last />
        </SectionCard>

        {/* Subscription */}
        <SectionCard title="SUBSCRIPTION" colors={colors}>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: user?.isSubscribed ? colors.successBg : colors.dangerBg,
                borderColor:     user?.isSubscribed ? colors.success + '40' : colors.danger + '40',
              },
            ]}
          >
            <Text style={styles.statusIcon}>{user?.isSubscribed ? '✅' : '🔒'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusTitle, { color: user?.isSubscribed ? colors.success : colors.danger }]}>
                {user?.isSubscribed ? 'Subscription Active' : 'Not Subscribed'}
              </Text>
              <Text style={[styles.statusSub, { color: colors.textSecondary }]}>
                {user?.isSubscribed
                  ? 'Your phone number is visible to customers.'
                  : 'Subscribe to make your contact visible.'}
              </Text>
            </View>
          </View>
        </SectionCard>

        {/* Settings shortcut */}
        <TouchableOpacity
          style={[styles.settingsBtn, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={() => navigation.navigate('Settings')}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
          <Text style={[styles.settingsBtnText, { color: colors.text }]}>Settings & Profile</Text>
          <Text style={[styles.chevron, { color: colors.textMuted }]}>›</Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.dangerBg, borderColor: colors.danger + '40' }]}
          onPress={() => dispatch(logout())}
          activeOpacity={0.8}
        >
          <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function SectionCard({ title, children, colors }) {
  return (
    <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {title && (
        <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
      )}
      {children}
    </View>
  );
}

function InfoRow({ label, value, colors, last }) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderSoft }]}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    alignItems:        'center',
    paddingTop:        36,
    paddingBottom:     32,
    paddingHorizontal: 24,
  },
  avatarRing: {
    width:         96,
    height:        96,
    borderRadius:  48,
    borderWidth:   2,
    alignItems:    'center',
    justifyContent: 'center',
    marginBottom:  16,
  },
  avatar: {
    width:         80,
    height:        80,
    borderRadius:  40,
    borderWidth:   1.5,
    alignItems:    'center',
    justifyContent: 'center',
  },
  avatarText:   { fontSize: 34, fontWeight: '800' },
  name:         { fontSize: 22, fontWeight: '700', marginBottom: 8, letterSpacing: -0.3 },
  rolePill:     { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  rolePillText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },

  content: { paddingHorizontal: 16 },

  section: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      16,
    marginTop:    12,
  },
  sectionTitle: {
    fontSize:      10,
    fontWeight:    '700',
    letterSpacing: 1.2,
    marginBottom:  12,
  },
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '500' },

  statusCard: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           12,
    borderRadius:  10,
    borderWidth:   1,
    padding:       14,
  },
  statusIcon:  { fontSize: 20, marginTop: 1 },
  statusTitle: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  statusSub:   { fontSize: 12, lineHeight: 17 },

  settingsBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    borderRadius:   16,
    borderWidth:    1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop:      12,
    gap:            10,
  },
  settingsIcon:    { fontSize: 20 },
  settingsBtnText: { flex: 1, fontSize: 15, fontWeight: '500' },
  chevron:         { fontSize: 22, fontWeight: '300' },

  logoutBtn: {
    borderRadius:   16,
    borderWidth:    1,
    paddingVertical: 15,
    alignItems:     'center',
    marginTop:      12,
  },
  logoutText: { fontWeight: '700', fontSize: 15 },
});
