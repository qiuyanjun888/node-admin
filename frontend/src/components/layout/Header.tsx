import { useState } from 'react'
import { Menu as MenuIcon, Sun, Moon, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface HeaderProps {
    onSidebarToggle: () => void
    theme: 'light' | 'dark'
    onThemeChange: (theme: 'light' | 'dark') => void
}

export default function Header({
    onSidebarToggle,
    theme,
    onThemeChange,
}: HeaderProps) {
    const [isUserMenuOpen, setUserMenuOpen] = useState(false)

    return (
        <header className="h-16 bg-card border-b flex items-center justify-between px-8 shrink-0 shadow-sm z-10 font-medium">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
                    <MenuIcon className="w-5 h-5" />
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center bg-muted/60 rounded-full p-1 border border-border/50 shadow-inner">
                    <button
                        onClick={() => onThemeChange('light')}
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
                        onClick={() => onThemeChange('dark')}
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
    )
}
