import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

export default function ProviderDetailScreen({ route }) {
  const { provider } = route.params;
  const { name, service, area, experience, rating, isSubscribed, phone } = provider;
  const insets     = useSafeAreaInsets();
  const { colors } = useTheme();

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
              {name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
        <Text style={[styles.service, { color: colors.accent }]}>{service}</Text>
        {rating != null && (
          <View style={[styles.ratingPill, { backgroundColor: colors.accent + '22' }]}>
            <Text style={[styles.ratingText, { color: colors.accent }]}>⭐ {rating} / 5</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        {/* Details */}
        <SectionCard title="DETAILS" colors={colors}>
          <DetailRow label="Service"    value={service}              colors={colors} />
          <DetailRow label="Area"       value={area}                 colors={colors} />
          <DetailRow label="Experience" value={`${experience} yrs`}  colors={colors} last />
        </SectionCard>

        {/* Contact */}
        <SectionCard title="CONTACT" colors={colors}>
          {isSubscribed ? (
            <View style={[styles.phoneBox, { backgroundColor: colors.successBg, borderColor: colors.success + '40' }]}>
              <Text style={[styles.phoneLabel, { color: colors.success }]}>PHONE NUMBER</Text>
              <Text style={[styles.phoneValue, { color: colors.success }]}>📞 {phone}</Text>
            </View>
          ) : (
            <View style={[styles.lockedBox, { backgroundColor: colors.surface2 }]}>
              <Text style={styles.lockedIcon}>🔒</Text>
              <Text style={[styles.lockedTitle, { color: colors.textSecondary }]}>Contact Locked</Text>
              <Text style={[styles.lockedSub, { color: colors.textMuted }]}>
                This provider hasn't subscribed yet. Their number appears once they subscribe.
              </Text>
            </View>
          )}
        </SectionCard>
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

function DetailRow({ label, value, colors, last }) {
  return (
    <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.borderSoft }]}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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
  avatarText: { fontSize: 34, fontWeight: '800' },
  name:       { fontSize: 22, fontWeight: '700', marginBottom: 4, letterSpacing: -0.3 },
  service:    { fontSize: 14, textTransform: 'capitalize', marginBottom: 10, fontWeight: '500' },
  ratingPill: { paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20 },
  ratingText: { fontWeight: '600', fontSize: 13 },

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
  rowValue: { fontSize: 14, fontWeight: '500', textTransform: 'capitalize' },

  phoneBox: {
    borderRadius: 10,
    borderWidth:  1,
    padding:      16,
  },
  phoneLabel: {
    fontSize:      10,
    fontWeight:    '700',
    letterSpacing: 0.8,
    marginBottom:  6,
  },
  phoneValue: { fontSize: 20, fontWeight: '700' },

  lockedBox: {
    borderRadius: 10,
    padding:      20,
    alignItems:   'center',
  },
  lockedIcon:  { fontSize: 30, marginBottom: 8 },
  lockedTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  lockedSub:   { fontSize: 13, textAlign: 'center', lineHeight: 18 },
});
