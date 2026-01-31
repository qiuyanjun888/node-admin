import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, AlertCircle, Search, RotateCcw } from 'lucide-react'
import type { User } from '@/types/system'
import { useUserActions } from './hooks/useUserActions'
import { UserTable } from './components/UserTable'
import { UserFormModal } from './components/UserFormModal'

const INITIAL_FORM_STATE = {
  username: '',
  password: '',
  nickname: '',
  email: '',
  status: 1,
}

export default function UserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  // 用于绑定输入框的状态
  const [filters, setFilters] = useState<{ username: string; status: string }>({
    username: '',
    status: 'all',
  })
  // 用于触发实际搜索的状态
  const [queryParams, setQueryParams] = useState({
    username: '',
    status: 'all',
  })

  const { usersQuery, createMutation, updateMutation, handleToggleStatus } = useUserActions(
    page,
    pageSize,
    {
      username: queryParams.username || undefined,
      status: queryParams.status === 'all' ? undefined : Number(queryParams.status),
    },
  )

  const handleSearch = () => {
    setQueryParams(filters)
    setPage(1)
  }

  const handleReset = () => {
    const resetFilters = { username: '', status: 'all' }
    setFilters(resetFilters)
    setQueryParams(resetFilters)
    setPage(1)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setFormData(INITIAL_FORM_STATE)
    createMutation.reset()
    updateMutation.reset()
  }

  const { data, isLoading, error, refetch } = usersQuery

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingUser) {
      const { password, ...updateData } = formData
      // Only send password if it's explicitly provided (though hidden in UI for edit)
      const submissionData = password ? formData : updateData
      updateMutation.mutate(
        { id: editingUser.id, data: submissionData },
        { onSuccess: handleCloseModal },
      )
    } else {
      createMutation.mutate(formData, { onSuccess: handleCloseModal })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: '',
      nickname: user.nickname || '',
      email: user.email || '',
      status: user.status,
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
          <h2 className="text-3xl font-bold tracking-tight text-foreground/90">用户管理</h2>
          <p className="text-muted-foreground mt-1 text-sm">维护后台管理员账号及启用状态。</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          新增用户
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-card border rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              用户名:
            </label>
            <Input
              placeholder="请输入用户名"
              className="w-48 h-9"
              value={filters.username}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, username: e.target.value }))
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              状态:
            </label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }}
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

      <UserTable
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

      <UserFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        error={createMutation.error || updateMutation.error}
      />
    </div>
  )
}
