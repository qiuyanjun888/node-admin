import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/system/user'
import MenuManagement from './pages/system/menu'
import RoleManagement from './pages/system/role'
import PermissionManagement from './pages/system/permission'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="system">
          <Route path="user" element={<UserManagement />} />
          <Route path="role" element={<RoleManagement />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="permission" element={<PermissionManagement />} />
        </Route>
      </Route>
      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
