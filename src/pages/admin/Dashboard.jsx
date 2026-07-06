// Dashboard.jsx — Full premium role-based dashboard

import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import {
  UserPlus, Users, FileText, CheckCircle, XCircle, Wallet, IndianRupee,
  LifeBuoy, FolderCheck, TrendingUp, Clock, AlertTriangle, CalendarCheck,
  ArrowRight, FilePlus, Upload, TicketCheck
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import PageHeader from '../../components/Common/PageHeader';
import StatusBadge from '../../components/Common/StatusBadge';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3B82F6', '#00BFA5', '#F59E0B', '#EF4444', '#8B5CF6', '#10B981', '#EC4899'];

/* Brand-aligned chart palette */
const CHART_COLORS = ['#1B3A6B', '#0E7C7B', '#F59E0B', '#EF4444', '#3D5A8C', '#2A9D8F', '#94A3B8'];

/* Semantic collection chart colors: Paid=teal, Partial=amber, Overdue=red, Pending=navy-muted */
const COLLECTION_COLORS = ['#0E7C7B', '#F59E0B', '#EF4444', '#94A3B8'];

/* ── Sub-components (StatCard retained for sales/officer views) ── */

const StatCard = ({ label, value, icon, colorClass, sub }) => (
  <div className={`stat-card ${colorClass}`}>
    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
      <Box>
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value ?? '—'}</div>
        {sub && <div className="stat-card-trend" style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 6 }}>{sub}</div>}
      </Box>
      <div className="stat-card-icon">{icon}</div>
    </Box>
  </div>
);

/* Custom bar chart value label */
const renderBarLabel = (props) => {
  const { x, y, width, value } = props;
  if (!value) return null;
  return (
    <text x={x + width / 2} y={y - 8} fill="#1E293B" textAnchor="middle"
      fontSize={12} fontWeight={700}>{value}</text>
  );
};

/* Custom bar chart tooltip */
const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', padding: '10px 14px', borderRadius: 10,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)', border: '1px solid #E2E8F0'
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#0E7C7B' }}>{payload[0].value}</div>
    </div>
  );
};

const Dashboard = () => {
  const user = authService.getCurrentUser() || {};
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [pendingActions, setPendingActions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const s = reportService.getDashboardStats();
    setStats(s);

    const apps = storageService.get('applications') || [];
    setRecentApps(apps.slice(0, 5));

    const pending = [];
    apps.filter(a => a.status === 'Document Verified').forEach(a =>
      pending.push({ type: 'Approve', label: `Review application ${a.id} — ${a.customerName}`, color: 'var(--success)' })
    );
    apps.filter(a => a.status === 'Document Pending').forEach(a =>
      pending.push({ type: 'Docs', label: `Collect documents for ${a.customerName}`, color: 'var(--warning)' })
    );
    const tickets = storageService.get('tickets') || [];
    tickets.filter(t => t.status === 'Open').slice(0, 3).forEach(t =>
      pending.push({ type: 'Ticket', label: `Open ticket: ${t.subject || t.category}`, color: 'var(--error)' })
    );
    setPendingActions(pending.slice(0, 8));
  }, []);

  if (!stats) return <Box sx={{ p: 4, color: 'var(--text-muted)' }}>Loading dashboard...</Box>;

  const getRoleLabel = () => {
    const m = { admin: 'Super Admin', officer: 'Loan Officer', sales: 'Sales Officer' };
    return m[user.role] || 'Admin';
  };

  const adminChartData = {
    appStatus: [
      { name: 'New', value: stats.applications.new },
      { name: 'Review', value: stats.applications.underReview },
      { name: 'Doc Pending', value: stats.applications.docPending },
      { name: 'Doc Verified', value: stats.applications.docVerified },
      { name: 'Approved', value: stats.applications.approved },
      { name: 'Rejected', value: stats.applications.rejected },
      { name: 'Disbursed', value: stats.applications.disbursed },
    ].filter(d => d.value > 0),
    collections: [
      { name: 'Paid', value: stats.collections.paid },
      { name: 'Partial', value: stats.collections.partial },
      { name: 'Overdue', value: stats.collections.overdue },
      { name: 'Pending', value: stats.collections.pending },
    ].filter(d => d.value > 0),
  };

  const totalEMIs = stats.collections.total;

  return (
    <Box>
      <PageHeader
        title={`${getRoleLabel()} Dashboard`}
        subtitle={`Welcome back, ${user.name}. Here's your current overview.`}
      />

      {/* ── Dashboard — Asymmetric 8+4 Grid (Universal) ── */}
      <>
          {/* Hero Banner */}
          <div className="db-hero" style={{ marginBottom: 20 }}>
            <div className="db-hero-primary">
              <div className="db-hero-label">Total Loan Value</div>
              <div className="db-hero-value">₹{(stats.applications.totalLoanValue / 10000000).toFixed(1)}Cr</div>
              <div className="db-hero-sub">₹{(stats.applications.totalApprovedValue / 10000000).toFixed(1)}Cr approved pipeline</div>
            </div>
            <div className="db-hero-divider" />
            <div className="db-hero-secondary">
              <div className="db-hero-stat">
                <span className="db-hero-stat-label">
                  <FileText size={14} color="#0E7C7B" /> Applications
                </span>
                <span className="db-hero-stat-value">{stats.applications.total}</span>
                <span className="db-hero-stat-sub">{stats.applications.pending} pending review</span>
              </div>
              <div className="db-hero-divider" />
              <div className="db-hero-stat critical">
                <span className="db-hero-stat-label">
                  <AlertTriangle size={14} color="#EF4444" /> Overdue EMIs
                </span>
                <span className="db-hero-stat-value">{stats.collections.overdue}</span>
                <span className="db-hero-stat-sub">₹{(stats.collections.totalDue / 100000).toFixed(1)}L total due</span>
              </div>
            </div>
          </div>

          {/* Stat Strip */}
          <div className="db-stat-strip" style={{ marginBottom: 20 }}>
            <div className="db-stat-strip-item">
              <div className="db-stat-strip-icon"><UserPlus size={18} color="#1B3A6B" /></div>
              <div className="db-stat-strip-content">
                <div className="db-stat-strip-label">Leads</div>
                <div className="db-stat-strip-value">{stats.leads.total}</div>
                <div className="db-stat-strip-sub">{stats.leads.new} new</div>
              </div>
            </div>
            <div className="db-stat-strip-item">
              <div className="db-stat-strip-icon"><TrendingUp size={18} color="#0E7C7B" /></div>
              <div className="db-stat-strip-content">
                <div className="db-stat-strip-label">Converted</div>
                <div className="db-stat-strip-value">{stats.leads.converted}</div>
              </div>
            </div>
            <div className="db-stat-strip-item">
              <div className="db-stat-strip-icon"><Users size={18} color="#1B3A6B" /></div>
              <div className="db-stat-strip-content">
                <div className="db-stat-strip-label">Customers</div>
                <div className="db-stat-strip-value">{stats.customers.total}</div>
              </div>
            </div>
            <div className="db-stat-strip-item">
              <div className="db-stat-strip-icon"><CheckCircle size={18} color="#0E7C7B" /></div>
              <div className="db-stat-strip-content">
                <div className="db-stat-strip-label">Approved</div>
                <div className="db-stat-strip-value">{stats.applications.approved}</div>
              </div>
            </div>
            <div className="db-stat-strip-item">
              <div className="db-stat-strip-icon"><Wallet size={18} color="#0E7C7B" /></div>
              <div className="db-stat-strip-content">
                <div className="db-stat-strip-label">Disbursed</div>
                <div className="db-stat-strip-value">{stats.applications.disbursed}</div>
              </div>
            </div>
          </div>

          {/* 8+4 Grid: Primary Content + Sidebar Rail */}
          <div className="db-grid">

            {/* ── Left 8-col: Primary Content ── */}
            <div className="db-primary">

              {/* Bar Chart — wider, shorter */}
              <div className="chart-card">
                <div className="chart-title">Application Status Overview</div>
                <div className="chart-subtitle">Distribution of loan applications by current status</div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={adminChartData.appStatus} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} axisLine={{ stroke: '#E2E8F0' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(14,124,123,0.06)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} label={renderBarLabel}>
                      {adminChartData.appStatus.map((entry, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Applications Table */}
              <Card sx={{ borderRadius: 3, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={700} mb={2}>Recent Applications</Typography>
                  <table className="premium-table" style={{ marginBottom: 0 }}>
                    <thead>
                      <tr>
                        <th>App ID</th><th>Customer</th><th>Loan Type</th><th>Amount</th><th className="status-col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApps.map(app => (
                        <tr key={app.id}>
                          <td style={{ fontWeight: 600, color: '#1B3A6B', fontSize: 12, wordBreak: 'break-all', maxWidth: 120 }}>
                            {app.id}
                          </td>
                          <td style={{ minWidth: 100 }}>{app.customerName}</td>
                          <td style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 100 }}>{app.loanType}</td>
                          <td style={{ minWidth: 100 }}>₹{Number(app.requestedAmount).toLocaleString('en-IN')}</td>
                          <td className="status-col" style={{ minWidth: 120 }}><StatusBadge status={app.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Box mt={2} textAlign="right">
                    <Button size="small" endIcon={<ArrowRight size={14} />} onClick={() => navigate('/applications')}
                      sx={{ color: 'var(--accent)', fontWeight: 600, fontSize: 12 }}>
                      View All Applications
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </div>

            {/* ── Right 4-col: Sidebar Rail ── */}
            <div className="db-sidebar">

              {/* Quick Alerts */}
              <div className="db-sidebar-card">
                <div className="db-sidebar-title">Quick Alerts</div>
                <div className="db-alert-row">
                  <div className="db-alert-icon"><XCircle size={16} color="#EF4444" /></div>
                  <span className="db-alert-label">Rejected</span>
                  <span className="db-alert-value critical">{stats.applications.rejected}</span>
                </div>
                <div className="db-alert-row">
                  <div className="db-alert-icon"><FolderCheck size={16} color="#F59E0B" /></div>
                  <span className="db-alert-label">Pending Docs</span>
                  <span className="db-alert-value amber">{stats.documents.pending}</span>
                </div>
                <div className="db-alert-row">
                  <div className="db-alert-icon"><LifeBuoy size={16} color="#F59E0B" /></div>
                  <span className="db-alert-label">Open Tickets</span>
                  <span className="db-alert-value amber">{stats.tickets.open}</span>
                </div>
                <div className="db-alert-row">
                  <div className="db-alert-icon"><CalendarCheck size={16} color="#0E7C7B" /></div>
                  <span className="db-alert-label">EMIs Collected</span>
                  <span className="db-alert-value teal">₹{(stats.collections.totalCollected / 100000).toFixed(1)}L</span>
                </div>
              </div>

              {/* Pending Actions */}
              <div className="db-sidebar-card">
                <div className="db-sidebar-title">Pending Actions</div>
                {pendingActions.length === 0 ? (
                  <Box textAlign="center" py={3} color="var(--text-muted)">
                    <CheckCircle size={28} style={{ opacity: 0.3, marginBottom: 6 }} />
                    <Typography variant="body2" fontSize={12}>All caught up!</Typography>
                  </Box>
                ) : (
                  <div>
                    {pendingActions.map((a, i) => (
                      <div key={i} className="db-action-row">
                        <div className="db-action-dot" style={{ background: a.color }} />
                        <span className="db-action-label">{a.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Collection Status — Donut + Legend Table */}
              <div className="db-sidebar-card">
                <div className="db-sidebar-title">Collection Status</div>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={adminChartData.collections} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {adminChartData.collections.map((_, i) => <Cell key={i} fill={COLLECTION_COLORS[i % COLLECTION_COLORS.length]} />)}
                    </Pie>
                    <text x="50%" y="47%" textAnchor="middle" dominantBaseline="central" className="donut-center-total">{totalEMIs}</text>
                    <text x="50%" y="57%" textAnchor="middle" dominantBaseline="central" className="donut-center-label">Total</text>
                    <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <table className="db-legend-table">
                  <tbody>
                    {adminChartData.collections.map((item, i) => (
                      <tr key={i}>
                        <td style={{ width: 20 }}><span className="db-legend-dot" style={{ background: COLLECTION_COLORS[i] }} /></td>
                        <td className="db-legend-name">{item.name}</td>
                        <td className="db-legend-count">{item.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      </>
    </Box>
  );
};

export default Dashboard;
