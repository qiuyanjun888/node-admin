import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Loader2, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User } from '@/types/system'

interface UserFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingUser: User | null
  formData: Partial<User> & { password?: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
  error: Error | null
}

export function UserFormModal({
  isOpen,
  onClose,
  editingUser,
  formData,
  setFormData,
  onSubmit,
  isPending,
  error,
}: UserFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingUser ? '编辑系统用户' : '新增系统用户'}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className={cn('grid gap-4', !editingUser ? 'grid-cols-2' : 'grid-cols-1')}>
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
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, status: checked ? 1 : 0 })
                  }
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
          <label className="text-sm font-medium leading-none text-foreground/70">用户昵称</label>
          <Input
            placeholder="请输入昵称"
            value={formData.nickname}
            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none text-foreground/70">电子邮箱</label>
          <Input
            type="email"
            placeholder="请输入邮箱"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm rounded-md bg-destructive/10 text-destructive animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="w-4 h-4" />
            <span>{error?.message || '操作失败，请重试'}</span>
          </div>
        )}

        <div className="pt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" disabled={isPending} className="min-w-[80px] shadow-sm">
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : '提交'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
