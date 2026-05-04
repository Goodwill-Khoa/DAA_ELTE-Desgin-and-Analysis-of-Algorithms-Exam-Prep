import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/topics', label: 'Topics' },
  { to: '/questions', label: 'Question Bank' },
  { to: '/mock-exam', label: 'Mock Exam' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/documents', label: 'Documents' },
]

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="DAA Exam Prep home">
          <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="6" fill="#fff" opacity="0.15"/>
            <text x="16" y="22" fontFamily="monospace" fontSize="13" fontWeight="bold" fill="#fff" textAnchor="middle">DAA</text>
          </svg>
          <span>DAA Prep</span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label="Toggle navigation menu"
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        <ul id="nav-links" className={`navbar-links ${open ? 'open' : ''}`} role="list">
          {links.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <style>{`
        .navbar {
          background: var(--primary);
          color: #fff;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 56px;
          gap: 1rem;
        }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          font-weight: 700;
          font-size: 1.1rem;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar-brand:hover { text-decoration: none; opacity: 0.9; }
        .navbar-links {
          display: flex;
          list-style: none;
          gap: 0.25rem;
          margin: 0;
          padding: 0;
        }
        .nav-link {
          display: block;
          padding: 0.4rem 0.75rem;
          color: rgba(255,255,255,0.85);
          border-radius: var(--radius);
          font-size: 0.9rem;
          font-weight: 500;
          text-decoration: none;
          transition: background 0.15s, color 0.15s;
        }
        .nav-link:hover { background: rgba(255,255,255,0.1); color: #fff; text-decoration: none; }
        .nav-link.active { background: rgba(255,255,255,0.2); color: #fff; }
        .nav-link:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        .navbar-toggle {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
        }
        .hamburger-line { display: block; width: 22px; height: 2px; background: #fff; border-radius: 2px; }
        .navbar-toggle:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
        @media (max-width: 768px) {
          .navbar-toggle { display: flex; }
          .navbar-links {
            display: none;
            position: absolute;
            top: 56px;
            left: 0; right: 0;
            background: var(--primary);
            flex-direction: column;
            padding: 0.75rem 1rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.2);
            gap: 0.25rem;
          }
          .navbar-links.open { display: flex; }
        }
      `}</style>
    </nav>
  )
}
