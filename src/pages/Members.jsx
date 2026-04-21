import { useEffect, useState } from 'react'
import api from '../api/axios'

const empty = { name: '', email: '', phone: '', address: '', active: true }

export default function Members() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(empty)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = () => {
    setLoading(true)
    api.get('/members').then(r => setMembers(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditId(null); setError(''); setModal(true) }

  const openEdit = m => {
    setForm({ name: m.name, email: m.email, phone: m.phone || '',
              address: m.address || '', active: m.active })
    setEditId(m.id); setError(''); setModal(true)
  }

  const save = async () => {
    if (!form.name || !form.email) { setError('Name and Email are required.'); return }
    setSaving(true); setError('')
    try {
      if (editId) await api.put(`/members/${editId}`, form)
      else        await api.post('/members', form)
      setModal(false); load()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed.')
    } finally { setSaving(false) }
  }

  const remove = async id => {
    if (!confirm('Delete this member?')) return
    await api.delete(`/members/${id}`)
    load()
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone || '').includes(search)
  )

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">👥 All Members ({members.length})</span>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Member</button>
        </div>

        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon"></span>
            <input placeholder="Search by name, email or phone…"
                   value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading members…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👤</div>
            <p>No members found.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Name</th><th>Email</th>
                  <th>Phone</th><th>Member Since</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td>{m.id}</td>
                    <td><strong>{m.name}</strong></td>
                    <td>{m.email}</td>
                    <td>{m.phone || '—'}</td>
                    <td>{m.memberSince}</td>
                    <td>
                      <span className={`badge ${m.active ? 'badge-success' : 'badge-danger'}`}>
                        {m.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-warning" onClick={() => openEdit(m)}>✏ Edit</button>
                        <button className="btn btn-sm btn-danger"  onClick={() => remove(m.id)}>🗑 Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editId ? '✏ Edit Member' : '➕ Add Member'}</span>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input placeholder="Member name" value={form.name}
                       onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" placeholder="Email address" value={form.email}
                       onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input placeholder="Phone number" value={form.phone}
                       onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.active} onChange={e => setForm({ ...form, active: e.target.value === 'true' })}>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Address</label>
              <textarea placeholder="Member address…" value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : editId ? '💾 Update' : '➕ Add Member'}
              </button>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
