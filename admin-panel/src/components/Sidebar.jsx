import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',          label: 'Dashboard', icon: '📊' },
  { to: '/users',     label: 'Users',     icon: '👥' },
  { to: '/providers', label: 'Providers', icon: '🔧' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-icon">⚙️</span>
        <span className="logo-text">Admin Panel</span>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
