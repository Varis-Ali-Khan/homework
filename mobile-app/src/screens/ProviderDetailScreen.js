import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProviderDetailScreen({ route }) {
  const { provider } = route.params;
  const { name, service, area, experience, rating, isSubscribed, phone } = provider;
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero header */}
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{name?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.service}>{service}</Text>
        {rating != null && (
          <View style={styles.ratingPill}>
            <Text style={styles.ratingText}>⭐ {rating} / 5</Text>
          </View>
        )}
      </View>

      {/* Details section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <DetailRow label="Service" value={service} />
        <DetailRow label="Area" value={area} last />
        <DetailRow label="Experience" value={`${experience} years`} last />
      </View>

      {/* Contact section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact</Text>
        {isSubscribed ? (
          <View style={styles.phoneBox}>
            <Text style={styles.phoneLabel}>Phone Number</Text>
            <Text style={styles.phoneValue}>📞 {phone}</Text>
          </View>
        ) : (
          <View style={styles.lockedBox}>
            <Text style={styles.lockedIcon}>🔒</Text>
            <Text style={styles.lockedTitle}>Contact Locked</Text>
            <Text style={styles.lockedSub}>
              This provider has not subscribed yet. Phone number will appear once they subscribe.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value, last }) {
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
  service: {
    fontSize: 15,
    color: '#BFDBFE',
    textTransform: 'capitalize',
    marginBottom: 10,
  },
  ratingPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  ratingText: { color: '#FEF3C7', fontWeight: '600', fontSize: 14 },
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
  rowValue: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  phoneBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    padding: 16,
  },
  phoneLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#064E3B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  phoneValue: { color: '#065F46', fontSize: 20, fontWeight: '700' },
  lockedBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  lockedIcon: { fontSize: 32, marginBottom: 8 },
  lockedTitle: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  lockedSub: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
