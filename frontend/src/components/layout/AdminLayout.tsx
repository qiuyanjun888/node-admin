import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
    Settings,
    Users,
    Menu as MenuIcon,
    ShieldCheck,
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Bell,
    Search
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function AdminLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true)
    const [isSystemMenuOpen, setSystemMenuOpen] = useState(true)
    const location = useLocation()

    const navItems = [
        {
            title: '系统管理',
            icon: Settings,
            isOpen: isSystemMenuOpen,
            setOpen: setSystemMenuOpen,
            children: [
                { title: '菜单管理', path: '/system/menu', icon: MenuIcon },
                { title: '用户管理', path: '/system/user', icon: Users },
                { title: '权限管理', path: '/system/permission', icon: ShieldCheck },
            ]
        }
    ]

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card border-r transition-all duration-300 ease-in-out flex flex-col",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="h-16 flex items-center px-6 border-b">
                    <div className="bg-primary w-8 h-8 rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold italic">NA</span>
                    </div>
                    {isSidebarOpen && <span className="ml-3 font-bold text-xl tracking-tight">NodeAdmin</span>}
                </div>

                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                    <Link
                        to="/"
                        className={cn(
                            "flex items-center px-3 py-2 rounded-lg transition-colors group",
                            location.pathname === "/" ? "bg-primary text-primary-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5 shrink-0" />
                        {isSidebarOpen && <span className="ml-3 font-medium">控制台</span>}
                    </Link>

                    {navItems.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                            <button
                                onClick={() => item.setOpen(!item.isOpen)}
                                className={cn(
                                    "w-full flex items-center px-3 py-2 rounded-lg transition-colors group",
                                    "hover:bg-accent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {isSidebarOpen && (
                                    <>
                                        <span className="ml-3 font-medium flex-1 text-left">{item.title}</span>
                                        <ChevronDown className={cn("w-4 h-4 transition-transform", item.isOpen && "rotate-180")} />
                                    </>
                                )}
                            </button>

                            {isSidebarOpen && item.isOpen && (
                                <div className="ml-4 pl-4 border-l space-y-1">
                                    {item.children.map((child, childIdx) => (
                                        <Link
                                            key={childIdx}
                                            to={child.path}
                                            className={cn(
                                                "flex items-center px-3 py-2 rounded-lg text-sm transition-colors",
                                                location.pathname === child.path
                                                    ? "bg-secondary text-secondary-foreground font-medium"
                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                            )}
                                        >
                                            <span>{child.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="ml-3">退出登录</span>}
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-card border-b flex items-center justify-between px-8 shrink-0 shadow-sm z-10 font-medium">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
                            <MenuIcon className="w-5 h-5" />
                        </Button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="search"
                                placeholder="搜索..."
                                className="pl-9 pr-4 py-2 bg-secondary rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-normal"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
                        </Button>
                        <div className="flex items-center gap-3 pl-4 border-l">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold leading-none text-foreground">Admin</p>
                                <p className="text-xs text-muted-foreground mt-1">超级管理员</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white/20 shadow-sm"></div>
                        </div>
                    </div>
                </header>

                {/* Dynamic content */}
                <main className="flex-1 overflow-y-auto p-8 scroll-smooth bg-secondary/30">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}
