import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../redux/providers/providersSlice';

function StatCard({ label, value, icon, color }) {
  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">{value ?? '—'}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.providers);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total Users"         value={stats?.totalUsers}          icon="👥" color="#2563EB" />
        <StatCard label="Customers"           value={stats?.totalCustomers}      icon="🧑" color="#10B981" />
        <StatCard label="Providers"           value={stats?.totalProviders}      icon="🔧" color="#F59E0B" />
        <StatCard label="Subscribed Providers" value={stats?.subscribedProviders} icon="✅" color="#8B5CF6" />
      </div>
    </div>
  );
}
