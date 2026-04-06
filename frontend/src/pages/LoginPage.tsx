import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api/auth'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'register') {
        await register(username, password)
        setMode('login')
        setError('Registered! Please log in.')
        return
      }
      const { token } = await login(username, password)
      localStorage.setItem('jwt', token)
      navigate('/purchases')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        'Something went wrong'
      setError(msg)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Very Good Purchase AI
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className={`text-sm ${error.startsWith('Registered') ? 'text-green-600' : 'text-red-600'}`}>
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium"
          >
            {mode === 'login' ? 'Log In' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-indigo-600 hover:underline"
          >
            {mode === 'login' ? 'Register' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}
