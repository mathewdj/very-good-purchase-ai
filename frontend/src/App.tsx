import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import PurchasesPage from './pages/PurchasesPage'
import PurchaseTypesPage from './pages/PurchaseTypesPage'
import Layout from './components/Layout'

function RequireAuth({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('jwt') ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/purchases" replace />} />
        <Route path="purchases" element={<PurchasesPage />} />
        <Route path="purchase-types" element={<PurchaseTypesPage />} />
      </Route>
    </Routes>
  )
}
