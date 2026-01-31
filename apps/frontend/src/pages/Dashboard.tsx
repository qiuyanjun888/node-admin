import { Users, Activity, Database, ShieldCheck } from 'lucide-react'

export default function Dashboard() {
  const stats = [
    { name: '总用户数', value: '1,284', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    {
      name: '今日活跃',
      value: '84',
      icon: Activity,
      color: 'text-green-600',
      bg: 'bg-green-600/10',
    },
    {
      name: '数据库负载',
      value: '12%',
      icon: Database,
      color: 'text-secondary-foreground',
      bg: 'bg-secondary',
    },
    {
      name: '权限变更',
      value: '3',
      icon: ShieldCheck,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">控制台</h2>
        <p className="text-muted-foreground mt-2">欢迎回来，这是您的系统概览。</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-muted-foreground">
              <span className="text-green-600 font-medium">+12%</span>
              <span className="ml-1.5">较上周</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg pb-4 border-b mb-4 text-foreground">最近活动</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                <div>
                  <p className="text-sm font-medium">管理员 修改了用户权限</p>
                  <p className="text-xs text-muted-foreground mt-0.5">2 小时前</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg pb-4 border-b mb-4 text-foreground">系统状态</h3>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">API 服务器</span>
              <span className="text-green-600 font-medium">正常</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">数据库</span>
              <span className="text-green-600 font-medium">正常</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">缓存服务</span>
              <span className="text-green-600 font-medium">正常</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
