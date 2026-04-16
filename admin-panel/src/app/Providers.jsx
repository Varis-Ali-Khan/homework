import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProviders,
  toggleSubscription,
  deleteProvider,
} from '../redux/providers/providersSlice';

export default function Providers() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.providers);

  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  const handleToggle = (id) => dispatch(toggleSubscription(id));

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete provider profile for "${name}"?`)) {
      dispatch(deleteProvider(id));
    }
  };

  if (loading) return <div className="loading">Loading providers...</div>;
  if (error)   return <div className="alert-error">{error}</div>;

  return (
    <div className="table-card">
      <div className="table-header">{list.length} providers</div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Service</th>
            <th>Area</th>
            <th>Exp (yrs)</th>
            <th>Profile</th>
            <th>Subscription</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {list.map((p) => (
            <tr key={p._id}>
              <td>{p.name  || p.user?.name  || '—'}</td>
              <td>{p.phone || p.user?.phone || '—'}</td>
              <td>{p.service    || '—'}</td>
              <td>{p.area       || '—'}</td>
              <td>{p.experience ?? '—'}</td>
              <td>
                <span className={`badge ${p.isProfileComplete ? 'badge-provider' : 'badge-customer'}`}>
                  {p.isProfileComplete ? 'Complete' : 'Incomplete'}
                </span>
              </td>
              <td>
                <button
                  className={`btn-toggle${p.isSubscribed ? ' btn-toggle-active' : ''}`}
                  onClick={() => handleToggle(p._id)}
                >
                  {p.isSubscribed ? 'Active' : 'Inactive'}
                </button>
              </td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(p._id, p.name || p.user?.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && <div className="empty">No providers found.</div>}
    </div>
  );
}
