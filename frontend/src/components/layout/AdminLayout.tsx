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
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isSystemMenuOpen, setSystemMenuOpen] = useState(true)
  const [isUserMenuOpen, setUserMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme') as 'light' | 'dark'
      if (saved) return saved
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })
  const location = useLocation()

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only sync if user hasn't manually set a preference in this session OR we want strict follow
      // Here we prioritize immediate feedback to system changes
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])


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
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col',
          isSidebarOpen ? 'w-64' : 'w-20',
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
          <div className="bg-sidebar-primary w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-sidebar-primary-foreground font-bold italic">NA</span>
          </div>
          {isSidebarOpen && (
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
            {isSidebarOpen && <span className="ml-3 font-medium">控制台</span>}
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
                {isSidebarOpen && (
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

              {isSidebarOpen && item.isOpen && (
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-8 shrink-0 shadow-sm z-10 font-medium">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              <MenuIcon className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-muted/60 rounded-full p-1 border border-border/50 shadow-inner">
              <button
                onClick={() => setTheme('light')}
                className={cn(
                  'p-1.5 rounded-full transition-all duration-300 flex items-center justify-center',
                  theme === 'light'
                    ? 'bg-card text-primary shadow-md scale-110 active:scale-100'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted opacity-60 hover:opacity-100',
                )}
                title="浅色模式"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={cn(
                  'p-1.5 rounded-full transition-all duration-300 flex items-center justify-center',
                  theme === 'dark'
                    ? 'bg-card text-primary shadow-md scale-110 active:scale-100'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted opacity-60 hover:opacity-100',
                )}
                title="深色模式"
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-80 transition-opacity"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold leading-none text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground mt-1 text-right">超级管理员</p>
                </div>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-muted-foreground transition-transform',
                    isUserMenuOpen && 'rotate-180',
                  )}
                />
              </button>

              {isUserMenuOpen && (
                <>
                  {/* Backdrop for click-outside */}
                  <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-card border rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b sm:hidden">
                      <p className="text-sm font-semibold text-foreground">Admin</p>
                      <p className="text-xs text-muted-foreground">超级管理员</p>
                    </div>
                    <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic content */}
        <main className="flex-1 overflow-y-auto p-8 scroll-smooth bg-background">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
