import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export interface PermissionFormData {
  name: string
  type: number
  parentId: number
  path: string
  component: string
  sortOrder: number
  isVisible: number
  permissionCode: string
  status: number
}

export interface PermissionOption {
  id: number
  label: string
  disabled?: boolean
}

interface PermissionFormModalProps {
  isOpen: boolean
  title: string
  formData: PermissionFormData
  parentOptions: PermissionOption[]
  isPending: boolean
  error?: Error | null
  onClose: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onChange: (next: PermissionFormData) => void
}

export function PermissionFormModal({
  isOpen,
  title,
  formData,
  parentOptions,
  isPending,
  error,
  onClose,
  onSubmit,
  onChange,
}: PermissionFormModalProps) {
  const updateField = <K extends keyof PermissionFormData>(key: K, value: PermissionFormData[K]) => {
    onChange({ ...formData, [key]: value })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium">权限名称</label>
          <Input
            value={formData.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="请输入权限名称"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">权限类型</label>
            <select
              value={formData.type}
              onChange={(event) => updateField('type', Number(event.target.value))}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={1}>目录</option>
              <option value={2}>菜单</option>
              <option value={3}>按钮</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">上级权限</label>
            <select
              value={formData.parentId}
              onChange={(event) => updateField('parentId', Number(event.target.value))}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={0}>根节点</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {formData.type !== 3 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">路由路径</label>
              <Input
                value={formData.path}
                onChange={(event) => updateField('path', event.target.value)}
                placeholder="例如 /system/user"
              />
            </div>
            {formData.type === 2 ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">组件路径</label>
                <Input
                  value={formData.component}
                  onChange={(event) => updateField('component', event.target.value)}
                  placeholder="例如 system/user/index"
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-sm font-medium">权限标识</label>
            <Input
              value={formData.permissionCode}
              onChange={(event) => updateField('permissionCode', event.target.value)}
              placeholder="例如 sys:user:add"
            />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">排序</label>
            <Input
              type="number"
              value={formData.sortOrder}
              onChange={(event) => updateField('sortOrder', Number(event.target.value))}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">显示状态</label>
            <select
              value={formData.isVisible}
              onChange={(event) => updateField('isVisible', Number(event.target.value))}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={1}>显示</option>
              <option value={0}>隐藏</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">启用状态</label>
            <select
              value={formData.status}
              onChange={(event) => updateField('status', Number(event.target.value))}
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value={1}>启用</option>
              <option value={0}>禁用</option>
            </select>
          </div>
        </div>

        {error ? <div className="text-sm text-destructive">保存失败: {error.message}</div> : null}

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? '处理中...' : '保存'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
