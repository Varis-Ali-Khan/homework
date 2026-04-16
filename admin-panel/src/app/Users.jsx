import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, deleteUser } from '../redux/users/usersSlice';

export default function Users() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete user "${name}"? This also removes their provider profile.`)) {
      dispatch(deleteUser(id));
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error)   return <div className="alert-error">{error}</div>;

  return (
    <div className="table-card">
      <div className="table-header">{list.length} users</div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.phone}</td>
              <td>
                <span className={`badge badge-${user.role}`}>{user.role}</span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(user._id, user.name)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {list.length === 0 && <div className="empty">No users found.</div>}
    </div>
  );
}
