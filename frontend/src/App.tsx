import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from '@/components/ui/button'
import NowPage from './pages/NowPage'

function HomePage() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 text-center">
      <div className="flex gap-4">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="w-24 h-24 transition-all hover:scale-110" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="w-24 h-24 transition-all hover:scale-110" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Vite + React + Tailwind v4 + Shadcn UI</h1>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => setCount((count) => count + 1)} size="lg">
          count is {count}
        </Button>
        <Link to="/now">
          <Button variant="secondary">Check DB Time</Button>
        </Link>
        <p className="text-muted-foreground">
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/now" element={<NowPage />} />
    </Routes>
  )
}

export default App
