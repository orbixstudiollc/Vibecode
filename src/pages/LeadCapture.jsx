import { useState } from 'react';
import { addLead, scoreLead, updateLead } from '../utils/leadStore';

export default function LeadCapture() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    interest: '',
    budget: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const budgetMap = { small: 5000, medium: 25000, large: 75000, enterprise: 150000 };

    const newLead = addLead({
      name: form.name,
      email: form.email,
      company: form.company,
      phone: form.phone,
      notes: form.interest ? `Interest: ${form.interest}` : '',
      budget: budgetMap[form.budget] || 0,
      source: 'website',
      stage: 'new',
      tags: ['inbound', 'website-form'],
    });
    updateLead(newLead.id, { score: scoreLead(newLead) });
    setSubmitted(true);
  }

  return (
    <div className="capture-page">
      <div className="capture-container">
        <div className="capture-header">
          <div className="capture-badge">EARLY ACCESS</div>
          <h1>Get Started with<br /><span className="accent-text">Offramp Protocol</span></h1>
          <p>Join forward-thinking companies using our compliant USDC-to-fiat settlement infrastructure.</p>
        </div>

        {submitted ? (
          <div className="capture-success">
            <div className="success-icon">&#10003;</div>
            <h2>Thank you, {form.name.split(' ')[0]}!</h2>
            <p>We've received your information. Our team will be in touch within 24 hours to discuss how we can help {form.company || 'your company'}.</p>
            <button className="btn-accent" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', phone: '', interest: '', budget: '' }); }}>
              Submit Another
            </button>
          </div>
        ) : (
          <form className="capture-form" onSubmit={handleSubmit}>
            <div className="capture-form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Work Email *</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Company name"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1-555-0100"
                />
              </div>
              <div className="form-group full-span">
                <label>Monthly Volume</label>
                <select name="budget" value={form.budget} onChange={handleChange}>
                  <option value="">Select range...</option>
                  <option value="small">Under $10K/mo</option>
                  <option value="medium">$10K - $50K/mo</option>
                  <option value="large">$50K - $100K/mo</option>
                  <option value="enterprise">$100K+/mo</option>
                </select>
              </div>
              <div className="form-group full-span">
                <label>What are you looking for?</label>
                <textarea
                  name="interest"
                  value={form.interest}
                  onChange={handleChange}
                  placeholder="Tell us about your use case..."
                  rows={3}
                />
              </div>
            </div>
            <button type="submit" className="btn-accent full-width">Request Access</button>
            <p className="capture-disclaimer">By submitting, you agree to be contacted about our products.</p>
          </form>
        )}

        <div className="capture-stats">
          <div className="capture-stat">
            <span className="capture-stat-val">4.2s</span>
            <span className="capture-stat-label">Avg. Settlement</span>
          </div>
          <div className="capture-stat">
            <span className="capture-stat-val">99.9%</span>
            <span className="capture-stat-label">Success Rate</span>
          </div>
          <div className="capture-stat">
            <span className="capture-stat-val">$420M+</span>
            <span className="capture-stat-label">Volume Processed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
