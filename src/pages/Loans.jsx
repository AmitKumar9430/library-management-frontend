import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Loans() {
  const [loans, setLoans]     = useState([])
  const [books, setBooks]     = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState({ bookId: '', memberId: '' })
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = () => {
    setLoading(true)
    Promise.all([
      api.get('/loans'),
      api.get('/books'),
      api.get('/members'),
    ]).then(([l, b, m]) => {
      setLoans(l.data); setBooks(b.data); setMembers(m.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openIssue = () => { setForm({ bookId: '', memberId: '' }); setError(''); setModal(true) }

  const issue = async () => {
    if (!form.bookId || !form.memberId) { setError('Select both book and member.'); return }
    setSaving(true); setError('')
    try {
      await api.post('/loans', { bookId: form.bookId, memberId: form.memberId })
      setModal(false); load()
    } catch (e) {
      setError(e.response?.data?.message || 'Could not issue loan.')
    } finally { setSaving(false) }
  }

  const returnBook = async id => {
    if (!confirm('Mark this book as returned?')) return
    await api.put(`/loans/${id}/return`)
    load()
  }

  const remove = async id => {
    if (!confirm('Delete this loan record?')) return
    await api.delete(`/loans/${id}`)
    load()
  }

  const filtered = loans.filter(l =>
    filter === 'ALL' ? true : l.status === filter
  )

  const isOverdue = l =>
    l.status === 'ACTIVE' && l.dueDate && new Date(l.dueDate) < new Date()

  const statusBadge = l => {
    if (l.status === 'RETURNED') return <span className="badge badge-success">Returned</span>
    if (isOverdue(l))            return <span className="badge badge-danger">Overdue</span>
    return                               <span className="badge badge-warning">Active</span>
  }

  const availableBooks = books.filter(b => b.availableQuantity > 0)

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">🔖 Loan Records ({loans.length})</span>
          <button className="btn btn-primary" onClick={openIssue}>+ Issue Book</button>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['ALL','ACTIVE','RETURNED'].map(f => (
            <button key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-outline'}`}>
              {f === 'ALL' ? 'All' : f === 'ACTIVE' ? '🔖 Active' : '✅ Returned'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading loans…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No loan records found.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Book</th><th>Member</th>
                  <th>Loan Date</th><th>Due Date</th><th>Return Date</th>
                  <th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(loan => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td><strong>{loan.book?.title}</strong><br />
                      <small style={{ color: '#adb5bd' }}>{loan.book?.author}</small>
                    </td>
                    <td>{loan.member?.name}<br />
                      <small style={{ color: '#adb5bd' }}>{loan.member?.email}</small>
                    </td>
                    <td>{loan.loanDate}</td>
                    <td>{loan.dueDate}</td>
                    <td>{loan.returnDate || '—'}</td>
                    <td>{statusBadge(loan)}</td>
                    <td>
                      <div className="action-buttons">
                        {loan.status === 'ACTIVE' && (
                          <button className="btn btn-sm btn-success"
                                  onClick={() => returnBook(loan.id)}>
                            ↩️ Return
                          </button>
                        )}
                        <button className="btn btn-sm btn-danger"
                                onClick={() => remove(loan.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ISSUE LOAN MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">📖 Issue Book</span>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Select Book *</label>
                <select value={form.bookId}
                        onChange={e => setForm({ ...form, bookId: e.target.value })}>
                  <option value="">— Choose a book —</option>
                  {availableBooks.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.title} — {b.author} (avail: {b.availableQuantity})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Member *</label>
                <select value={form.memberId}
                        onChange={e => setForm({ ...form, memberId: e.target.value })}>
                  <option value="">— Choose a member —</option>
                  {members.filter(m => m.active).map(m => (
                    <option key={m.id} value={m.id}>{m.name} — {m.email}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ padding: '12px 0', color: '#6c757d', fontSize: 13 }}>
              📅 Loan date: <strong>{new Date().toLocaleDateString()}</strong>&nbsp;&nbsp;
              📅 Due date: <strong>
                {new Date(Date.now() + 14*24*60*60*1000).toLocaleDateString()}
              </strong> (14 days)
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={issue} disabled={saving}>
                {saving ? 'Processing…' : '📤 Issue Book'}
              </button>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
