import { useState, useEffect } from 'react';
import { getCampaigns, addCampaign, updateCampaign, deleteCampaign, getLeads, addActivity } from '../utils/leadStore';
import { templates, fillTemplate } from '../utils/emailTemplates';

export default function OutreachPanel() {
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [previewLead, setPreviewLead] = useState(null);
  const [form, setForm] = useState({ name: '', templateId: '', leadIds: [] });

  useEffect(() => {
    setCampaigns(getCampaigns());
    setLeads(getLeads());
  }, []);

  function refresh() {
    setCampaigns(getCampaigns());
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.templateId) return;
    addCampaign({
      name: form.name,
      templateId: form.templateId,
      leads: form.leadIds,
      status: 'draft',
    });
    addActivity({ type: 'campaign_created', detail: `Created campaign: "${form.name}"` });
    setForm({ name: '', templateId: '', leadIds: [] });
    setShowNew(false);
    refresh();
  }

  function handleLaunch(id) {
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) return;
    updateCampaign(id, {
      status: 'active',
      sent: campaign.leads.length,
      launchedAt: new Date().toISOString(),
    });
    addActivity({ type: 'campaign_launched', detail: `Launched campaign: "${campaign.name}"` });
    refresh();
  }

  function handlePause(id) {
    updateCampaign(id, { status: 'paused' });
    refresh();
  }

  function handleDelete(id, name) {
    if (window.confirm(`Delete campaign "${name}"?`)) {
      deleteCampaign(id);
      refresh();
    }
  }

  function toggleLeadSelection(leadId) {
    setForm((f) => ({
      ...f,
      leadIds: f.leadIds.includes(leadId)
        ? f.leadIds.filter((i) => i !== leadId)
        : [...f.leadIds, leadId],
    }));
  }

  const selectedTemplate = templates.find((t) => t.id === form.templateId);

  const statusColors = { draft: '#666', active: '#00FF88', paused: '#FF8800', completed: '#D4FF00' };

  return (
    <div className="lead-page">
      <div className="lead-page-header">
        <div>
          <h1>Outreach Campaigns</h1>
          <p className="lead-page-sub">Manage email campaigns and outreach sequences</p>
        </div>
        <button className="btn-accent" onClick={() => setShowNew(!showNew)}>
          {showNew ? 'Cancel' : '+ New Campaign'}
        </button>
      </div>

      {showNew && (
        <form className="campaign-form" onSubmit={handleCreate}>
          <div className="form-grid">
            <div className="form-group">
              <label>Campaign Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Q1 Enterprise Outreach"
                required
              />
            </div>
            <div className="form-group">
              <label>Email Template *</label>
              <select
                value={form.templateId}
                onChange={(e) => setForm((f) => ({ ...f, templateId: e.target.value }))}
                required
              >
                <option value="">Select template...</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedTemplate && previewLead && (
            <div className="template-preview-box">
              <h4>Preview for: {previewLead.name}</h4>
              <div className="template-subject">
                <strong>Subject:</strong> {fillTemplate(selectedTemplate, previewLead).subject}
              </div>
              <pre className="template-body">{fillTemplate(selectedTemplate, previewLead).body}</pre>
            </div>
          )}

          <div className="campaign-lead-select">
            <label>Select Leads ({form.leadIds.length} selected)</label>
            <div className="campaign-leads-grid">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className={`campaign-lead-chip ${form.leadIds.includes(lead.id) ? 'selected' : ''}`}
                  onClick={() => {
                    toggleLeadSelection(lead.id);
                    setPreviewLead(lead);
                  }}
                >
                  <span className="campaign-lead-avatar">{(lead.name || '?')[0]}</span>
                  <div className="campaign-lead-text">
                    <span>{lead.name}</span>
                    <span className="campaign-lead-co">{lead.company || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
            <button type="submit" className="btn-accent" disabled={!form.name || !form.templateId || form.leadIds.length === 0}>
              Create Campaign
            </button>
          </div>
        </form>
      )}

      <div className="campaigns-list">
        {campaigns.length === 0 && !showNew && (
          <div className="empty-state-box">
            <p>No campaigns yet. Create your first outreach campaign to start reaching clients.</p>
          </div>
        )}
        {campaigns.map((c) => {
          const tpl = templates.find((t) => t.id === c.templateId);
          return (
            <div
              key={c.id}
              className={`campaign-card ${selectedCampaign === c.id ? 'expanded' : ''}`}
            >
              <div className="campaign-card-header" onClick={() => setSelectedCampaign(selectedCampaign === c.id ? null : c.id)}>
                <div className="campaign-card-left">
                  <span className="campaign-status-dot" style={{ background: statusColors[c.status] }} />
                  <div>
                    <span className="campaign-name">{c.name}</span>
                    <span className="campaign-meta">
                      {tpl?.name || 'Unknown template'} · {c.leads?.length || 0} leads
                    </span>
                  </div>
                </div>
                <div className="campaign-card-right">
                  <div className="campaign-metrics">
                    <div className="campaign-metric">
                      <span className="metric-val">{c.sent || 0}</span>
                      <span className="metric-label">Sent</span>
                    </div>
                    <div className="campaign-metric">
                      <span className="metric-val">{c.opened || 0}</span>
                      <span className="metric-label">Opened</span>
                    </div>
                    <div className="campaign-metric">
                      <span className="metric-val">{c.replied || 0}</span>
                      <span className="metric-label">Replied</span>
                    </div>
                  </div>
                  <span className="campaign-status-badge" style={{ color: statusColors[c.status] }}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {selectedCampaign === c.id && (
                <div className="campaign-card-body">
                  <div className="campaign-actions-row">
                    {c.status === 'draft' && (
                      <button className="btn-accent-sm" onClick={() => handleLaunch(c.id)}>Launch Campaign</button>
                    )}
                    {c.status === 'active' && (
                      <button className="btn-ghost-sm" onClick={() => handlePause(c.id)}>Pause</button>
                    )}
                    {c.status === 'paused' && (
                      <button className="btn-accent-sm" onClick={() => handleLaunch(c.id)}>Resume</button>
                    )}
                    <button className="btn-ghost-sm danger-text" onClick={() => handleDelete(c.id, c.name)}>Delete</button>
                  </div>
                  {c.launchedAt && (
                    <p className="campaign-date">Launched: {new Date(c.launchedAt).toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
