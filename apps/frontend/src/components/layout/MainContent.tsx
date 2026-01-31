import { Outlet } from 'react-router-dom'

export default function MainContent() {
  return (
    <main className="flex-1 overflow-y-auto p-8 scroll-smooth bg-background">
      <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Outlet />
      </div>
    </main>
  )
}
