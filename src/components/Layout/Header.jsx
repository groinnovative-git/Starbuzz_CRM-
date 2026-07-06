// Header.jsx — App header with breadcrumb, notifications, user avatar

import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Menu, RefreshCw } from 'lucide-react';
import { authService } from '../../services/authService';

const routeLabels = {
  '/dashboard': 'Dashboard',
  '/leads': 'Leads',
  '/customers': 'Customers',
  '/applications': 'Applications',
  '/documents': 'Documents',
  '/collections': 'Collections',
  '/reports': 'Reports',
  '/tickets': 'Support Tickets',
  '/users': 'Users',
  '/settings': 'Settings',
  '/demo-guide': 'Demo Guide',
  '/portal': 'Customer Dashboard',
  '/portal/profile': 'My Profile',
  '/portal/apply': 'Apply Loan',
  '/portal/applications': 'My Applications',
  '/portal/tracking': 'Application Tracking',
  '/portal/documents': 'My Documents',
  '/portal/upload': 'Upload Documents',
  '/portal/tickets': 'Support Tickets',
};

const Header = ({ onMenuToggle }) => {
  const user = authService.getCurrentUser() || {};
  const location = useLocation();
  const pageLabel = routeLabels[location.pathname] || 'Dashboard';

  const getRoleLabel = (role) => {
    const labels = { admin: 'Super Admin', sales: 'Sales Officer', officer: 'Loan Officer', customer: 'Customer' };
    return labels[role] || role;
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="header-menu-btn" onClick={onMenuToggle} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="header-breadcrumb">
          <span>Star Buzz</span>
          <span style={{ color: '#CBD5E1' }}>/</span>
          <strong>{pageLabel}</strong>
        </div>
      </div>

      <div className="header-right">
        <button className="header-icon-btn" title="Notifications">
          <Bell size={18} />
          <div className="header-badge" />
        </button>
        <div
          className="header-avatar"
          title={`${user.name} — ${getRoleLabel(user.role)}`}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, cursor: 'default' }}
        >
          {user.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
};

export default Header;
