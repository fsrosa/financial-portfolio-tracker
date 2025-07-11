'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Trade {
  id: string
  ticker: string
  entryPrice: number
  exitPrice: number | null
  quantity: number
  date: string
  portfolio: {
    id: string
    name: string
  }
}

interface TradeListProps {
  refreshTrigger: number
}

export function TradeList({ refreshTrigger }: TradeListProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTrades()
  }, [refreshTrigger])

  const fetchTrades = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/trades')
      if (response.ok) {
        const data = await response.json()
        setTrades(data)
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateTradePnL = (trade: Trade) => {
    if (!trade.exitPrice) return null
    return (trade.exitPrice - trade.entryPrice) * trade.quantity
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-muted-foreground">Loading trades...</p>
        </CardContent>
      </Card>
    )
  }

  if (trades.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground text-center">
            No trades found. Add your first trade to get started!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>
          Your latest trading activity across all portfolios
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trades.slice(0, 10).map((trade) => {
            const pnl = calculateTradePnL(trade)
            const isPositive = pnl && pnl > 0
            const isOpen = !trade.exitPrice

            return (
              <div
                key={trade.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="font-medium">{trade.ticker}</div>
                    <div className="text-sm text-muted-foreground">
                      {trade.portfolio.name}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {trade.quantity} shares
                    </span>
                    <Badge variant={isOpen ? 'secondary' : isPositive ? 'default' : 'destructive'}>
                      {isOpen ? 'Open' : isPositive ? 'Profit' : 'Loss'}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    {formatCurrency(trade.entryPrice)} → {trade.exitPrice ? formatCurrency(trade.exitPrice) : 'Open'}
                  </div>
                  {pnl && (
                    <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(pnl)}
                    </div>
                  )}
                  <div className="text-xs text-muted-foreground">
                    {formatDate(trade.date)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 