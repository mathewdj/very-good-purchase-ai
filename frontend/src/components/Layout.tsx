import { Outlet, NavLink, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('jwt')
    navigate('/login')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex gap-6">
          <NavLink
            to="/purchases"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-indigo-600' : 'text-gray-600 hover:text-gray-900'
            }
          >
            Purchases
          </NavLink>
          <NavLink
            to="/purchase-types"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-indigo-600' : 'text-gray-600 hover:text-gray-900'
            }
          >
            Purchase Types
          </NavLink>
        </div>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-800">
          Logout
        </button>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
