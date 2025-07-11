import { Home } from '@/components/home'
import { getPortfolios, getTrades } from '@/lib/data'

export default async function HomePage() {
  // Fetch data server-side
  const [portfolios, trades] = await Promise.all([
    getPortfolios(),
    getTrades()
  ])

  return (
    <div className="min-h-screen bg-background">
      <Home initialPortfolios={portfolios} initialTrades={trades} />
    </div>
  )
}
