import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login'
import Todos from './pages/Todos'
import Register from './pages/Register'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" />
  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/todos" element={
          <ProtectedRoute><Todos /></ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
