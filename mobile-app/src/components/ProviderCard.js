import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function ProviderCard({ provider, onPress }) {
  const { name, service, area, experience, rating, isSubscribed, phone } = provider;
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border, shadowColor: colors.shadow }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Header row */}
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.accentBg }]}>
          <Text style={[styles.avatarText, { color: colors.accent }]}>
            {name?.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
          <Text style={[styles.service, { color: colors.textSecondary }]}>{service}</Text>
        </View>
        {rating != null && (
          <View style={[styles.ratingBadge, { backgroundColor: colors.accentBg }]}>
            <Text style={[styles.ratingText, { color: colors.accent }]}>⭐ {rating}</Text>
          </View>
        )}
      </View>

      {/* Details row */}
      <View style={styles.detailRow}>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>📍 {area}</Text>
        <Text style={[styles.detail, { color: colors.textSecondary }]}>🔧 {experience} yrs exp</Text>
      </View>

      {/* Phone / Locked */}
      <View style={[styles.phoneRow, { borderTopColor: colors.borderSoft }]}>
        {isSubscribed ? (
          <View style={[styles.phoneBox, { backgroundColor: colors.successBg }]}>
            <Text style={[styles.phoneText, { color: colors.success }]}>📞 {phone}</Text>
          </View>
        ) : (
          <View style={[styles.lockedBox, { backgroundColor: colors.surface2 }]}>
            <Text style={[styles.lockedText, { color: colors.textMuted }]}>🔒 Contact Locked</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius:  14,
    borderWidth:   1,
    padding:       16,
    marginBottom:  12,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  8,
    elevation:     3,
  },
  header: {
    flexDirection: 'row',
    alignItems:    'center',
    marginBottom:  12,
  },
  avatar: {
    width:         46,
    height:        46,
    borderRadius:  23,
    justifyContent: 'center',
    alignItems:    'center',
    marginRight:   12,
  },
  avatarText: { fontSize: 20, fontWeight: '700' },
  info:       { flex: 1 },
  name:       { fontSize: 16, fontWeight: '600' },
  service: {
    fontSize:      13,
    textTransform: 'capitalize',
    marginTop:     2,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      8,
  },
  ratingText: { fontSize: 12, fontWeight: '600' },
  detailRow: {
    flexDirection: 'row',
    gap:           16,
    marginBottom:  12,
  },
  detail: { fontSize: 13 },
  phoneRow: {
    borderTopWidth: 1,
    paddingTop:     10,
  },
  phoneBox: {
    paddingVertical:   8,
    paddingHorizontal: 14,
    borderRadius:      8,
    alignSelf:         'flex-start',
  },
  phoneText: { fontWeight: '600', fontSize: 14 },
  lockedBox: {
    paddingVertical:   8,
    paddingHorizontal: 14,
    borderRadius:      8,
    alignSelf:         'flex-start',
  },
  lockedText: { fontWeight: '500', fontSize: 14 },
});
