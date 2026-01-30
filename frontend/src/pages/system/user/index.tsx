import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle } from 'lucide-react'
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

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingUser(null)
        setFormData(INITIAL_FORM_STATE)
        createMutation.reset()
        updateMutation.reset()
    }

    const {
        usersQuery,
        createMutation,
        updateMutation,
        handleToggleStatus
    } = useUserActions(handleCloseModal)

    const { data, isLoading, error, refetch } = usersQuery

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingUser) {
            const { password, ...updateData } = formData
            // Only send password if it's explicitly provided (though hidden in UI for edit)
            const submissionData = password ? formData : updateData
            updateMutation.mutate({ id: editingUser.id, data: submissionData })
        } else {
            createMutation.mutate(formData)
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

            <UserTable
                data={data}
                isLoading={isLoading}
                isUpdating={updateMutation.isPending}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
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
