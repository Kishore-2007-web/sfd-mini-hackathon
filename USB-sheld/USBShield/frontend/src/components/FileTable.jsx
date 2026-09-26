import React, { useState } from 'react';
import { FileText, FileCode, Archive, ShieldAlert, Search, Filter } from 'lucide-react';

export default function FileTable({ files = [], connected }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  if (!connected) {
    return (
      <div className="panel" id="files-section">
        <div className="panel-header">
          <div className="panel-title">
            <FileText style={{ width: '16px', height: '16px' }} />
            <span>DETECTED FILES (0)</span>
          </div>
          <span className="badge badge-nodevice">NO DRIVE</span>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <p>No removable USB device connected.</p>
        </div>
      </div>
    );
  }

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          file.path.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || file.category.toUpperCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'executable':
        return <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>EXECUTABLE</span>;
      case 'script':
        return <span className="badge" style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#f59e0b' }}>SCRIPT</span>;
      case 'archive':
        return <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#3b82f6' }}>ARCHIVE</span>;
      case 'document':
        return <span className="badge" style={{ background: 'rgba(148, 163, 184, 0.15)', border: '1px solid rgba(148, 163, 184, 0.3)', color: '#94a3b8' }}>DOCUMENT</span>;
      default:
        return <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)' }}>{category.toUpperCase()}</span>;
    }
  };

  return (
    <div className="panel" id="files-section">
      <div className="panel-header">
        <div className="panel-title">
          <FileText style={{ width: '16px', height: '16px', color: '#38bdf8' }} />
          <span>DETECTED FILES ON USB ({files.length})</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          
          {/* Search box */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '4px 10px' }}>
            <Search style={{ width: '13px', height: '13px', color: 'var(--text-muted)', marginRight: '6px' }} />
            <input
              type="text"
              placeholder="Search file name or path..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: '12px', outline: 'none', width: '160px' }}
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', fontSize: '11px', borderRadius: '6px', padding: '4px 8px', outline: 'none' }}
          >
            <option value="ALL" style={{ background: '#0e1117' }}>ALL CATEGORIES</option>
            <option value="EXECUTABLE" style={{ background: '#0e1117' }}>EXECUTABLES</option>
            <option value="SCRIPT" style={{ background: '#0e1117' }}>SCRIPTS</option>
            <option value="ARCHIVE" style={{ background: '#0e1117' }}>ARCHIVES</option>
            <option value="DOCUMENT" style={{ background: '#0e1117' }}>DOCUMENTS</option>
          </select>
        </div>
      </div>

      {files.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          <p>No files detected on this removable drive (Empty USB).</p>
        </div>
      ) : (
        <div className="table-container" style={{ maxHeight: '350px', overflowY: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>FILE</th>
                <th>RELATIVE PATH</th>
                <th>TYPE</th>
                <th>SIZE</th>
                <th>RISK INDICATOR</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: '#ffffff' }}>
                    {file.name}
                  </td>
                  <td className="mono" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {file.path}
                  </td>
                  <td>
                    {getCategoryBadge(file.category)}
                  </td>
                  <td className="mono" style={{ fontSize: '12px' }}>
                    {file.size_formatted}
                  </td>
                  <td>
                    {file.risk_indicator !== 'None' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: file.category === 'executable' ? '#ef4444' : '#f59e0b', fontSize: '12px', fontWeight: '500' }}>
                        <ShieldAlert style={{ width: '13px', height: '13px' }} />
                        {file.risk_indicator}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>None</span>
                    )}
                  </td>
                  <td>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                      {file.status || 'REVIEW'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
