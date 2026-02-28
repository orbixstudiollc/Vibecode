import { Link } from 'react-router-dom';
import { getLeadStats, getLeads, getActivities, seedDemoLeads, formatStage, downloadCSV } from '../utils/leadStore';

seedDemoLeads();

export default function LeadDashboard() {
  const stats = getLeadStats();
  const recentLeads = getLeads().slice(0, 5);
  const activities = getActivities().slice(0, 10);

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
          <h1>Lead Dashboard</h1>
          <p className="lead-page-sub">Overview of your client pipeline and outreach metrics</p>
        </div>
        <div className="lead-header-actions">
          <button className="btn-ghost" onClick={() => downloadCSV()}>Export CSV</button>
          <Link to="/leads/new" className="btn-accent">+ Add Lead</Link>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Leads</span>
          <span className="stat-number">{stats.total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">New This Week</span>
          <span className="stat-number">{stats.newThisWeek}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Conversion Rate</span>
          <span className="stat-number">{stats.conversionRate}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg. Lead Score</span>
          <span className="stat-number">{stats.avgScore}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pipeline Value</span>
          <span className="stat-number">${stats.totalValue.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Won Revenue</span>
          <span className="stat-number accent">${stats.wonValue.toLocaleString()}</span>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dash-section">
          <div className="dash-section-header">
            <h3>Pipeline Breakdown</h3>
            <Link to="/pipeline" className="link-subtle">View Pipeline →</Link>
          </div>
          <div className="pipeline-bars">
            {Object.entries(stats.byStage).map(([stage, count]) => (
              <div key={stage} className="pipeline-bar-row">
                <span className="pipeline-bar-label">{formatStage(stage)}</span>
                <div className="pipeline-bar-track">
                  <div
                    className="pipeline-bar-fill"
                    style={{
                      width: stats.total ? `${(count / stats.total) * 100}%` : '0%',
                      background: stageColors[stage],
                    }}
                  />
                </div>
                <span className="pipeline-bar-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-section">
          <div className="dash-section-header">
            <h3>Recent Leads</h3>
            <Link to="/leads" className="link-subtle">View All →</Link>
          </div>
          <div className="recent-leads-list">
            {recentLeads.map((lead) => (
              <Link to={`/leads/${lead.id}`} key={lead.id} className="recent-lead-row">
                <div className="recent-lead-avatar">
                  {(lead.name || '?')[0].toUpperCase()}
                </div>
                <div className="recent-lead-info">
                  <span className="recent-lead-name">{lead.name}</span>
                  <span className="recent-lead-company">{lead.company || 'No company'}</span>
                </div>
                <span className="stage-badge" style={{ borderColor: stageColors[lead.stage], color: stageColors[lead.stage] }}>
                  {formatStage(lead.stage)}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="dash-section full-width">
          <div className="dash-section-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-feed">
            {activities.length === 0 && <p className="empty-state">No recent activity</p>}
            {activities.map((a) => (
              <div key={a.id} className="activity-item">
                <div className="activity-dot" />
                <div className="activity-content">
                  <span className="activity-text">{a.detail}</span>
                  <span className="activity-time">{timeAgo(a.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
