import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProviderCard({ provider, onPress }) {
  const { name, service, area, experience, rating, isSubscribed, phone } = provider;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header row */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name?.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.service}>{service}</Text>
        </View>
        {rating != null && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ {rating}</Text>
          </View>
        )}
      </View>

      {/* Details row */}
      <View style={styles.detailRow}>
        <Text style={styles.detail}>📍 {area}</Text>
        <Text style={styles.detail}>🔧 {experience} yrs exp</Text>
      </View>

      {/* Phone / Locked */}
      <View style={styles.phoneRow}>
        {isSubscribed ? (
          <View style={styles.phoneBox}>
            <Text style={styles.phoneText}>📞 {phone}</Text>
          </View>
        ) : (
          <View style={styles.lockedBox}>
            <Text style={styles.lockedText}>🔒 Contact Locked</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 20, fontWeight: '700', color: '#2563EB' },
  info: { flex: 1 },
  name: { fontSize: 16, fontWeight: '600', color: '#1E293B' },
  service: {
    fontSize: 13,
    color: '#64748B',
    textTransform: 'capitalize',
    marginTop: 2,
  },
  ratingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: { fontSize: 12, color: '#92400E', fontWeight: '600' },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detail: { fontSize: 13, color: '#64748B' },
  phoneRow: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  phoneBox: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  phoneText: { color: '#065F46', fontWeight: '600', fontSize: 14 },
  lockedBox: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  lockedText: { color: '#94A3B8', fontWeight: '500', fontSize: 14 },
});
