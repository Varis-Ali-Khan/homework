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
import { fetchProvidersRequest } from '../redux/providers/providerSlice';
import { useTheme } from '../context/ThemeContext';

export default function HomeScreen({ navigation }) {
  const [search, setSearch]       = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const dispatch                  = useDispatch();
  const { list: providers, loading } = useSelector((state) => state.providers);
  const insets                    = useSafeAreaInsets();
  const { colors }                = useTheme();

  useEffect(() => {
    dispatch(fetchProvidersRequest({}));
  }, [dispatch]);

  useEffect(() => {
    if (!loading) setRefreshing(false);
  }, [loading]);

  const handleSearch  = () => dispatch(fetchProvidersRequest({ search: search.trim() }));
  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(fetchProvidersRequest({ search: search.trim() }));
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.center, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.bg, paddingBottom: insets.bottom }]}>
      {/* Search bar */}
      <View style={[styles.searchRow, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.surface2, color: colors.text }]}
          placeholder="Search by service (plumber, electrician...)"
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          placeholderTextColor={colors.placeholder}
        />
        <TouchableOpacity
          style={[styles.searchBtn, { backgroundColor: colors.accent }]}
          onPress={handleSearch}
        >
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
            colors={[colors.accent]}
            tintColor={colors.accent}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No providers found</Text>
            <Text style={[styles.emptySubText, { color: colors.textMuted }]}>Try a different search term</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1 },
  center:       { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchRow: {
    flexDirection:     'row',
    paddingHorizontal: 16,
    paddingVertical:   12,
    borderBottomWidth: 1,
    gap:               8,
  },
  searchInput: {
    flex:              1,
    borderRadius:      10,
    paddingHorizontal: 14,
    paddingVertical:   10,
    fontSize:          14,
  },
  searchBtn: {
    paddingHorizontal: 16,
    borderRadius:      10,
    justifyContent:    'center',
  },
  searchBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  list:          { padding: 16, paddingBottom: 24 },
  empty:         { alignItems: 'center', paddingTop: 80 },
  emptyIcon:     { fontSize: 40, marginBottom: 12 },
  emptyText:     { fontSize: 17, fontWeight: '600', marginBottom: 4 },
  emptySubText:  { fontSize: 14 },
});
