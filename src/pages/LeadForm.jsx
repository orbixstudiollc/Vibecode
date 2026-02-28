import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addLead, updateLead, getLeadById, scoreLead, LEAD_STAGES, LEAD_SOURCES, formatStage } from '../utils/leadStore';

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  stage: 'new',
  source: 'website',
  budget: '',
  tags: '',
  notes: '',
  linkedin: '',
  website: '',
  role: '',
};

export default function LeadForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id) && id !== 'new';

  const [form, setForm] = useState(() => {
    if (isEdit) {
      const lead = getLeadById(id);
      if (lead) {
        return {
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          company: lead.company || '',
          stage: lead.stage || 'new',
          source: lead.source || 'website',
          budget: lead.budget || '',
          tags: (lead.tags || []).join(', '),
          notes: lead.notes || '',
          linkedin: lead.linkedin || '',
          website: lead.website || '',
          role: lead.role || '',
        };
      }
    }
    return defaultForm;
  });

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const data = {
      ...form,
      budget: form.budget ? Number(form.budget) : 0,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isEdit) {
      updateLead(id, data);
      const updated = getLeadById(id);
      updateLead(id, { score: scoreLead(updated) });
    } else {
      const newLead = addLead(data);
      updateLead(newLead.id, { score: scoreLead(newLead) });
    }

    navigate('/leads');
  }

  return (
    <div className="lead-page">
      <div className="lead-page-header">
        <div>
          <h1>{isEdit ? 'Edit Lead' : 'Add New Lead'}</h1>
          <p className="lead-page-sub">{isEdit ? 'Update lead information' : 'Capture a new potential client'}</p>
        </div>
        <button className="btn-ghost" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <form className="lead-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@company.com" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1-555-0100" />
          </div>
          <div className="form-group">
            <label>Company</label>
            <input type="text" name="company" value={form.company} onChange={handleChange} placeholder="Acme Corp" />
          </div>
          <div className="form-group">
            <label>Job Title / Role</label>
            <input type="text" name="role" value={form.role} onChange={handleChange} placeholder="CTO, VP Engineering..." />
          </div>
          <div className="form-group">
            <label>Budget ($)</label>
            <input type="number" name="budget" value={form.budget} onChange={handleChange} placeholder="50000" min="0" />
          </div>
          <div className="form-group">
            <label>Stage</label>
            <select name="stage" value={form.stage} onChange={handleChange}>
              {LEAD_STAGES.map((s) => (
                <option key={s} value={s}>{formatStage(s)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Source</label>
            <select name="source" value={form.source} onChange={handleChange}>
              {LEAD_SOURCES.map((s) => (
                <option key={s} value={s}>{formatStage(s)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>LinkedIn URL</label>
            <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
          </div>
          <div className="form-group">
            <label>Website</label>
            <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://company.com" />
          </div>
          <div className="form-group full-span">
            <label>Tags (comma separated)</label>
            <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="enterprise, fintech, priority" />
          </div>
          <div className="form-group full-span">
            <label>Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Add context about this lead..." rows={4} />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-accent">{isEdit ? 'Update Lead' : 'Save Lead'}</button>
        </div>
      </form>
    </div>
  );
}
