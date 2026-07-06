// Reports.jsx — Live Reports from localStorage data

import React, { useState } from 'react';
import { Box, Tab, Tabs, Button, Grid, Card, CardContent, Typography } from '@mui/material';
import { Download, Printer } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import DataTable from '../../components/Common/DataTable';
import StatusBadge from '../../components/Common/StatusBadge';
import { reportService } from '../../services/reportService';

const APP_STATUSES = ['New Application', 'Under Review', 'Document Pending', 'Document Verified', 'Approved', 'Rejected', 'Disbursed'];

const SummaryCard = ({ label, value, color = 'var(--accent)' }) => (
  <Card sx={{ borderRadius: 2.5, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-light)' }}>
    <CardContent sx={{ p: 2 }}>
      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{label}</Typography>
      <Typography variant="h5" fontWeight={800} sx={{ color, mt: 0.5 }}>{value}</Typography>
    </CardContent>
  </Card>
);

const exportCSV = (data, filename) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).filter(k => k !== 'statusHistory' && k !== 'responses');
  const rows = data.map(row => headers.map(h => {
    const val = row[h];
    if (typeof val === 'object') return '';
    return `"${String(val || '').replace(/"/g, '""')}"`;
  }).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
};

const Reports = () => {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const tabs = ['Leads', 'Customers', 'Applications', 'Documents', 'Tickets', 'Collections'];

  const getLeads = () => reportService.getLeadReport({ search, status: statusFilter });
  const getCustomers = () => reportService.getCustomerReport({ search });
  const getApps = () => reportService.getApplicationReport({ search, status: statusFilter });
  const getDocs = () => reportService.getDocumentReport({ search, status: statusFilter });
  const getTickets = () => reportService.getTicketReport({ search, status: statusFilter });
  const getCollections = () => reportService.getCollectionReport({ search, status: statusFilter });

  const filterBar = (filterOptions) => (
    <Box display="flex" gap={1.5} mb={3} flexWrap="wrap" alignItems="center">
      <input
        type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ padding: '7px 12px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', minWidth: 220, color: 'var(--text-primary)' }}
      />
      {filterOptions && (
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '7px 28px 7px 10px', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12.5, color: 'var(--text-secondary)', background: '#fff', cursor: 'pointer' }}>
          <option value="">All Statuses</option>
          {filterOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )}
    </Box>
  );

  const leadData = getLeads();
  const custData = getCustomers();
  const appData = getApps();
  const docData = getDocs();
  const ticketData = getTickets();
  const colData = getCollections();

  return (
    <Box>
      <PageHeader title="Reports" subtitle="Comprehensive reports generated from live system data." />

      <Box sx={{ bgcolor: 'white', borderRadius: 3, border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', mb: 3 }}>
        <Box sx={{ borderBottom: '1px solid var(--border-light)', px: 3 }}>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setSearch(''); setStatusFilter(''); }} variant="scrollable" scrollButtons="auto">
            {tabs.map((t, i) => <Tab key={t} label={t} sx={{ fontSize: 13, fontWeight: 600, minWidth: 100 }} />)}
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* LEADS REPORT */}
          {tab === 0 && (
            <>
              {filterBar(['New', 'Contacted', 'Interested', 'Not Interested', 'Follow-up', 'Converted', 'Closed'])}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}><SummaryCard label="Total Leads" value={leadData.length} /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Converted" value={leadData.filter(l => l.status === 'Converted').length} color="var(--success)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Follow-up Due" value={leadData.filter(l => l.status === 'Follow-up').length} color="var(--warning)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Not Interested" value={leadData.filter(l => l.status === 'Not Interested').length} color="var(--error)" /></Grid>
              </Grid>
              <Box mb={2} textAlign="right">
                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportCSV(leadData, 'leads_report.csv')} variant="outlined" sx={{ mr: 1, fontSize: 12 }}>Export CSV</Button>
                <Button size="small" startIcon={<Printer size={14} />} onClick={() => window.print()} variant="outlined" sx={{ fontSize: 12 }}>Print</Button>
              </Box>
              <DataTable
                data={leadData}
                columns={[
                  { field: 'id', header: 'Lead ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.id}</span> },
                  { field: 'name', header: 'Name', render: r => <Box><Box display="flex" alignItems="center" gap={1}><div style={{ fontWeight: 600 }}>{r.name}</div><StatusBadge status={r.source} /></Box><div className="cell-sub">{r.mobile}</div></Box> },
                  { field: 'loanDetails', header: 'Loan Required', render: r => <Box><div style={{ fontWeight: 600 }}>{r.loanAmount ? `₹${Number(r.loanAmount).toLocaleString('en-IN')}` : '—'}</div><div className="cell-sub">{r.loanType || '—'}</div></Box> },
                  { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
                  { field: 'followUp', header: 'Follow-up', render: r => <Box><div style={{ fontSize: 12, color: new Date(r.followUpDate) < new Date() && r.status === 'Follow-up' ? 'var(--error)' : 'inherit', fontWeight: 500 }}>{r.followUpDate || '—'}</div><div className="cell-sub">{r.assignedTo || 'Unassigned'}</div></Box> },
                  { field: 'createdDate', header: 'Date', render: r => new Date(r.createdDate).toLocaleDateString('en-IN') },
                ]}
                searchPlaceholder="Search leads..."
              />
            </>
          )}

          {/* CUSTOMERS REPORT */}
          {tab === 1 && (
            <>
              {filterBar(null)}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}><SummaryCard label="Total Customers" value={custData.length} /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Salaried" value={custData.filter(c => c.employmentType === 'Salaried').length} color="var(--success)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Self-Employed" value={custData.filter(c => c.employmentType === 'Self-Employed').length} color="var(--warning)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Avg Income" value={`₹${Math.round(custData.reduce((s, c) => s + (c.monthlyIncome || 0), 0) / (custData.length || 1)).toLocaleString('en-IN')}`} color="var(--purple)" /></Grid>
              </Grid>
              <Box mb={2} textAlign="right">
                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportCSV(custData, 'customers_report.csv')} variant="outlined" sx={{ mr: 1, fontSize: 12 }}>Export CSV</Button>
              </Box>
              <DataTable
                data={custData}
                columns={[
                  { field: 'id', header: 'Customer ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.id}</span> },
                  { field: 'name', header: 'Name', render: r => <Box><div style={{ fontWeight: 600 }}>{r.name}</div><div className="cell-sub">{r.email || r.city}</div></Box> },
                  { field: 'mobile', header: 'Mobile', render: r => <div style={{ fontWeight: 500 }}>{r.mobile}</div> },
                  { field: 'financials', header: 'Financials', render: r => <Box><div style={{ fontWeight: 600 }}>₹{Number(r.monthlyIncome || 0).toLocaleString('en-IN')}/mo</div><div className="cell-sub">{r.employmentType || '—'}</div></Box> },
                  { field: 'cibil', header: 'CIBIL', render: r => r.cibil ? <StatusBadge status={Number(r.cibil)} /> : '—' },
                ]}
                searchPlaceholder="Search customers..."
              />
            </>
          )}

          {/* APPLICATIONS REPORT */}
          {tab === 2 && (
            <>
              {filterBar(APP_STATUSES)}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}><SummaryCard label="Total Apps" value={appData.length} /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Approved" value={appData.filter(a => a.status === 'Approved').length} color="var(--success)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Disbursed" value={appData.filter(a => a.status === 'Disbursed').length} color="var(--purple)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Total Value" value={`₹${(appData.filter(a => a.status === 'Disbursed').reduce((s, a) => s + (a.disbursedAmount || a.requestedAmount || 0), 0) / 10000000).toFixed(1)}Cr`} color="var(--accent)" /></Grid>
              </Grid>
              <Box mb={2} textAlign="right">
                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportCSV(appData.map(a => ({ ...a, statusHistory: '' })), 'applications_report.csv')} variant="outlined" sx={{ mr: 1, fontSize: 12 }}>Export CSV</Button>
              </Box>
              <DataTable
                data={appData}
                columns={[
                  { field: 'id', header: 'App ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.id}</span> },
                  { field: 'customerName', header: 'Customer', render: r => <span style={{ fontWeight: 600 }}>{r.customerName}</span> },
                  { field: 'loanDetails', header: 'Loan Request', render: r => <Box><div style={{ fontWeight: 600 }}>₹{Number(r.requestedAmount).toLocaleString('en-IN')}</div><div className="cell-sub">{r.loanType}</div></Box> },
                  { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
                  { field: 'assignedOfficer', header: 'Officer', render: r => <Box><div style={{ fontSize: 12 }}>{r.assignedOfficer || 'Unassigned'}</div><div className="cell-sub">{new Date(r.createdDate).toLocaleDateString('en-IN')}</div></Box> },
                ]}
                searchPlaceholder="Search applications..."
              />
            </>
          )}

          {/* DOCUMENTS REPORT */}
          {tab === 3 && (
            <>
              {filterBar(['Uploaded', 'Pending Verification', 'Approved', 'Rejected'])}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}><SummaryCard label="Total Docs" value={docData.length} /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Approved" value={docData.filter(d => d.status === 'Approved').length} color="var(--success)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Rejected" value={docData.filter(d => d.status === 'Rejected').length} color="var(--error)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Pending" value={docData.filter(d => ['Uploaded', 'Pending Verification'].includes(d.status)).length} color="var(--warning)" /></Grid>
              </Grid>
              <Box mb={2} textAlign="right">
                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportCSV(docData, 'documents_report.csv')} variant="outlined" sx={{ mr: 1, fontSize: 12 }}>Export CSV</Button>
              </Box>
              <DataTable
                data={docData}
                columns={[
                  { field: 'id', header: 'Doc ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.id}</span> },
                  { field: 'customerDetails', header: 'Customer', render: r => <Box><div style={{ fontWeight: 600 }}>{r.customerName || '—'}</div><div className="cell-sub" style={{ color: 'var(--purple)', fontWeight: 500 }}>{r.applicationId}</div></Box> },
                  { field: 'type', header: 'Document', render: r => <Box><StatusBadge status={r.type} /><div className="cell-sub">{new Date(r.uploadDate).toLocaleDateString('en-IN')}</div></Box> },
                  { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
                ]}
                searchPlaceholder="Search documents..."
              />
            </>
          )}

          {/* TICKETS REPORT */}
          {tab === 4 && (
            <>
              {filterBar(['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'])}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}><SummaryCard label="Total Tickets" value={ticketData.length} /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Open" value={ticketData.filter(t => t.status === 'Open').length} color="var(--error)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Resolved" value={ticketData.filter(t => t.status === 'Resolved').length} color="var(--success)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="High Priority" value={ticketData.filter(t => t.priority === 'High').length} color="var(--warning)" /></Grid>
              </Grid>
              <Box mb={2} textAlign="right">
                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportCSV(ticketData.map(t => ({ ...t, responses: '' })), 'tickets_report.csv')} variant="outlined" sx={{ mr: 1, fontSize: 12 }}>Export CSV</Button>
              </Box>
              <DataTable
                data={ticketData}
                columns={[
                  { field: 'id', header: 'Ticket ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.id}</span> },
                  { field: 'customerName', header: 'Customer', render: r => <span style={{ fontWeight: 600 }}>{r.customerName}</span> },
                  { field: 'issue', header: 'Issue', render: r => <Box><Box display="flex" alignItems="center" gap={1}><div className="truncate" style={{ fontWeight: 600, maxWidth: 200 }}>{r.subject}</div><StatusBadge status={r.category} /></Box><div className="cell-sub">Raised {new Date(r.createdDate).toLocaleDateString('en-IN')}</div></Box> },
                  { field: 'priority', header: 'Priority', render: r => <StatusBadge status={r.priority} /> },
                  { field: 'status', header: 'Status', render: r => <StatusBadge status={r.status} /> },
                ]}
                searchPlaceholder="Search tickets..."
              />
            </>
          )}

          {/* COLLECTIONS REPORT */}
          {tab === 5 && (
            <>
              {filterBar(['Paid', 'Partial', 'Overdue', 'Pending'])}
              <Grid container spacing={2} mb={3}>
                <Grid item xs={6} sm={3}><SummaryCard label="Total EMIs" value={colData.length} /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Paid" value={colData.filter(c => c.paymentStatus === 'Paid').length} color="var(--success)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Overdue" value={colData.filter(c => c.paymentStatus === 'Overdue').length} color="var(--error)" /></Grid>
                <Grid item xs={6} sm={3}><SummaryCard label="Total Collected" value={`₹${(colData.reduce((s, c) => s + (c.paidAmount || 0), 0) / 100000).toFixed(1)}L`} color="var(--accent)" /></Grid>
              </Grid>
              <Box mb={2} textAlign="right">
                <Button size="small" startIcon={<Download size={14} />} onClick={() => exportCSV(colData, 'collections_report.csv')} variant="outlined" sx={{ mr: 1, fontSize: 12 }}>Export CSV</Button>
              </Box>
              <DataTable
                data={colData}
                columns={[
                  { field: 'applicationId', header: 'App ID', render: r => <span style={{ fontSize: 12, color: 'var(--info)', fontWeight: 600 }}>{r.applicationId}</span> },
                  { field: 'customerDetails', header: 'Customer', render: r => <Box><div style={{ fontWeight: 600 }}>{r.customerName || '—'}</div><div className="cell-sub">{r.loanType || '—'}</div></Box> },
                  { field: 'emiPeriod', header: 'EMI Month', render: r => <Box><div style={{ fontWeight: 500 }}>{r.emiMonth}</div><div className="cell-sub">Due: {r.dueDate}</div></Box> },
                  { field: 'financials', header: 'Financials', render: r => <Box><div style={{ fontWeight: 600 }}>₹{Number(r.emiAmount).toLocaleString('en-IN')}</div><div className="cell-sub" style={{ color: r.balanceAmount > 0 ? 'var(--error)' : 'var(--success)' }}>Bal: ₹{Number(r.balanceAmount || 0).toLocaleString('en-IN')}</div></Box> },
                  { field: 'paymentStatus', header: 'Status', render: r => <StatusBadge status={r.paymentStatus} /> },
                ]}
                searchPlaceholder="Search collections..."
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Reports;
