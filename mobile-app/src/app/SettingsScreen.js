import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/auth/authSlice';
import { useTheme } from '../context/ThemeContext';

// ── Animated toggle switch ────────────────────────────
function ThemeToggle({ isDark, onToggle }) {
  const translateX = useRef(new Animated.Value(isDark ? 28 : 2)).current;
  const trackColor = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: isDark ? 28 : 2,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(trackColor, {
        toValue: isDark ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isDark]);

  const bgColor = trackColor.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#CBD5E1', '#3B82F6'],
  });

  return (
    <TouchableOpacity onPress={onToggle} activeOpacity={0.85}>
      <Animated.View style={[styles.toggleTrack, { backgroundColor: bgColor }]}>
        <Animated.View
          style={[styles.toggleThumb, { transform: [{ translateX }] }]}
        >
          <Text style={styles.thumbEmoji}>{isDark ? '🌙' : '☀️'}</Text>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
  );
}

// ── Row helpers ───────────────────────────────────────
function InfoRow({ label, value, colors, last }) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderSoft }]}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value || '—'}</Text>
    </View>
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

// ── Main screen ───────────────────────────────────────
export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const initial = user?.name?.charAt(0).toUpperCase() || '?';
  const roleBadge = user?.role === 'provider' ? 'Service Provider' : 'Customer';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Hero: avatar + name ──────────────────────── */}
      <View style={[styles.hero, { backgroundColor: colors.heroBg }]}>
        {/* Decorative ring behind avatar */}
        <View style={[styles.avatarRing, { borderColor: colors.accent + '50' }]}>
          <View style={[styles.avatar, { backgroundColor: colors.accent + '22', borderColor: colors.accent }]}>
            <Text style={[styles.avatarText, { color: colors.accent }]}>{initial}</Text>
          </View>
        </View>

        <Text style={[styles.heroName, { color: colors.text }]}>
          {user?.name || 'User'}
        </Text>
        <View style={[styles.rolePill, { backgroundColor: colors.accent + '22' }]}>
          <Text style={[styles.rolePillText, { color: colors.accent }]}>{roleBadge}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* ── Account info ─────────────────────────── */}
        <SectionCard title="ACCOUNT" colors={colors}>
          <InfoRow label="Name"  value={user?.name}  colors={colors} />
          <InfoRow label="Phone" value={user?.phone} colors={colors} />
          <InfoRow label="Role"  value={roleBadge}   colors={colors} last />
        </SectionCard>

        {/* ── Subscription ─────────────────────────── */}
        {user?.role === 'provider' && (
          <SectionCard title="SUBSCRIPTION" colors={colors}>
            <View
              style={[
                styles.subCard,
                {
                  backgroundColor: user?.isSubscribed ? colors.successBg : colors.dangerBg,
                  borderColor:     user?.isSubscribed ? colors.success + '40' : colors.danger + '40',
                },
              ]}
            >
              <Text style={styles.subIcon}>{user?.isSubscribed ? '✅' : '🔒'}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.subTitle, { color: user?.isSubscribed ? colors.success : colors.danger }]}>
                  {user?.isSubscribed ? 'Subscription Active' : 'Not Subscribed'}
                </Text>
                <Text style={[styles.subSub, { color: colors.textSecondary }]}>
                  {user?.isSubscribed
                    ? 'Your contact is visible to customers.'
                    : 'Subscribe to show your contact info.'}
                </Text>
              </View>
            </View>
          </SectionCard>
        )}

        {/* ── Appearance ───────────────────────────── */}
        <SectionCard title="APPEARANCE" colors={colors}>
          <View style={styles.themeRow}>
            <View style={styles.themeLeft}>
              <Text style={styles.themeIcon}>{isDark ? '🌙' : '☀️'}</Text>
              <View>
                <Text style={[styles.themeLabel, { color: colors.text }]}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text style={[styles.themeSub, { color: colors.textMuted }]}>
                  {isDark ? 'Easy on the eyes at night' : 'Clear and bright'}
                </Text>
              </View>
            </View>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          </View>
        </SectionCard>

        {/* ── App info ─────────────────────────────── */}
        <SectionCard title="APP" colors={colors}>
          <InfoRow label="App Name" value="homework"  colors={colors} />
          <InfoRow label="Version"  value="1.0.0"     colors={colors} last />
        </SectionCard>

        {/* ── Logout ───────────────────────────────── */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: colors.dangerBg, borderColor: colors.danger + '40' }]}
          onPress={() => dispatch(logout())}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={[styles.logoutText, { color: colors.danger }]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    alignItems:      'center',
    paddingTop:      40,
    paddingBottom:   32,
    paddingHorizontal: 24,
  },
  avatarRing: {
    width:        96,
    height:       96,
    borderRadius: 48,
    borderWidth:  2,
    alignItems:   'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatar: {
    width:        80,
    height:       80,
    borderRadius: 40,
    borderWidth:  1.5,
    alignItems:   'center',
    justifyContent: 'center',
  },
  avatarText:  { fontSize: 34, fontWeight: '800' },
  heroName:    { fontSize: 22, fontWeight: '700', marginBottom: 8, letterSpacing: -0.3 },
  rolePill: {
    paddingHorizontal: 14,
    paddingVertical:   5,
    borderRadius:      20,
  },
  rolePillText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.4 },

  // Content
  content: { paddingHorizontal: 16 },

  // Section card
  section: {
    borderRadius: 16,
    borderWidth:  1,
    padding:      16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize:      10,
    fontWeight:    '700',
    letterSpacing: 1.2,
    marginBottom:  12,
  },

  // Info rows
  row: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingVertical: 10,
  },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '500' },

  // Subscription card
  subCard: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           12,
    borderRadius:  10,
    borderWidth:   1,
    padding:       14,
  },
  subIcon:  { fontSize: 20, marginTop: 1 },
  subTitle: { fontSize: 14, fontWeight: '600', marginBottom: 3 },
  subSub:   { fontSize: 12, lineHeight: 17 },

  // Theme toggle row
  themeRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           12,
    flex:          1,
  },
  themeIcon:  { fontSize: 26 },
  themeLabel: { fontSize: 15, fontWeight: '600' },
  themeSub:   { fontSize: 12, marginTop: 2 },

  // Animated toggle
  toggleTrack: {
    width:         58,
    height:        32,
    borderRadius:  16,
    justifyContent: 'center',
  },
  toggleThumb: {
    width:        28,
    height:       28,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems:   'center',
    justifyContent: 'center',
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation:    3,
  },
  thumbEmoji: { fontSize: 14 },

  // Logout
  logoutBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
    borderRadius:   16,
    borderWidth:    1,
    paddingVertical: 15,
    marginTop:      4,
  },
  logoutIcon: { fontSize: 18 },
  logoutText: { fontWeight: '700', fontSize: 15 },
});
