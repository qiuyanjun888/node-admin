import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { Switch } from '@/components/ui/switch'
import { Loader2 } from 'lucide-react'
import type { Role } from '@/types/system'

interface RoleFormModalProps {
  isOpen: boolean
  onClose: () => void
  editingRole: Role | null
  formData: {
    roleName: string
    roleCode: string
    description: string
    status: number
  }
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  isPending: boolean
  error: any
}

export function RoleFormModal({
  isOpen,
  onClose,
  editingRole,
  formData,
  setFormData,
  onSubmit,
  isPending,
  error,
}: RoleFormModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingRole ? '编辑角色' : '新增角色'}>
      <form onSubmit={onSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">角色名称</label>
          <Input
            placeholder="请输入角色名称"
            value={formData.roleName}
            onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">角色编码</label>
          <Input
            placeholder="请输入角色编码 (如 admin)"
            value={formData.roleCode}
            onChange={(e) => setFormData({ ...formData, roleCode: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">描述</label>
          <Input
            placeholder="请输入职位或角色描述"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4 py-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">状态</label>
            <Switch
              checked={formData.status === 1}
              onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? 1 : 0 })}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {formData.status === 1 ? '启用' : '禁用'}
          </span>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">
            操作失败: {(error as Error).message}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
            取消
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            确定
          </Button>
        </div>
      </form>
    </Modal>
  )
}
