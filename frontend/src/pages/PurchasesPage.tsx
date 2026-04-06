import { useEffect, useState } from 'react'
import { getPurchases, createPurchase, updatePurchase, deletePurchase } from '../api/purchases'
import { getPurchaseTypes } from '../api/purchaseTypes'
import type { Purchase, PurchaseType } from '../api/types'

interface FormState {
  date: string
  description: string
  amount: string
  purchaseTypeId: string
}

const emptyForm = (): FormState => ({
  date: new Date().toISOString().split('T')[0],
  description: '',
  amount: '',
  purchaseTypeId: '',
})

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [types, setTypes] = useState<PurchaseType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [error, setError] = useState('')

  const load = (p = page) =>
    getPurchases(p, 20).then((data) => {
      setPurchases(data.content)
      setTotalPages(data.totalPages)
    })

  useEffect(() => {
    load()
    getPurchaseTypes().then(setTypes)
  }, [page])

  const openCreate = () => { setEditId(null); setForm(emptyForm()); setShowForm(true) }
  const openEdit = (p: Purchase) => {
    setEditId(p.id)
    setForm({ date: p.date, description: p.description, amount: p.amount, purchaseTypeId: String(p.purchaseType.id) })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      date: form.date,
      description: form.description,
      amount: form.amount,
      purchaseTypeId: Number(form.purchaseTypeId),
    }
    try {
      if (editId !== null) {
        await updatePurchase(editId, payload)
      } else {
        await createPurchase(payload)
      }
      setShowForm(false)
      load(page)
    } catch {
      setError('Failed to save purchase')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePurchase(id)
      load(page)
    } catch {
      setError('Failed to delete purchase')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Purchases</h1>
        <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
          + New Purchase
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-700">✕</button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{editId ? 'Edit Purchase' : 'New Purchase'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Purchase Type</label>
                <select
                  required
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={form.purchaseTypeId}
                  onChange={(e) => setForm({ ...form, purchaseTypeId: e.target.value })}
                >
                  <option value="">Select a type</option>
                  {types.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium">
                  {editId ? 'Save Changes' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-right">Amount</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {purchases.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">No purchases yet.</td>
              </tr>
            )}
            {purchases.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{p.date}</td>
                <td className="px-4 py-3 text-gray-800">{p.description}</td>
                <td className="px-4 py-3">
                  <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                    {p.purchaseType.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono text-gray-800">
                  ${Number(p.amount).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-800 mr-3 text-xs">Edit</button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-500">Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
