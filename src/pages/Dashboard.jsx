// import { useEffect, useState } from 'react'
// import api from '../api/axios'
//
// export default function Dashboard() {
//   const [stats, setStats]   = useState(null)
//   const [loans, setLoans]   = useState([])
//   const [loading, setLoading] = useState(true)
//
//   useEffect(() => {
//     Promise.all([
//       api.get('/dashboard/stats'),
//       api.get('/loans/active'),
//     ]).then(([s, l]) => {
//       setStats(s.data)
//       setLoans(l.data.slice(0, 6))
//     }).finally(() => setLoading(false))
//   }, [])
//
//   if (loading) return (
//     <div className="loading"><div className="spinner" /> Loading dashboard…</div>
//   )
//
//   return (
//     <>
//       {/* Stat Cards */}
//       <div className="stats-grid">
//         <div className="stat-card">
//           <div className="stat-icon blue">📚</div>
//           <div>
//             <div className="stat-value">{stats?.totalBooks ?? 0}</div>
//             <div className="stat-label">Total Books</div>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon purple">👥</div>
//           <div>
//             <div className="stat-value">{stats?.totalMembers ?? 0}</div>
//             <div className="stat-label">Members</div>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon orange">🔖</div>
//           <div>
//             <div className="stat-value">{stats?.activeLoans ?? 0}</div>
//             <div className="stat-label">Active Loans</div>
//           </div>
//         </div>
//         <div className="stat-card">
//           <div className="stat-icon green">✅</div>
//           <div>
//             <div className="stat-value">{stats?.returnedLoans ?? 0}</div>
//             <div className="stat-label">Returned</div>
//           </div>
//         </div>
//       </div>
//
//       {/* Recent Active Loans */}
//       <div className="card">
//         <div className="card-header">
//           <span className="card-title">🔖 Recent Active Loans</span>
//         </div>
//         {loans.length === 0 ? (
//           <div className="empty-state">
//             <div className="icon">📭</div>
//             <p>No active loans at the moment.</p>
//           </div>
//         ) : (
//           <div className="table-wrap">
//             <table>
//               <thead>
//                 <tr>
//                   <th>#</th>
//                   <th>Book</th>
//                   <th>Member</th>
//                   <th>Loan Date</th>
//                   <th>Due Date</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loans.map(loan => {
//                   const overdue = loan.dueDate && new Date(loan.dueDate) < new Date()
//                   return (
//                     <tr key={loan.id}>
//                       <td>{loan.id}</td>
//                       <td><strong>{loan.book?.title}</strong></td>
//                       <td>{loan.member?.name}</td>
//                       <td>{loan.loanDate}</td>
//                       <td>{loan.dueDate}</td>
//                       <td>
//                         <span className={`badge ${overdue ? 'badge-danger' : 'badge-warning'}`}>
//                           {overdue ? 'Overdue' : 'Active'}
//                         </span>
//                       </td>
//                     </tr>
//                   )
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }
import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Dashboard() {
  const [stats, setStats]     = useState(null)
  const [loans, setLoans]     = useState([])
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
    <div className="loading">
      <div className="spinner" />
      Loading dashboard…
    </div>
  )

  return (
    <>
      {/* Stat Cards */}
      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon stat-icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats?.totalBooks ?? 0}</div>
            <div className="stat-label">Total Books</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 00-3-3.87"/>
              <path d="M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats?.totalMembers ?? 0}</div>
            <div className="stat-label">Members</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--orange">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats?.activeLoans ?? 0}</div>
            <div className="stat-label">Active Loans</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon--green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">{stats?.returnedLoans ?? 0}</div>
            <div className="stat-label">Returned</div>
          </div>
        </div>

      </div>

      {/* Recent Active Loans */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" style={{ marginRight: 6 }}>
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
            Recent Active Loans
          </span>
        </div>

        {loans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
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
                      <td className="td--id">{loan.id}</td>
                      <td><strong>{loan.book?.title}</strong></td>
                      <td>{loan.member?.name}</td>
                      <td>{loan.loanDate}</td>
                      <td>{loan.dueDate}</td>
                      <td>
                        <span className={`badge ${overdue ? 'badge--danger' : 'badge--warn'}`}>
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