import { useEffect, useState } from 'react'
import api from '../api/axios'

const empty = { title: '', author: '', isbn: '', genre: '', description: '', quantity: 1, availableQuantity: 1 }

export default function Books() {
  const [books, setBooks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [modal, setModal]     = useState(false)
  const [form, setForm]       = useState(empty)
  const [editId, setEditId]   = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const load = () => {
    setLoading(true)
    api.get('/books').then(r => setBooks(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(empty); setEditId(null); setError(''); setModal(true) }

  const openEdit = book => {
    setForm({
      title: book.title, author: book.author, isbn: book.isbn || '',
      genre: book.genre || '', description: book.description || '',
      quantity: book.quantity, availableQuantity: book.availableQuantity
    })
    setEditId(book.id)
    setError('')
    setModal(true)
  }

  const save = async () => {
    if (!form.title || !form.author) { setError('Title and Author are required.'); return }
    setSaving(true); setError('')
    try {
      if (editId) await api.put(`/books/${editId}`, form)
      else        await api.post('/books', form)
      setModal(false)
      load()
    } catch (e) {
      setError(e.response?.data?.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async id => {
    if (!confirm('Delete this book?')) return
    await api.delete(`/books/${id}`)
    load()
  }

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    (b.isbn || '').includes(search)
  )

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">📚 All Books ({books.length})</span>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
        </div>

        <div className="search-bar">
          <div className="search-input-wrap">
            <span className="search-icon">🔍</span>
            <input placeholder="Search by title, author or ISBN…"
                   value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <div className="loading"><div className="spinner" /> Loading books…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No books found.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Title</th><th>Author</th>
                  <th>ISBN</th><th>Genre</th>
                  <th>Total</th><th>Available</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(book => (
                  <tr key={book.id}>
                    <td>{book.id}</td>
                    <td><strong>{book.title}</strong></td>
                    <td>{book.author}</td>
                    <td>{book.isbn || '—'}</td>
                    <td>{book.genre || '—'}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <span className={`badge ${book.availableQuantity > 0 ? 'badge-success' : 'badge-danger'}`}>
                        {book.availableQuantity}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn btn-sm btn-warning" onClick={() => openEdit(book)}>✏️ Edit</button>
                        <button className="btn btn-sm btn-danger"  onClick={() => remove(book.id)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">{editId ? '✏️ Edit Book' : '➕ Add New Book'}</span>
              <button className="modal-close" onClick={() => setModal(false)}>×</button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="form-grid">
              <div className="form-group">
                <label>Title *</label>
                <input placeholder="Book title" value={form.title}
                       onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Author *</label>
                <input placeholder="Author name" value={form.author}
                       onChange={e => setForm({ ...form, author: e.target.value })} />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input placeholder="ISBN number" value={form.isbn}
                       onChange={e => setForm({ ...form, isbn: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Genre</label>
                <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}>
                  <option value="">Select genre</option>
                  {['Fiction','Non-Fiction','Science','History','Technology',
                    'Biography','Self-Help','Children','Mystery','Romance','Other']
                    .map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Total Quantity</label>
                <input type="number" min="1" value={form.quantity}
                       onChange={e => setForm({ ...form, quantity: +e.target.value })} />
              </div>
              <div className="form-group">
                <label>Available</label>
                <input type="number" min="0" value={form.availableQuantity}
                       onChange={e => setForm({ ...form, availableQuantity: +e.target.value })} />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label>Description</label>
              <textarea placeholder="Short description…" value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="form-actions">
              <button className="btn btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Saving…' : editId ? '💾 Update' : '➕ Add Book'}
              </button>
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
