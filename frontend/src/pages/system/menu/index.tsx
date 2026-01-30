import { Button } from '@/components/ui/button'

export default function MenuManagement() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">菜单管理</h2>
                <div className="flex items-center space-x-2">
                    <Button>新增菜单</Button>
                </div>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                <div className="p-6">
                    <div className="text-muted-foreground text-sm">
                        这里是菜单管理页面。您可以在此配置系统的导航树。
                    </div>
                    <div className="mt-6">
                        {/* Tree table component would go here */}
                        <div className="text-sm text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                            菜单树加载中...
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
