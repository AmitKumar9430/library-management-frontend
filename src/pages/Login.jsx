import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [tab, setTab]         = useState('login')
  const [form, setForm]       = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [success, setSuccess] = useState('')
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogin = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, { username: res.data.username, role: res.data.role })
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await api.post('/auth/register', form)
      setSuccess('Registered! You can now log in.')
      setTab('login')
      setForm({ username: '', password: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
      console.log(err.response?.data?.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="icon">📚</span>
          <h1>Library Management</h1>
          <p>Sign in to manage your library</p>
        </div>

        <div className="login-tabs">
          <button className={`login-tab ${tab === 'login' ? 'active' : ''}`}
                  onClick={() => { setTab('login'); setError(''); setSuccess('') }}>
            Login
          </button>
          <button className={`login-tab ${tab === 'register' ? 'active' : ''}`}
                  onClick={() => { setTab('register'); setError(''); setSuccess('') }}>
            Register
          </button>
        </div>

        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="login-form">
          <div className="form-group">
            <label>Username</label>
            <input name="username" placeholder="Enter username"
                   value={form.username} onChange={update} autoComplete="username" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Enter password"
                   value={form.password} onChange={update} autoComplete="current-password" />
          </div>

          {tab === 'login'
            ? <button className="btn-login" onClick={handleLogin} disabled={loading}>
                {loading ? 'Signing in…' : '🔑 Sign In'}
              </button>
            : <button className="btn-login" onClick={handleRegister} disabled={loading}>
                {loading ? 'Registering…' : '✅ Create Account'}
              </button>
          }
        </div>
      </div>
    </div>
  )
}
