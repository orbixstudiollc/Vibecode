const LEADS_KEY = 'vibecode_leads';
const CAMPAIGNS_KEY = 'vibecode_campaigns';
const ACTIVITIES_KEY = 'vibecode_activities';

const LEAD_STAGES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];
const LEAD_SOURCES = ['website', 'referral', 'linkedin', 'cold_email', 'cold_call', 'event', 'social_media', 'other'];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveLeads(leads) {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

function addLead(lead) {
  const leads = getLeads();
  const newLead = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    stage: 'new',
    score: 0,
    tags: [],
    notes: '',
    outreachCount: 0,
    lastContactedAt: null,
    ...lead,
  };
  leads.unshift(newLead);
  saveLeads(leads);
  addActivity({ type: 'lead_added', leadId: newLead.id, detail: `Added lead: ${newLead.name}` });
  return newLead;
}

function updateLead(id, updates) {
  const leads = getLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx === -1) return null;
  leads[idx] = { ...leads[idx], ...updates, updatedAt: new Date().toISOString() };
  saveLeads(leads);
  return leads[idx];
}

function deleteLead(id) {
  const leads = getLeads().filter((l) => l.id !== id);
  saveLeads(leads);
}

function getLeadById(id) {
  return getLeads().find((l) => l.id === id) || null;
}

function moveLead(id, newStage) {
  const lead = updateLead(id, { stage: newStage });
  if (lead) {
    addActivity({ type: 'stage_changed', leadId: id, detail: `Moved "${lead.name}" to ${formatStage(newStage)}` });
  }
  return lead;
}

function scoreLead(lead) {
  let score = 0;
  if (lead.email) score += 10;
  if (lead.phone) score += 10;
  if (lead.company) score += 15;
  if (lead.budget) {
    if (lead.budget >= 50000) score += 30;
    else if (lead.budget >= 10000) score += 20;
    else score += 10;
  }
  if (lead.source === 'referral') score += 15;
  if (lead.source === 'website') score += 10;
  if (lead.outreachCount > 0) score += 5;
  if (lead.stage === 'qualified') score += 10;
  if (lead.stage === 'proposal') score += 15;
  if (lead.stage === 'negotiation') score += 20;
  return Math.min(score, 100);
}

function getCampaigns() {
  try {
    return JSON.parse(localStorage.getItem(CAMPAIGNS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCampaigns(campaigns) {
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
}

function addCampaign(campaign) {
  const campaigns = getCampaigns();
  const newCampaign = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    status: 'draft',
    sent: 0,
    opened: 0,
    replied: 0,
    leads: [],
    ...campaign,
  };
  campaigns.unshift(newCampaign);
  saveCampaigns(campaigns);
  return newCampaign;
}

function updateCampaign(id, updates) {
  const campaigns = getCampaigns();
  const idx = campaigns.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  campaigns[idx] = { ...campaigns[idx], ...updates };
  saveCampaigns(campaigns);
  return campaigns[idx];
}

function deleteCampaign(id) {
  const campaigns = getCampaigns().filter((c) => c.id !== id);
  saveCampaigns(campaigns);
}

function getActivities() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITIES_KEY)) || [];
  } catch {
    return [];
  }
}

function addActivity(activity) {
  const activities = getActivities();
  activities.unshift({
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...activity,
  });
  if (activities.length > 200) activities.length = 200;
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
}

function getLeadStats() {
  const leads = getLeads();
  const now = new Date();
  const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return {
    total: leads.length,
    byStage: LEAD_STAGES.reduce((acc, stage) => {
      acc[stage] = leads.filter((l) => l.stage === stage).length;
      return acc;
    }, {}),
    newThisWeek: leads.filter((l) => new Date(l.createdAt) >= thisWeek).length,
    newThisMonth: leads.filter((l) => new Date(l.createdAt) >= thisMonth).length,
    avgScore: leads.length ? Math.round(leads.reduce((sum, l) => sum + (l.score || 0), 0) / leads.length) : 0,
    conversionRate: leads.length
      ? Math.round((leads.filter((l) => l.stage === 'closed_won').length / leads.length) * 100)
      : 0,
    totalValue: leads.reduce((sum, l) => sum + (l.budget || 0), 0),
    wonValue: leads.filter((l) => l.stage === 'closed_won').reduce((sum, l) => sum + (l.budget || 0), 0),
  };
}

function formatStage(stage) {
  return stage.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function exportLeadsCSV() {
  const leads = getLeads();
  if (!leads.length) return '';
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Stage', 'Source', 'Budget', 'Score', 'Tags', 'Notes', 'Created'];
  const rows = leads.map((l) => [
    l.name || '',
    l.email || '',
    l.phone || '',
    l.company || '',
    formatStage(l.stage || ''),
    l.source || '',
    l.budget || '',
    l.score || 0,
    (l.tags || []).join('; '),
    (l.notes || '').replace(/"/g, '""'),
    l.createdAt ? new Date(l.createdAt).toLocaleDateString() : '',
  ]);
  const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v}"`).join(','))].join('\n');
  return csv;
}

function downloadCSV(filename) {
  const csv = exportLeadsCSV();
  if (!csv) return;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'leads_export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function seedDemoLeads() {
  const existing = getLeads();
  if (existing.length > 0) return;
  const demoLeads = [
    { name: 'Sarah Chen', email: 'sarah@techcorp.io', phone: '+1-555-0101', company: 'TechCorp', stage: 'qualified', source: 'linkedin', budget: 45000, tags: ['enterprise', 'saas'], notes: 'Interested in API integration' },
    { name: 'Marcus Johnson', email: 'marcus@startupxyz.com', phone: '+1-555-0102', company: 'StartupXYZ', stage: 'new', source: 'website', budget: 12000, tags: ['startup', 'fintech'], notes: 'Signed up via website form' },
    { name: 'Priya Patel', email: 'priya@globalpay.in', phone: '+91-98765-43210', company: 'GlobalPay India', stage: 'proposal', source: 'referral', budget: 85000, tags: ['enterprise', 'payments'], notes: 'Referred by Alex from BlockFi' },
    { name: 'James O\'Brien', email: 'james@cryptohedge.co', phone: '+44-20-7946-0958', company: 'CryptoHedge Fund', stage: 'negotiation', source: 'event', budget: 150000, tags: ['institutional', 'trading'], notes: 'Met at ETH Denver' },
    { name: 'Yuki Tanaka', email: 'yuki@neobank.jp', phone: '+81-3-1234-5678', company: 'NeoBank Japan', stage: 'contacted', source: 'cold_email', budget: 60000, tags: ['banking', 'asia-pacific'], notes: 'Responded to outreach sequence' },
    { name: 'David Kim', email: 'david@chainlink.solutions', phone: '+1-555-0103', company: 'ChainLink Solutions', stage: 'closed_won', source: 'referral', budget: 35000, tags: ['oracle', 'defi'], notes: 'Contract signed, onboarding in progress' },
    { name: 'Elena Volkov', email: 'elena@fintecheu.com', phone: '+49-30-12345678', company: 'FinTech EU', stage: 'qualified', source: 'linkedin', budget: 72000, tags: ['compliance', 'eu-market'], notes: 'Needs MiCA compliance features' },
    { name: 'Carlos Mendoza', email: 'carlos@pagoslatam.mx', phone: '+52-55-1234-5678', company: 'Pagos LATAM', stage: 'new', source: 'social_media', budget: 28000, tags: ['latam', 'remittances'], notes: 'Found us on Twitter/X' },
  ];
  demoLeads.forEach((lead) => {
    const newLead = addLead(lead);
    updateLead(newLead.id, { score: scoreLead(newLead) });
  });
}

export {
  LEAD_STAGES,
  LEAD_SOURCES,
  getLeads,
  addLead,
  updateLead,
  deleteLead,
  getLeadById,
  moveLead,
  scoreLead,
  getCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  getActivities,
  addActivity,
  getLeadStats,
  formatStage,
  exportLeadsCSV,
  downloadCSV,
  seedDemoLeads,
};
