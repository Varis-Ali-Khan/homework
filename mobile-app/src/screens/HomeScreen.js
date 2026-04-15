import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProviderCard from '../components/ProviderCard';
import { fetchProvidersRequest } from '../features/providers/providerSlice';
import { logout } from '../features/auth/authSlice';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { list: providers, loading } = useSelector((state) => state.providers);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    dispatch(fetchProvidersRequest({}));
  }, [dispatch]);

  // Stop refreshing spinner when loading finishes
  useEffect(() => {
    if (!loading) setRefreshing(false);
  }, [loading]);

  const handleSearch = () => dispatch(fetchProvidersRequest({ search: search.trim() }));

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProvidersRequest({ search: search.trim() }));
  };

  // Set logout button in header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => dispatch(logout())} style={{ marginRight: 4 }}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500' }}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, dispatch]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {/* Search bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by service (plumber, electrician...)"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>Search</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={providers}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={({ item }) => (
          <ProviderCard
            provider={item}
            onPress={() => navigation.navigate('ProviderDetail', { provider: item })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No providers found</Text>
            <Text style={styles.emptySubText}>Try a different search term</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
  },
  searchBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    borderRadius: 10,
    justifyContent: 'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  list: { padding: 16, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: '#475569', fontSize: 17, fontWeight: '600', marginBottom: 4 },
  emptySubText: { color: '#94A3B8', fontSize: 14 },
});
