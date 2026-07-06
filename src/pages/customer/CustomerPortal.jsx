// CustomerPortal.jsx — Premium Customer Dashboard with News & Offers
import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button, Tabs, Tab, Card, Chip, IconButton } from '@mui/material';
import { 
  FilePlus, ClipboardList, Upload, TicketCheck, ArrowRight, 
  FileText, CheckCircle, Clock, AlertTriangle, IndianRupee, Megaphone, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { customerService } from '../../services/customerService';
import { applicationService } from '../../services/applicationService';
import { documentService } from '../../services/documentService';
import { ticketService } from '../../services/ticketService';
import { collectionService } from '../../services/collectionService';
import { newsService } from '../../services/newsService';
import StatusBadge from '../../components/Common/StatusBadge';

const QuickAction = ({ icon, title, desc, path, color }) => {
  const navigate = useNavigate();
  return (
    <div className="portal-quick-action" onClick={() => navigate(path)}>
      <div className="portal-quick-action-icon" style={{ background: `${color}18` }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <Box>
        <Typography variant="body2" fontWeight={800} color="var(--text-main)">{title}</Typography>
        <Typography variant="caption" color="text.secondary">{desc}</Typography>
      </Box>
      <ArrowRight size={16} style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }} />
    </div>
  );
};

const CustomerPortal = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser() || {};
  const [customer, setCustomer] = useState(null);
  const [apps, setApps] = useState([]);
  const [docs, setDocs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [collections, setCollections] = useState([]);
  const [news, setNews] = useState([]);
  
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const cust = customerService.getByUserId(user.id);
    setCustomer(cust);
    if (cust) {
      const myApps = applicationService.getByCustomerId(cust.id);
      setApps(myApps);
      setDocs(documentService.getByCustomerId(cust.id));
      setTickets(ticketService.getByCustomerId(cust.id));
      
      const allCols = [];
      myApps.forEach(a => {
        allCols.push(...collectionService.getByApplicationId(a.id));
      });
      setCollections(allCols);
    }

    setNews(newsService.getActive());
  }, []);

  const pendingDocs = docs.filter(d => ['Rejected'].includes(d.status)).length;
  const openTickets = tickets.filter(t => ['Open', 'Assigned', 'In Progress'].includes(t.status)).length;
  const overdueEmis = collections.filter(c => c.paymentStatus === 'Overdue').length;
  const activeApps = apps.filter(a => !['Rejected', 'Disbursed'].includes(a.status)).length;

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Offer': return 'success';
      case 'Alert': return 'error';
      case 'Maintenance': return 'warning';
      default: return 'info';
    }
  };

  return (
    <Box>
      {/* Premium Welcome Banner */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, var(--accent), #1E1B4B)', 
          borderRadius: 4, p: 4, mb: 4, color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.2)'
        }}
      >
        <Box sx={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -30, right: 100, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        
        <Box position="relative" zIndex={1}>
          <Typography variant="h4" fontWeight={800} mb={1} sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
            Welcome back, {user.name?.split(' ')[0]}! 👋
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3, maxWidth: 600, lineHeight: 1.6 }}>
            Your premium financial dashboard. Seamlessly manage your loan applications, securely upload documents, and track your EMIs all from one place.
          </Typography>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button variant="contained" startIcon={<FilePlus size={18} />} onClick={() => navigate('/portal/apply')}
              sx={{ 
                bgcolor: '#fff', color: 'var(--accent)', '&:hover': { bgcolor: '#f8fafc' }, 
                fontWeight: 700, borderRadius: 3, px: 3, py: 1.2,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
              }}>
              Apply for Loan
            </Button>
            <Button variant="outlined" startIcon={<ClipboardList size={18} />} onClick={() => navigate('/portal/tracking')}
              sx={{ 
                borderColor: 'rgba(255,255,255,0.5)', color: '#fff', 
                '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }, 
                fontWeight: 600, borderRadius: 3, px: 3, py: 1.2 
              }}>
              Track Application
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={tab} 
          onChange={(e, v) => setTab(v)}
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 700, fontSize: 16, minWidth: 120 },
            '& .Mui-selected': { color: 'var(--accent)' },
            '& .MuiTabs-indicator': { backgroundColor: 'var(--accent)', height: 3, borderRadius: '3px 3px 0 0' }
          }}
        >
          <Tab label="Dashboard Overview" />
          <Tab label={
            <Box display="flex" alignItems="center" gap={1}>
              News & Offers
              {news.length > 0 && <Box sx={{ bgcolor: 'var(--error)', color: '#fff', px: 1, py: 0.2, borderRadius: 10, fontSize: 11 }}>{news.length}</Box>}
            </Box>
          } />
        </Tabs>
      </Box>

      {tab === 0 && (
        <Box className="fade-in">
          {/* Alert Cards */}
          {(pendingDocs > 0 || openTickets > 0 || overdueEmis > 0 || activeApps > 0) && (
            <Grid container spacing={2.5} mb={4}>
              {activeApps > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ bgcolor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 3, p: 2.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-sm)' } }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#dbeafe', color: '#2563eb' }}><FileText size={20} /></Box>
                      <Typography variant="h6" fontWeight={800} color="#1e40af">{activeApps}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="#1e40af" mb={0.5}>Active Application{activeApps > 1 ? 's' : ''}</Typography>
                    <Typography variant="caption" color="text.secondary">In progress — click to track.</Typography>
                  </Box>
                </Grid>
              )}
              {pendingDocs > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 3, p: 2.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-sm)' } }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fee2e2', color: '#dc2626' }}><AlertTriangle size={20} /></Box>
                      <Typography variant="h6" fontWeight={800} color="#991b1b">{pendingDocs}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="#991b1b" mb={0.5}>Doc Rejected</Typography>
                    <Typography variant="caption" color="text.secondary">Please re-upload immediately.</Typography>
                  </Box>
                </Grid>
              )}
              {openTickets > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ bgcolor: '#fffbeb', border: '1px solid #fde68a', borderRadius: 3, p: 2.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-sm)' } }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fef3c7', color: '#d97706' }}><TicketCheck size={20} /></Box>
                      <Typography variant="h6" fontWeight={800} color="#92400e">{openTickets}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="#92400e" mb={0.5}>Open Ticket{openTickets > 1 ? 's' : ''}</Typography>
                    <Typography variant="caption" color="text.secondary">Team is working on your query.</Typography>
                  </Box>
                </Grid>
              )}
              {overdueEmis > 0 && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ bgcolor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 3, p: 2.5, transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-sm)' } }}>
                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                      <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#fee2e2', color: '#dc2626' }}><IndianRupee size={20} /></Box>
                      <Typography variant="h6" fontWeight={800} color="#991b1b">{overdueEmis}</Typography>
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="#991b1b" mb={0.5}>Overdue EMI{overdueEmis > 1 ? 's' : ''}</Typography>
                    <Typography variant="caption" color="text.secondary">Contact branch to resolve.</Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          )}

          {/* Quick Actions */}
          <Typography variant="subtitle1" fontWeight={800} mb={2} color="var(--text-main)">Quick Actions</Typography>
          <Grid container spacing={2.5} mb={5}>
            {[
              { icon: <FilePlus size={24} />, title: 'Apply for Loan', desc: 'Submit a new application', path: '/portal/apply', color: '#6366f1' },
              { icon: <ClipboardList size={24} />, title: 'My Applications', desc: 'Track your current loans', path: '/portal/applications', color: '#0ea5e9' },
              { icon: <Upload size={24} />, title: 'Upload Docs', desc: 'Secure document vault', path: '/portal/upload', color: '#f59e0b' },
              { icon: <TicketCheck size={24} />, title: 'Support Tickets', desc: 'Raise queries and issues', path: '/portal/tickets', color: '#8b5cf6' },
            ].map(a => (
              <Grid item xs={12} sm={6} md={3} key={a.path}>
                <QuickAction {...a} />
              </Grid>
            ))}
          </Grid>

          {/* Recent Applications */}
          {apps.length > 0 && (
            <>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight={800} color="var(--text-main)">Recent Applications</Typography>
                <Button size="small" endIcon={<ArrowRight size={14} />} onClick={() => navigate('/portal/applications')} sx={{ color: 'var(--accent)', fontWeight: 700 }}>View All</Button>
              </Box>
              <Box sx={{ bgcolor: '#fff', border: '1px solid var(--border-light)', borderRadius: 4, overflow: 'hidden', mb: 3, boxShadow: 'var(--shadow-sm)' }}>
                <table className="premium-table">
                  <thead><tr><th style={{ paddingLeft: 24 }}>App ID</th><th>Loan Type</th><th>Amount</th><th>Status</th><th>Applied Date</th></tr></thead>
                  <tbody>
                    {apps.slice(0, 5).map(app => (
                      <tr key={app.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/portal/tracking')}>
                        <td style={{ fontWeight: 700, color: 'var(--info)', fontSize: 13, paddingLeft: 24 }}>{app.id}</td>
                        <td style={{ fontWeight: 600 }}>{app.loanType}</td>
                        <td style={{ fontWeight: 600 }}>₹{Number(app.requestedAmount).toLocaleString('en-IN')}</td>
                        <td><StatusBadge status={app.status} /></td>
                        <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{new Date(app.createdDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </>
          )}

          {/* No Customer Profile Alert */}
          {!customer && (
            <Box sx={{ bgcolor: 'var(--warning-bg)', border: '1px solid rgba(245,158,11,0.4)', borderRadius: 4, p: 4, textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <AlertTriangle size={36} color="var(--warning)" style={{ marginBottom: 12 }} />
              <Typography variant="h6" fontWeight={800} color="var(--warning)">Profile Not Linked</Typography>
              <Typography variant="body1" color="text.secondary" mt={1} mb={3} sx={{ maxWidth: 500, mx: 'auto' }}>
                Your customer profile has not been fully verified and linked yet. Please contact our support team to unlock all portal features.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/portal/tickets')} sx={{ bgcolor: 'var(--warning)', '&:hover': { bgcolor: '#D97706' }, fontWeight: 700, borderRadius: 3, px: 4, py: 1.5 }}>Contact Support</Button>
            </Box>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box className="fade-in">
          <Typography variant="subtitle1" fontWeight={800} mb={3} color="var(--text-main)">Latest Announcements & Offers</Typography>
          
          {news.length === 0 ? (
            <Box textAlign="center" py={8} sx={{ bgcolor: '#f8fafc', borderRadius: 4, border: '1px dashed var(--border-light)' }}>
              <Bell size={48} color="var(--text-light)" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight={700} color="var(--text-main)">You're all caught up!</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>There are no new announcements or offers at the moment.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {news.map(item => (
                <Grid item xs={12} key={item.id}>
                  <Card sx={{ p: 3.5, borderRadius: 4, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: 'var(--shadow-md)' } }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: `${getCategoryColor(item.category) === 'success' ? '#dcfce7' : '#e0e7ff'}`, color: `${getCategoryColor(item.category) === 'success' ? '#16a34a' : '#4f46e5'}` }}>
                          {item.category === 'Offer' ? <TicketCheck size={24} /> : <Megaphone size={24} />}
                        </Box>
                        <Box>
                          <Typography variant="h6" fontWeight={800} color="var(--text-main)">{item.title}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>{new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</Typography>
                        </Box>
                      </Box>
                      <Chip label={item.category} size="small" color={getCategoryColor(item.category)} sx={{ fontWeight: 800, px: 1 }} />
                    </Box>
                    <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, ml: 7 }}>
                      {item.content}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

    </Box>
  );
};

export default CustomerPortal;
