export default function HeroSection() {
  return (
    <div className="hero-text">
      <div style={{ marginBottom: 16 }}>
        <span className="label-technical" style={{ color: '#fff' }}>
          FIU-REGISTERED ENTITY
        </span>
      </div>
      <h1>LIQUIDITY<br />SETTLEMENT</h1>
      <p className="hero-sub">
        The compliant bridge for Web3 teams. Convert USDC to INR instantly with
        zero hidden fees. Send invoices, track flows, and settle directly to
        local banks.
      </p>
      <div className="stats-row">
        <div className="stat-block">
          <div className="label-technical">AVG SETTLEMENT</div>
          <h4 className="value-mono">4.2s</h4>
        </div>
        <div className="stat-block">
          <div className="label-technical">SUCCESS RATE</div>
          <h4 className="value-mono">99.9%</h4>
        </div>
        <div className="stat-block">
          <div className="label-technical">TOTAL VOLUME</div>
          <h4 className="value-mono">$420M+</h4>
        </div>
      </div>
    </div>
  );
}
