'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useToast } from '@/components/ui/toast'
import { Portfolio, Trade } from '@/lib/data'
import { useRefresh } from '../refresh-provider'

interface DashboardViewProps {
  initialPortfolios: Portfolio[]
  initialTrades: Trade[]
}

export function DashboardView({ initialPortfolios, initialTrades }: DashboardViewProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios)
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>('')
  const [trades, setTrades] = useState<Trade[]>([])
  const [pnlData, setPnlData] = useState<any[]>([])
  const { addToast } = useToast()
  const { refreshTrigger } = useRefresh()

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchPortfolios()
    }
  }, [refreshTrigger])

  useEffect(() => {
    if (portfolios.length > 0 && !selectedPortfolio) {
      const firstPortfolio = portfolios[0]
      setSelectedPortfolio(firstPortfolio.id)
      const portfolioTrades = initialTrades.filter(trade => trade.portfolioId === firstPortfolio.id)
      setTrades(portfolioTrades)
      calculatePnLData(portfolioTrades)
    }
  }, [portfolios, selectedPortfolio, initialTrades])

  useEffect(() => {
    if (selectedPortfolio) {
      const portfolioTrades = initialTrades.filter(trade => trade.portfolioId === selectedPortfolio)
      setTrades(portfolioTrades)
      calculatePnLData(portfolioTrades)
    } else {
      setTrades([])
      setPnlData([])
    }
  }, [selectedPortfolio, initialTrades])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios')
      if (response.ok) {
        const data = await response.json()
        setPortfolios(data)
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error)
      addToast({
        description: 'Failed to fetch portfolios',
        title: 'Error',
        variant: 'destructive'
      })
    }
  }

  const calculatePnLData = (trades: Trade[]) => {
    const portfolio = portfolios.find(p => p.id === selectedPortfolio)
    if (!portfolio) return

    let cumulativePnL = 0
    const data: any[] = []
    
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    sortedTrades.forEach((trade) => {
      if (trade.exitPrice) {
        const tradePnL = (trade.exitPrice - trade.entryPrice) * trade.quantity
        cumulativePnL += tradePnL
        
        data.push({
          date: new Date(trade.date).toLocaleDateString(),
          cumulativePnL: parseFloat(cumulativePnL.toFixed(2)),
          tradePnL: parseFloat(tradePnL.toFixed(2)),
          ticker: trade.ticker
        })
      }
    })

    setPnlData(data)
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          <p className="text-sm">{`Ticker: ${payload[0].payload.ticker}`}</p>
          <p className="text-sm">{`Trade P&L: ${formatCurrency(payload[0].payload.tradePnL)}`}</p>
          <p className="text-sm font-medium">{`Cumulative P&L: ${formatCurrency(payload[0].payload.cumulativePnL)}`}</p>
        </div>
      )
    }
    return null
  }

  if (portfolios.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground text-center">
            No portfolios found. Create your first portfolio to get started!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Dashboard</CardTitle>
          <CardDescription>
            Select a portfolio to view its trades and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a portfolio" />
            </SelectTrigger>
            <SelectContent>
              {portfolios.map((portfolio) => (
                <SelectItem key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedPortfolio && (
        <>
          {/* PnL Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
              <CardDescription>
                Cumulative P&L over time based on closed trades
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pnlData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={pnlData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value)}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Line 
                        type="monotone" 
                        dataKey="cumulativePnL" 
                        stroke="#2563eb" 
                        strokeWidth={2}
                        dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    No closed trades found. Add some trades and close them to see performance data.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trades List */}
          <Card>
            <CardHeader>
              <CardTitle>Trades</CardTitle>
              <CardDescription>
                All trades in the selected portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              {trades.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground text-center">
                    No trades found in this portfolio. Add your first trade to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trades.map((trade) => {
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
                              {formatDate(trade.date)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
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
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 