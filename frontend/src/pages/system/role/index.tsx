import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, AlertCircle, Search, RotateCcw } from 'lucide-react'
import type { Role } from '@/types/system'
import { useRoleActions } from './hooks/useRoleActions'
import { RoleTable } from './components/RoleTable'
import { RoleFormModal } from './components/RoleFormModal'

const INITIAL_FORM_STATE = {
  roleName: '',
  roleCode: '',
  description: '',
  status: 1,
}

export default function RoleManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [filters, setFilters] = useState({
    roleName: '',
    roleCode: '',
    status: 'all',
  })
  const [queryParams, setQueryParams] = useState({
    roleName: '',
    roleCode: '',
    status: 'all',
  })

  const { rolesQuery, createMutation, updateMutation, handleToggleStatus } = useRoleActions(
    page,
    pageSize,
    {
      roleName: queryParams.roleName || undefined,
      roleCode: queryParams.roleCode || undefined,
      status: queryParams.status === 'all' ? undefined : Number(queryParams.status),
    },
  )

  const { data, isLoading, error, refetch } = rolesQuery

  const handleSearch = () => {
    setQueryParams(filters)
    setPage(1)
  }

  const handleReset = () => {
    const resetFilters = { roleName: '', roleCode: '', status: 'all' }
    setFilters(resetFilters)
    setQueryParams(resetFilters)
    setPage(1)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingRole(null)
    setFormData(INITIAL_FORM_STATE)
    createMutation.reset()
    updateMutation.reset()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingRole) {
      updateMutation.mutate({ id: editingRole.id, data: formData }, { onSuccess: handleCloseModal })
    } else {
      createMutation.mutate(formData, { onSuccess: handleCloseModal })
    }
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      roleName: role.roleName,
      roleCode: role.roleCode,
      description: role.description || '',
      status: role.status,
    })
    setIsModalOpen(true)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-destructive gap-4">
        <AlertCircle className="w-12 h-12" />
        <p className="font-medium">加载失败: {(error as Error).message}</p>
        <Button variant="outline" onClick={() => refetch()}>
          重试
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground/90">角色管理</h2>
          <p className="text-muted-foreground mt-1 text-sm">管理系统角色及其关联的权限。</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          新增角色
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              角色名称:
            </label>
            <Input
              placeholder="请输入角色名称"
              className="w-48 h-9"
              value={filters.roleName}
              onChange={(e) => setFilters((prev) => ({ ...prev, roleName: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              角色编码:
            </label>
            <Input
              placeholder="请输入角色编码"
              className="w-48 h-9"
              value={filters.roleCode}
              onChange={(e) => setFilters((prev) => ({ ...prev, roleCode: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              状态:
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="h-9 w-32 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
            >
              <option value="all">全部</option>
              <option value="1">启用</option>
              <option value="0">禁用</option>
            </select>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              重置
            </Button>
            <Button size="sm" className="gap-2" onClick={handleSearch}>
              <Search className="w-4 h-4" />
              搜索
            </Button>
          </div>
        </div>
      </div>

      <RoleTable
        data={data}
        isLoading={isLoading}
        isUpdating={updateMutation.isPending}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <RoleFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingRole={editingRole}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        error={createMutation.error || updateMutation.error}
      />
    </div>
  )
}
