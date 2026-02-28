import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, moveLead, formatStage, LEAD_STAGES } from '../utils/leadStore';

const stageColors = {
  new: '#D4FF00',
  contacted: '#00D4FF',
  qualified: '#FF8800',
  proposal: '#AA66FF',
  negotiation: '#FF4488',
  closed_won: '#00FF88',
  closed_lost: '#666',
};

export default function LeadPipeline() {
  const [leads, setLeads] = useState(() => getLeads());
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  function refresh() {
    setLeads(getLeads());
  }

  function handleDragStart(e, leadId) {
    setDraggedId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDragOver(e, stage) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }

  function handleDragLeave() {
    setDragOverStage(null);
  }

  function handleDrop(e, stage) {
    e.preventDefault();
    if (draggedId) {
      moveLead(draggedId, stage);
      refresh();
    }
    setDraggedId(null);
    setDragOverStage(null);
  }

  function getStageLeads(stage) {
    return leads.filter((l) => l.stage === stage);
  }

  function getStageValue(stage) {
    return getStageLeads(stage).reduce((sum, l) => sum + (l.budget || 0), 0);
  }

  return (
    <div className="lead-page">
      <div className="lead-page-header">
        <div>
          <h1>Pipeline</h1>
          <p className="lead-page-sub">Drag and drop leads between stages</p>
        </div>
        <Link to="/leads/new" className="btn-accent">+ Add Lead</Link>
      </div>

      <div className="pipeline-board">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = getStageLeads(stage);
          const value = getStageValue(stage);
          return (
            <div
              key={stage}
              className={`pipeline-column ${dragOverStage === stage ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage)}
            >
              <div className="pipeline-col-header" style={{ borderTopColor: stageColors[stage] }}>
                <div className="pipeline-col-title">
                  <span className="pipeline-stage-dot" style={{ background: stageColors[stage] }} />
                  <span>{formatStage(stage)}</span>
                  <span className="pipeline-count">{stageLeads.length}</span>
                </div>
                {value > 0 && <span className="pipeline-value">${value.toLocaleString()}</span>}
              </div>

              <div className="pipeline-cards">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`pipeline-card ${draggedId === lead.id ? 'dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead.id)}
                  >
                    <Link to={`/leads/${lead.id}`} className="pipeline-card-link">
                      <div className="pipeline-card-top">
                        <span className="pipeline-card-name">{lead.name}</span>
                        {lead.score > 0 && (
                          <span className={`pipeline-card-score ${lead.score >= 70 ? 'hot' : lead.score >= 40 ? 'warm' : 'cold'}`}>
                            {lead.score}
                          </span>
                        )}
                      </div>
                      <span className="pipeline-card-company">{lead.company || 'No company'}</span>
                      {lead.budget > 0 && (
                        <span className="pipeline-card-budget">${lead.budget.toLocaleString()}</span>
                      )}
                      <div className="pipeline-card-tags">
                        {(lead.tags || []).slice(0, 2).map((t) => (
                          <span key={t} className="tag-chip-sm">{t}</span>
                        ))}
                      </div>
                    </Link>
                  </div>
                ))}
                {stageLeads.length === 0 && (
                  <div className="pipeline-empty">No leads</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
