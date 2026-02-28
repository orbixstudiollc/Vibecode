import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getLeadById, updateLead, deleteLead, moveLead, addActivity, LEAD_STAGES, formatStage } from '../utils/leadStore';
import { templates, fillTemplate } from '../utils/emailTemplates';

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(() => getLeadById(id));
  const [activeTemplate, setActiveTemplate] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const data = getLeadById(id);
    if (!data) {
      navigate('/leads');
    } else {
      setLead(data);
    }
  }, [id, navigate]);

  function refresh() {
    setLead(getLeadById(id));
  }

  function handleStageChange(newStage) {
    moveLead(id, newStage);
    refresh();
  }

  function handleAddNote() {
    if (!note.trim()) return;
    const existing = lead.notes || '';
    const timestamp = new Date().toLocaleString();
    const updated = `[${timestamp}] ${note}\n${existing}`;
    updateLead(id, { notes: updated });
    addActivity({ type: 'note_added', leadId: id, detail: `Added note to "${lead.name}"` });
    setNote('');
    refresh();
  }

  function handleLogOutreach() {
    updateLead(id, {
      outreachCount: (lead.outreachCount || 0) + 1,
      lastContactedAt: new Date().toISOString(),
    });
    addActivity({ type: 'outreach_logged', leadId: id, detail: `Logged outreach to "${lead.name}"` });
    refresh();
  }

  function handleDelete() {
    if (window.confirm(`Delete "${lead.name}"? This cannot be undone.`)) {
      deleteLead(id);
      navigate('/leads');
    }
  }

  function handleCopyEmail(template) {
    const { subject, body } = fillTemplate(template, lead);
    const text = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(text).then(() => {
      addActivity({ type: 'template_copied', leadId: id, detail: `Copied "${template.name}" template for "${lead.name}"` });
      handleLogOutreach();
    });
  }

  if (!lead) return null;

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
          <button className="btn-ghost" onClick={() => navigate('/leads')} style={{ marginBottom: 8 }}>← Back to Leads</button>
          <h1>{lead.name}</h1>
          <p className="lead-page-sub">{lead.role ? `${lead.role} at ` : ''}{lead.company || 'No company'}</p>
        </div>
        <div className="lead-header-actions">
          <Link to={`/leads/${id}/edit`} className="btn-ghost">Edit</Link>
          <button className="btn-ghost danger-text" onClick={handleDelete}>Delete</button>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <div className="detail-card">
            <h3>Contact Information</h3>
            <div className="detail-fields">
              <div className="detail-field">
                <span className="field-label">Email</span>
                <span className="field-value mono">{lead.email || '—'}</span>
              </div>
              <div className="detail-field">
                <span className="field-label">Phone</span>
                <span className="field-value mono">{lead.phone || '—'}</span>
              </div>
              <div className="detail-field">
                <span className="field-label">LinkedIn</span>
                <span className="field-value mono">{lead.linkedin || '—'}</span>
              </div>
              <div className="detail-field">
                <span className="field-label">Website</span>
                <span className="field-value mono">{lead.website || '—'}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>Pipeline Stage</h3>
            <div className="stage-selector">
              {LEAD_STAGES.map((stage) => (
                <button
                  key={stage}
                  className={`stage-btn ${lead.stage === stage ? 'active' : ''}`}
                  style={lead.stage === stage ? { background: stageColors[stage], color: '#000' } : {}}
                  onClick={() => handleStageChange(stage)}
                >
                  {formatStage(stage)}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <div className="card-header-row">
              <h3>Outreach Templates</h3>
              <button className="btn-ghost-sm" onClick={() => setShowTemplates(!showTemplates)}>
                {showTemplates ? 'Hide' : 'Show Templates'}
              </button>
            </div>
            {showTemplates && (
              <div className="templates-list">
                {templates.map((t) => (
                  <div
                    key={t.id}
                    className={`template-item ${activeTemplate?.id === t.id ? 'active' : ''}`}
                    onClick={() => setActiveTemplate(activeTemplate?.id === t.id ? null : t)}
                  >
                    <div className="template-header">
                      <span className="template-name">{t.name}</span>
                      <span className="template-stage-tag" style={{ color: stageColors[t.stage] }}>
                        {formatStage(t.stage)}
                      </span>
                    </div>
                    {activeTemplate?.id === t.id && (
                      <div className="template-preview">
                        <div className="template-subject">
                          <strong>Subject:</strong> {fillTemplate(t, lead).subject}
                        </div>
                        <pre className="template-body">{fillTemplate(t, lead).body}</pre>
                        <button className="btn-accent-sm" onClick={() => handleCopyEmail(t)}>
                          Copy to Clipboard & Log Outreach
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-card">
            <h3>Notes</h3>
            <div className="note-input-row">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="note-input"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <button className="btn-accent-sm" onClick={handleAddNote}>Add</button>
            </div>
            {lead.notes && <pre className="notes-display">{lead.notes}</pre>}
          </div>
        </div>

        <div className="detail-sidebar">
          <div className="detail-card">
            <h3>Lead Score</h3>
            <div className="score-display">
              <div className="score-ring">
                <svg viewBox="0 0 100 100" className="score-svg">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#222" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={lead.score >= 70 ? '#00FF88' : lead.score >= 40 ? '#FF8800' : '#FF4444'}
                    strokeWidth="6"
                    strokeDasharray={`${(lead.score / 100) * 264} 264`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <span className="score-value">{lead.score || 0}</span>
              </div>
              <span className="score-label-text">
                {lead.score >= 70 ? 'Hot Lead' : lead.score >= 40 ? 'Warm Lead' : 'Cold Lead'}
              </span>
            </div>
          </div>

          <div className="detail-card">
            <h3>Quick Stats</h3>
            <div className="sidebar-stats">
              <div className="sidebar-stat">
                <span className="field-label">Budget</span>
                <span className="field-value accent">{lead.budget ? `$${lead.budget.toLocaleString()}` : '—'}</span>
              </div>
              <div className="sidebar-stat">
                <span className="field-label">Source</span>
                <span className="field-value">{formatStage(lead.source || '—')}</span>
              </div>
              <div className="sidebar-stat">
                <span className="field-label">Outreach Count</span>
                <span className="field-value">{lead.outreachCount || 0}</span>
              </div>
              <div className="sidebar-stat">
                <span className="field-label">Last Contacted</span>
                <span className="field-value">{lead.lastContactedAt ? new Date(lead.lastContactedAt).toLocaleDateString() : 'Never'}</span>
              </div>
              <div className="sidebar-stat">
                <span className="field-label">Created</span>
                <span className="field-value">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="detail-card">
            <h3>Tags</h3>
            <div className="tags-display">
              {(lead.tags || []).length === 0 && <span className="empty-state">No tags</span>}
              {(lead.tags || []).map((tag) => (
                <span key={tag} className="tag-chip">{tag}</span>
              ))}
            </div>
          </div>

          <div className="detail-card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <button className="btn-ghost full-width" onClick={handleLogOutreach}>Log Outreach</button>
              <button className="btn-ghost full-width" onClick={() => setShowTemplates(true)}>Use Template</button>
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="btn-ghost full-width" style={{ textAlign: 'center' }}>
                  Send Email
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
