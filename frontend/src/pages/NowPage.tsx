import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Loader2, Calendar } from 'lucide-react'

export default function NowPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['dbTime'],
    queryFn: async () => {
      // Assuming backend runs on 3000
      const response = await axios.get('http://localhost:3000/now')
      return response.data as { time: string }
    },
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8 bg-background text-foreground">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Database Time</h1>
      </div>

      <div className="p-6 border rounded-xl bg-card shadow-sm min-w-[300px] text-center">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Fetching...</span>
          </div>
        ) : error ? (
          <p className="text-destructive">Error: {error.message}</p>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-2">Current Database Timestamp:</p>
            <p className="text-xl font-mono font-semibold">{data?.time}</p>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={() => refetch()} variant="outline">
          Refresh Time
        </Button>
        <Link to="/">
          <Button variant="ghost">Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
