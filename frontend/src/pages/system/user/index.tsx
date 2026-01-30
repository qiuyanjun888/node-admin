import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import api from '@/lib/api'
import type { User, PageResult } from '@/types/system'
import { Loader2, Plus, Pencil, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export default function UserManagement() {
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<User | null>(null)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        nickname: '',
        email: '',
        status: 1, // 1: Enable, 0: Disable
    })

    // Fetch users
    const { data, isLoading, error } = useQuery<PageResult<User>>({
        queryKey: ['system', 'users'],
        queryFn: () => api.get('/system/users', { params: { page: 1, pageSize: 10 } }),
    })

    // Create user mutation
    const createMutation = useMutation({
        mutationFn: (userData: typeof formData) => api.post('/system/users', userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system', 'users'] })
            handleCloseModal()
        },
        onError: (err: any) => {
            console.error('Create User Error:', err)
        },
    })

    // Update user mutation (Partial update)
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<typeof formData> }) =>
            api.patch(`/system/users/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['system', 'users'] })
            handleCloseModal()
        },
        onError: (err: any) => {
            console.error('Update User Error:', err)
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingUser) {
            const updateData: any = { ...formData }
            if (!updateData.password) delete updateData.password
            updateMutation.mutate({ id: editingUser.id, data: updateData })
        } else {
            createMutation.mutate(formData)
        }
    }

    const handleEdit = (user: User) => {
        setEditingUser(user)
        setFormData({
            username: user.username,
            password: '', // Password is not returned from API
            nickname: user.nickname || '',
            email: user.email || '',
            status: user.status,
        })
        setIsModalOpen(true)
    }

    const handleToggleStatus = (user: User) => {
        const newStatus = user.status === 1 ? 0 : 1
        updateMutation.mutate({
            id: user.id,
            data: { status: newStatus }
        })
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingUser(null)
        setFormData({ username: '', password: '', nickname: '', email: '', status: 1 })
        createMutation.reset()
        updateMutation.reset()
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-destructive gap-4">
                <AlertCircle className="w-12 h-12" />
                <p className="font-medium">加载失败: {(error as Error).message}</p>
                <Button variant="outline" onClick={() => queryClient.invalidateQueries({ queryKey: ['system', 'users'] })}>
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

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/30 transition-colors">
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">ID</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">用户名</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">昵称</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">邮箱</th>
                                <th className="h-12 px-6 text-left align-middle font-medium text-muted-foreground">状态</th>
                                <th className="h-12 px-6 text-right align-middle font-medium text-muted-foreground">操作</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                            <span className="text-muted-foreground font-medium">数据加载中...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data?.items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="h-32 text-center text-muted-foreground italic">
                                        暂无用户数据
                                    </td>
                                </tr>
                            ) : (
                                data?.items.map((user) => (
                                    <tr key={user.id} className="transition-colors hover:bg-muted/30">
                                        <td className={cn(
                                            "px-6 py-4 align-middle font-mono transition-colors",
                                            user.status === 1 ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {user.id}
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-3">
                                                <span className={cn(
                                                    "font-bold transition-colors",
                                                    user.status === 1 ? "text-foreground" : "text-muted-foreground"
                                                )}>
                                                    {user.username}
                                                </span>
                                            </div>
                                        </td>
                                        <td className={cn(
                                            "px-6 py-4 align-middle transition-colors font-medium",
                                            user.status === 1 ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {user.nickname || '-'}
                                        </td>
                                        <td className={cn(
                                            "px-6 py-4 align-middle transition-colors",
                                            user.status === 1 ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {user.email || '-'}
                                        </td>
                                        <td className="px-6 py-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={user.status === 1}
                                                    onCheckedChange={() => handleToggleStatus(user)}
                                                    disabled={updateMutation.isPending}
                                                />
                                                <span className={cn(
                                                    "text-xs font-medium",
                                                    user.status === 1 ? "text-green-600" : "text-muted-foreground"
                                                )}>
                                                    {user.status === 1 ? '启用' : '禁用'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 align-middle text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-primary"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingUser ? "编辑系统用户" : "新增系统用户"}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className={cn("grid gap-4", !editingUser ? "grid-cols-2" : "grid-cols-1")}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground/70">
                                用户名 <span className="text-destructive">*</span>
                            </label>
                            <Input
                                required
                                placeholder="用户名"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        {!editingUser && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none text-foreground/70">
                                    账号状态
                                </label>
                                <div className="flex items-center h-10 gap-3 px-3 border rounded-md bg-secondary/20">
                                    <Switch
                                        checked={formData.status === 1}
                                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 1 : 0 })}
                                    />
                                    <span className="text-sm">{formData.status === 1 ? '启用' : '禁用'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {!editingUser && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-foreground/70">
                                初始密码 <span className="text-destructive">*</span>
                            </label>
                            <Input
                                required={!editingUser}
                                type="password"
                                placeholder="请输入密码 (至少 6 位)"
                                minLength={6}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground/70">
                            用户昵称
                        </label>
                        <Input
                            placeholder="请输入昵称"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-foreground/70">
                            电子邮箱
                        </label>
                        <Input
                            type="email"
                            placeholder="请输入邮箱"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    {(createMutation.error || updateMutation.error) && (
                        <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="w-4 h-4" />
                            <span>
                                {(createMutation.error as any)?.message || (updateMutation.error as any)?.message || '操作失败，请重试'}
                            </span>
                        </div>
                    )}

                    <div className="pt-6 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCloseModal}
                        >
                            取消
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMutation.isPending || updateMutation.isPending}
                            className="min-w-[80px] shadow-sm"
                        >
                            {(createMutation.isPending || updateMutation.isPending) ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                '提交'
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
