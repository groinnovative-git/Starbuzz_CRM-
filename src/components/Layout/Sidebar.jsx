// Sidebar.jsx — Premium role-based sidebar with mobile drawer support

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Drawer, useMediaQuery, useTheme } from '@mui/material';
import { authService } from '../../services/authService';
import {
  LayoutDashboard, Users, UserPlus, FileText, FolderCheck, LifeBuoy,
  Wallet, BarChart3, Settings, BookOpen, LogOut, User, FilePlus,
  ClipboardList, FileSearch, Upload, TicketCheck, IndianRupee,
  ChevronLeft, ChevronRight, ShieldCheck, Megaphone
} from 'lucide-react';

const adminMenu = [
  { section: 'Overview' },
  { text: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { section: 'CRM' },
  { text: 'Leads', icon: <UserPlus size={18} />, path: '/leads' },
  { text: 'Customers', icon: <Users size={18} />, path: '/customers' },
  { section: 'Loan Processing' },
  { text: 'Applications', icon: <FileText size={18} />, path: '/applications' },
  { text: 'Documents', icon: <FolderCheck size={18} />, path: '/documents' },
  { text: 'Collections', icon: <IndianRupee size={18} />, path: '/collections' },
  { section: 'Support' },
  { text: 'Support Tickets', icon: <LifeBuoy size={18} />, path: '/tickets' },
  { section: 'Administration' },
  { text: 'Announcements', icon: <Megaphone size={18} />, path: '/announcements' },
  { text: 'Reports', icon: <BarChart3 size={18} />, path: '/reports' },
  { text: 'Users', icon: <Users size={18} />, path: '/users' },
  { text: 'Roles & Permissions', icon: <ShieldCheck size={18} />, path: '/roles' },
  { text: 'Settings', icon: <Settings size={18} />, path: '/settings' },
  { text: 'Demo Guide', icon: <BookOpen size={18} />, path: '/demo-guide' },
];

const salesMenu = [
  { section: 'Overview' },
  { text: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { section: 'CRM' },
  { text: 'Leads', icon: <UserPlus size={18} />, path: '/leads' },
  { text: 'Customers', icon: <Users size={18} />, path: '/customers' },
  { section: 'Loan' },
  { text: 'Applications', icon: <FileText size={18} />, path: '/applications' },
  { text: 'Documents', icon: <FolderCheck size={18} />, path: '/documents' },
  { section: 'Support' },
  { text: 'Support Tickets', icon: <LifeBuoy size={18} />, path: '/tickets' },
];

const officerMenu = [
  { section: 'Overview' },
  { text: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/dashboard' },
  { section: 'CRM' },
  { text: 'Leads', icon: <UserPlus size={18} />, path: '/leads' },
  { text: 'Customers', icon: <Users size={18} />, path: '/customers' },
  { section: 'Loan Processing' },
  { text: 'Applications', icon: <FileText size={18} />, path: '/applications' },
  { text: 'Documents', icon: <FolderCheck size={18} />, path: '/documents' },
  { text: 'Collections', icon: <IndianRupee size={18} />, path: '/collections' },
  { section: 'Support' },
  { text: 'Support Tickets', icon: <LifeBuoy size={18} />, path: '/tickets' },
];

const customerMenu = [
  { section: 'Home' },
  { text: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/portal' },
  { text: 'My Profile', icon: <User size={18} />, path: '/portal/profile' },
  { section: 'Loan Services' },
  { text: 'Apply Loan', icon: <FilePlus size={18} />, path: '/portal/apply' },
  { text: 'My Applications', icon: <ClipboardList size={18} />, path: '/portal/applications' },
  { text: 'Track Application', icon: <FileSearch size={18} />, path: '/portal/tracking' },
  { section: 'Documents' },
  { text: 'My Documents', icon: <FolderCheck size={18} />, path: '/portal/documents' },
  { text: 'Upload Documents', icon: <Upload size={18} />, path: '/portal/upload' },
  { section: 'Support' },
  { text: 'Support Tickets', icon: <TicketCheck size={18} />, path: '/portal/tickets' },
];

const menuMap = { admin: adminMenu, sales: salesMenu, officer: officerMenu, customer: customerMenu };
const roleLabels = { admin: 'Super Admin', sales: 'Sales Officer', officer: 'Loan Officer', customer: 'Customer' };

const SidebarContent = ({ user, onClose, isMobile, isCollapsed, onToggleCollapse }) => {
  const navigate = useNavigate();
  const menu = menuMap[user.role] || [];
  console.log("Sidebar rendering for role:", user.role, "Menu length:", menu.length);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">SB</div>
        {!isCollapsed && (
          <div>
            <h2>Star Buzz</h2>
            <small>Loan CRM</small>
          </div>
        )}
        {!isMobile && (
          <div 
            className="sidebar-collapse-btn" 
            onClick={onToggleCollapse}
            style={{ marginLeft: isCollapsed ? '0' : 'auto', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </div>
        )}
      </div>

      <nav className="sidebar-nav">
        {menu.map((item, i) => {
          if (item.section) {
            if (isCollapsed) return <div key={i} className="sidebar-section-divider" />;
            return <div key={i} className="sidebar-section-title">{item.section}</div>;
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/portal' || item.path === '/dashboard'}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => isMobile && onClose?.()}
              title={isCollapsed ? item.text : ''}
            >
              {item.icon}
              {!isCollapsed && <span>{item.text}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {!isCollapsed && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{user.name?.charAt(0) || 'U'}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{roleLabels[user.role] || user.role}</div>
            </div>
          </div>
        )}
        <div className="sidebar-nav-item" onClick={handleLogout} style={{ marginTop: 4, cursor: 'pointer', justifyContent: isCollapsed ? 'center' : 'flex-start' }} title={isCollapsed ? "Sign Out" : ""}>
          <LogOut size={18} />
          {!isCollapsed && <span>Sign Out</span>}
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ mobileOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const user = authService.getCurrentUser() || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Drawer
        open={mobileOpen}
        onClose={onClose}
        sx={{ '& .MuiDrawer-paper': { width: 260, border: 'none', background: 'transparent' } }}
      >
        <SidebarContent user={user} onClose={onClose} isMobile={true} isCollapsed={false} />
      </Drawer>
    );
  }

  return <SidebarContent user={user} onClose={onClose} isMobile={false} isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />;
};

export default Sidebar;
