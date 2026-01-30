import { Button } from '@/components/ui/button'

export default function PermissionManagement() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">权限管理</h2>
                <div className="flex items-center space-x-2">
                    <Button>新增角色</Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <div className="text-muted-foreground text-sm">
                        管理系统角色及其对应的权限分配。
                    </div>
                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ID</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">角色名称</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">角色标识</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">描述</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">1</td>
                                    <td className="p-4 align-middle">超级管理员</td>
                                    <td className="p-4 align-middle">SUPER_ADMIN</td>
                                    <td className="p-4 align-middle">拥有所有权限</td>
                                    <td className="p-4 align-middle">
                                        <Button variant="ghost" size="sm">授权</Button>
                                        <Button variant="ghost" size="sm" className="text-destructive">删除</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
