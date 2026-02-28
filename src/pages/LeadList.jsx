import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getLeads, deleteLead, formatStage, LEAD_STAGES, LEAD_SOURCES, downloadCSV } from '../utils/leadStore';

export default function LeadList() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const navigate = useNavigate();

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  function refresh() {
    setLeads(getLeads());
  }

  function handleDelete(id, name) {
    if (window.confirm(`Delete lead "${name}"?`)) {
      deleteLead(id);
      refresh();
    }
  }

  function toggleSort(field) {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  }

  const filtered = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          (l.name || '').toLowerCase().includes(q) ||
          (l.email || '').toLowerCase().includes(q) ||
          (l.company || '').toLowerCase().includes(q) ||
          (l.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (stageFilter !== 'all') {
      result = result.filter((l) => l.stage === stageFilter);
    }
    if (sourceFilter !== 'all') {
      result = result.filter((l) => l.source === sourceFilter);
    }
    result = [...result].sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'budget' || sortBy === 'score') {
        valA = valA || 0;
        valB = valB || 0;
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [leads, search, stageFilter, sourceFilter, sortBy, sortDir]);

  const stageColors = {
    new: '#D4FF00',
    contacted: '#00D4FF',
    qualified: '#FF8800',
    proposal: '#AA66FF',
    negotiation: '#FF4488',
    closed_won: '#00FF88',
    closed_lost: '#666',
  };

  return (
    <div className="lead-page">
      <div className="lead-page-header">
        <div>
          <h1>All Leads</h1>
          <p className="lead-page-sub">{filtered.length} lead{filtered.length !== 1 ? 's' : ''} found</p>
        </div>
        <div className="lead-header-actions">
          <button className="btn-ghost" onClick={() => downloadCSV()}>Export</button>
          <Link to="/leads/new" className="btn-accent">+ Add Lead</Link>
        </div>
      </div>

      <div className="lead-filters">
        <input
          type="text"
          className="lead-search"
          placeholder="Search leads by name, email, company, or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="lead-select" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
          <option value="all">All Stages</option>
          {LEAD_STAGES.map((s) => (
            <option key={s} value={s}>{formatStage(s)}</option>
          ))}
        </select>
        <select className="lead-select" value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option value="all">All Sources</option>
          {LEAD_SOURCES.map((s) => (
            <option key={s} value={s}>{formatStage(s)}</option>
          ))}
        </select>
      </div>

      <div className="lead-table-wrapper">
        <table className="lead-table">
          <thead>
            <tr>
              <th onClick={() => toggleSort('name')} className="sortable">
                Name {sortBy === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Email</th>
              <th>Company</th>
              <th onClick={() => toggleSort('stage')} className="sortable">
                Stage {sortBy === 'stage' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => toggleSort('source')} className="sortable">
                Source {sortBy === 'source' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => toggleSort('score')} className="sortable">
                Score {sortBy === 'score' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => toggleSort('budget')} className="sortable">
                Budget {sortBy === 'budget' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-table">No leads match your filters</td>
              </tr>
            )}
            {filtered.map((lead) => (
              <tr key={lead.id} className="lead-row" onClick={() => navigate(`/leads/${lead.id}`)}>
                <td>
                  <div className="lead-name-cell">
                    <div className="lead-avatar-sm">{(lead.name || '?')[0].toUpperCase()}</div>
                    <span>{lead.name}</span>
                  </div>
                </td>
                <td className="mono-cell">{lead.email || '—'}</td>
                <td>{lead.company || '—'}</td>
                <td>
                  <span className="stage-badge" style={{ borderColor: stageColors[lead.stage], color: stageColors[lead.stage] }}>
                    {formatStage(lead.stage)}
                  </span>
                </td>
                <td>{formatStage(lead.source || '—')}</td>
                <td>
                  <div className="score-bar-cell">
                    <div className="score-bar-mini">
                      <div className="score-bar-fill-mini" style={{ width: `${lead.score || 0}%` }} />
                    </div>
                    <span>{lead.score || 0}</span>
                  </div>
                </td>
                <td className="mono-cell">{lead.budget ? `$${lead.budget.toLocaleString()}` : '—'}</td>
                <td>
                  <div className="lead-actions" onClick={(e) => e.stopPropagation()}>
                    <Link to={`/leads/${lead.id}/edit`} className="action-btn">Edit</Link>
                    <button className="action-btn danger" onClick={() => handleDelete(lead.id, lead.name)}>Del</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
