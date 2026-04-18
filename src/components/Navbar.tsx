const menuItems = [
  { label: 'Home', active: true },
  { label: 'Studio', active: false },
  { label: 'About', active: false },
  { label: 'Journal', active: false },
  { label: 'Reach Us', active: false },
];

export default function Navbar() {
  return (
    <nav className="relative z-10 w-full">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-6">
        <a
          href="#"
          className="font-serif text-3xl tracking-tight"
          style={{ color: '#000000' }}
        >
          Aethera<sup className="text-xs align-super">&reg;</sup>
        </a>

        <ul className="hidden md:flex items-center gap-8 font-sans">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href="#"
                className="text-sm transition-colors hover:text-black"
                style={{ color: item.active ? '#000000' : '#6F6F6F' }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="rounded-full px-6 py-2.5 text-sm font-sans transition-transform duration-300 hover:scale-[1.03]"
          style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
        >
          Begin Journey
        </button>
      </div>
    </nav>
  );
}
