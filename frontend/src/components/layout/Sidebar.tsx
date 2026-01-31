import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    Settings,
    Users,
    Menu as MenuIcon,
    ShieldCheck,
    ChevronDown,
    LayoutDashboard,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
    isOpen: boolean
}

export default function Sidebar({ isOpen }: SidebarProps) {
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
            ],
        },
    ]

    return (
        <aside
            className={cn(
                'bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col',
                isOpen ? 'w-64' : 'w-20',
            )}
        >
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                <div className="bg-sidebar-primary w-8 h-8 rounded-lg flex items-center justify-center">
                    <span className="text-sidebar-primary-foreground font-bold italic">NA</span>
                </div>
                {isOpen && (
                    <span className="ml-3 font-bold text-xl tracking-tight text-sidebar-foreground">
                        NodeAdmin
                    </span>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
                <Link
                    to="/"
                    className={cn(
                        'flex items-center px-3 py-2 rounded-lg transition-colors group',
                        location.pathname === '/'
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                            : 'hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground',
                    )}
                >
                    <LayoutDashboard className="w-5 h-5 shrink-0" />
                    {isOpen && <span className="ml-3 font-medium">控制台</span>}
                </Link>

                {navItems.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                        <button
                            onClick={() => item.setOpen(!item.isOpen)}
                            className={cn(
                                'w-full flex items-center px-3 py-2 rounded-lg transition-colors group',
                                'hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground font-medium',
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0 text-sidebar-primary/80" />
                            {isOpen && (
                                <>
                                    <span className="ml-3 flex-1 text-left">{item.title}</span>
                                    <ChevronDown
                                        className={cn(
                                            'w-4 h-4 transition-transform opacity-50',
                                            item.isOpen && 'rotate-180',
                                        )}
                                    />
                                </>
                            )}
                        </button>

                        {isOpen && item.isOpen && (
                            <div className="ml-4 pl-4 border-l border-sidebar-border space-y-1 mt-1">
                                {item.children.map((child, childIdx) => (
                                    <Link
                                        key={childIdx}
                                        to={child.path}
                                        className={cn(
                                            'flex items-center px-3 py-2 rounded-lg text-sm transition-colors',
                                            location.pathname === child.path
                                                ? 'bg-sidebar-accent text-sidebar-foreground font-semibold'
                                                : 'text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
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
        </aside>
    )
}
