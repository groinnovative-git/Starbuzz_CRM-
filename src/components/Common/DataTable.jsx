// DataTable.jsx — Premium table with search, filter, pagination

import React, { useState, useMemo } from 'react';
import { Search, Inbox } from 'lucide-react';

const ROWS_PER_PAGE = 10;

const DataTable = ({ columns, data = [], searchPlaceholder = 'Search...', filters = [], searchFields }) => {
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState({});
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let rows = data;

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(row => {
        if (searchFields) return searchFields.some(f => String(row[f] || '').toLowerCase().includes(q));
        return Object.values(row).some(v => String(v || '').toLowerCase().includes(q));
      });
    }

    // Apply dropdown filters
    filters.forEach(f => {
      const val = filterValues[f.field];
      if (val) rows = rows.filter(r => String(r[f.field]) === val);
    });

    return rows;
  }, [data, search, filterValues, filters, searchFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handleFilter = (field, value) => {
    setFilterValues(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="data-table-wrapper">
      {/* Toolbar */}
      <div className="data-table-toolbar">
        <div className="data-table-search">
          <Search size={15} className="data-table-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="data-table-filters">
          {filters.map(f => (
            <div key={f.field} className="data-table-filter">
              <select
                value={filterValues[f.field] || ''}
                onChange={e => handleFilter(f.field, e.target.value)}
              >
                <option value="">{f.label}: All</option>
                {f.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="premium-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.field}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="data-table-empty">
                    <Inbox size={36} />
                    <p>No records found</p>
                    <small>Try adjusting your search or filter criteria</small>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr key={row.id || i}>
                  {columns.map(col => (
                    <td key={col.field}>
                      {col.render ? col.render(row) : (row[col.field] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="data-table-pagination">
        <span>
          Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} records
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '4px 12px', border: '1px solid var(--border)', borderRadius: 6,
              background: page === 1 ? '#f8fafc' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
              color: 'var(--text-secondary)', fontSize: 13,
            }}
          >
            ‹ Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 6,
                  background: page === p ? 'var(--accent)' : '#fff',
                  color: page === p ? '#fff' : 'var(--text-secondary)',
                  fontWeight: page === p ? 600 : 400,
                  cursor: 'pointer', fontSize: 13,
                }}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '4px 12px', border: '1px solid var(--border)', borderRadius: 6,
              background: page === totalPages ? '#f8fafc' : '#fff',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              color: 'var(--text-secondary)', fontSize: 13,
            }}
          >
            Next ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
