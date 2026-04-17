import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats]   = useState(null)
  const [loans, setLoans]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/loans/active'),
    ]).then(([s, l]) => {
      setStats(s.data)
      setLoans(l.data.slice(0, 6))
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="loading"><div className="spinner" /> Loading dashboard…</div>
  )

  return (
    <>
      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📚</div>
          <div>
            <div className="stat-value">{stats?.totalBooks ?? 0}</div>
            <div className="stat-label">Total Books</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div>
            <div className="stat-value">{stats?.totalMembers ?? 0}</div>
            <div className="stat-label">Members</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🔖</div>
          <div>
            <div className="stat-value">{stats?.activeLoans ?? 0}</div>
            <div className="stat-label">Active Loans</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{stats?.returnedLoans ?? 0}</div>
            <div className="stat-label">Returned</div>
          </div>
        </div>
      </div>

      {/* Recent Active Loans */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">🔖 Recent Active Loans</span>
        </div>
        {loans.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No active loans at the moment.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Member</th>
                  <th>Loan Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => {
                  const overdue = loan.dueDate && new Date(loan.dueDate) < new Date()
                  return (
                    <tr key={loan.id}>
                      <td>{loan.id}</td>
                      <td><strong>{loan.book?.title}</strong></td>
                      <td>{loan.member?.name}</td>
                      <td>{loan.loanDate}</td>
                      <td>{loan.dueDate}</td>
                      <td>
                        <span className={`badge ${overdue ? 'badge-danger' : 'badge-warning'}`}>
                          {overdue ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
