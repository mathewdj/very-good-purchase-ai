import { useEffect, useState } from 'react'
import { getPurchaseTypes, createPurchaseType, updatePurchaseType, deletePurchaseType } from '../api/purchaseTypes'
import type { PurchaseType } from '../api/types'

export default function PurchaseTypesPage() {
  const [types, setTypes] = useState<PurchaseType[]>([])
  const [newName, setNewName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [error, setError] = useState('')

  const load = () => getPurchaseTypes().then(setTypes)

  useEffect(() => { load() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return
    try {
      await createPurchaseType(newName.trim())
      setNewName('')
      load()
    } catch {
      setError('Failed to create type')
    }
  }

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return
    try {
      await updatePurchaseType(id, editName.trim())
      setEditId(null)
      load()
    } catch {
      setError('Failed to update type')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deletePurchaseType(id)
      load()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? 'Failed to delete'
      setError(msg)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Purchase Types</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-700">✕</button>
        </div>
      )}
      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="New type name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium">
          Add
        </button>
      </form>
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        {types.length === 0 && (
          <p className="px-4 py-6 text-center text-gray-400">No purchase types yet.</p>
        )}
        {types.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-4 py-3">
            {editId === t.id ? (
              <div className="flex gap-2 flex-1 mr-4">
                <input
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                />
                <button onClick={() => handleUpdate(t.id)} className="text-indigo-600 font-medium hover:text-indigo-800">
                  Save
                </button>
                <button onClick={() => setEditId(null)} className="text-gray-400 hover:text-gray-700">
                  Cancel
                </button>
              </div>
            ) : (
              <span className="text-gray-800 flex-1">{t.name}</span>
            )}
            {editId !== t.id && (
              <div className="flex gap-3">
                <button
                  onClick={() => { setEditId(t.id); setEditName(t.name) }}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
