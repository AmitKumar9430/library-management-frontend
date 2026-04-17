import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/books',     icon: '📚', label: 'Books' },
  { path: '/members',   icon: '👥', label: 'Members' },
  { path: '/loans',     icon: '🔖', label: 'Loans' },
]

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/books':     'Book Management',
  '/members':   'Member Management',
  '/loans':     'Loan Management',
}

export default function Layout() {
  const { auth, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const title = pageTitles[location.pathname] || 'Library'
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>📚 LibraryMS</h2>
          <span>Management System</span>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-label">Main Menu</div>
          {navItems.map(item => (
            <button
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {auth?.user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="user-name">{auth?.user?.username}</div>
              <div className="user-role">{auth?.user?.role?.replace('ROLE_', '')}</div>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <header className="topbar">
          <h1>{title}</h1>
          <span className="topbar-date">{today}</span>
        </header>
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
