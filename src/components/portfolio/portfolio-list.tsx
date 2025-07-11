'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PortfolioForm } from './portfolio-form'
import { useToast } from '@/components/ui/toast'

interface Trade {
  id: string
  ticker: string
  entryPrice: number
  exitPrice: number | null
  quantity: number
  date: string
  portfolioId: string
}

interface Portfolio {
  id: string
  name: string
  initialValue: number
  createdAt: string
  trades: Trade[]
}

interface PortfolioListProps {
  refreshTrigger: number
}

export function PortfolioList({ refreshTrigger }: PortfolioListProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null)
  const { addToast } = useToast()

  useEffect(() => {
    fetchPortfolios()
  }, [refreshTrigger])

  const fetchPortfolios = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/portfolios')
      if (response.ok) {
        const data = await response.json()
        setPortfolios(data)
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculatePortfolioPnL = (portfolio: Portfolio) => {
    const totalPnL = portfolio.trades.reduce((sum, trade) => {
      if (trade.exitPrice) {
        const tradePnL = (trade.exitPrice - trade.entryPrice) * trade.quantity
        return sum + tradePnL
      }
      return sum
    }, 0)

    const totalValue = portfolio.initialValue + totalPnL
    const percentageChange = ((totalValue - portfolio.initialValue) / portfolio.initialValue) * 100

    return {
      totalPnL,
      totalValue,
      percentageChange,
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatPercentage = (percentage: number) => {
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`
  }

  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return

    try {
      const response = await fetch(`/api/portfolios?id=${portfolioToDelete.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete portfolio')
      }

      addToast({
        description: 'Portfolio deleted successfully!',
        title: 'Success',
        variant: 'default'
      })
      
      setDeleteDialogOpen(false)
      setPortfolioToDelete(null)
      fetchPortfolios()
    } catch (error) {
      addToast({
        description: error instanceof Error ? error.message : 'Failed to delete portfolio',
        title: 'Error',
        variant: 'destructive'
      })
    }
  }

  const confirmDelete = (portfolio: Portfolio) => {
    setPortfolioToDelete(portfolio)
    setDeleteDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
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
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {portfolios.map((portfolio) => {
          const { totalPnL, totalValue, percentageChange } = calculatePortfolioPnL(portfolio)
          const isPositive = totalPnL >= 0

          return (
            <Card key={portfolio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {portfolio.name}
                  <Badge variant={isPositive ? 'default' : 'destructive'}>
                    {formatPercentage(percentageChange)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Created {new Date(portfolio.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Initial Value:</span>
                    <span className="font-medium">{formatCurrency(portfolio.initialValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total P&L:</span>
                    <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(totalPnL)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Value:</span>
                    <span className="font-medium">{formatCurrency(totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Trades:</span>
                    <span className="font-medium">{portfolio.trades.length}</span>
                  </div>
                  <div className="flex space-x-2 pt-2">
                    <PortfolioForm
                      mode="edit"
                      portfolio={portfolio}
                      onPortfolioUpdated={fetchPortfolios}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(portfolio)}
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Portfolio</DialogTitle>
            <DialogDescription>
              {portfolioToDelete?.trades.length ? (
                <>
                  Cannot delete portfolio "{portfolioToDelete.name}" because it contains {portfolioToDelete.trades.length} trade(s). 
                  Please delete all trades first before deleting the portfolio.
                </>
              ) : (
                <>
                  Are you sure you want to delete portfolio "{portfolioToDelete?.name}"? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={handleDeletePortfolio}
              className="flex-1"
              disabled={!!portfolioToDelete?.trades.length}
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setPortfolioToDelete(null)
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 