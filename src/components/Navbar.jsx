export default function Navbar() {
  return (
    <nav>
      <div className="logo">OFFRAMP_PROTOCOL</div>
      <div className="nav-links">
        <a href="#" className="nav-item">Products</a>
        <a href="#" className="nav-item">Developers</a>
        <a href="#" className="nav-item">Compliance</a>
        <a href="#" className="nav-item">Company</a>
      </div>
      <button className="cta-small">Connect Wallet</button>
    </nav>
  );
}
