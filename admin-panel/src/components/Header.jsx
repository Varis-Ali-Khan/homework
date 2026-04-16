import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../redux/auth/authSlice';

const PAGE_TITLES = {
  '/':          'Dashboard',
  '/users':     'Users',
  '/providers': 'Providers',
};

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="header">
      <h1 className="header-title">{PAGE_TITLES[pathname] || 'Admin'}</h1>
      <div className="header-right">
        {user && <span className="header-user">👤 {user.name || 'Admin'}</span>}
        <button className="btn-logout" onClick={handleLogout}>Logout</button>
      </div>
    </header>
  );
}
