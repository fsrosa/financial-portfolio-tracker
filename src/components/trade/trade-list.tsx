'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { TradeCard } from './trade-card'
import { useToast } from '@/components/ui/toast'
import { Trade, Portfolio } from '@/lib/data'
import { useRefresh } from '../refresh-provider'

interface TradeListProps {
  initialTrades: Trade[]
  initialPortfolios: Portfolio[]
}

export function TradeList({ initialTrades, initialPortfolios }: TradeListProps) {
  const [trades, setTrades] = useState<Trade[]>(initialTrades)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [tradeToDelete, setTradeToDelete] = useState<Trade | null>(null)
  const { addToast } = useToast()
  const { refreshTrigger, triggerRefresh } = useRefresh()

  useEffect(() => {
    setTrades(initialTrades)
  }, [initialTrades])

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchTrades()
    }
  }, [refreshTrigger])

  const fetchTrades = async () => {
    try {
      const response = await fetch('/api/trades')
      if (response.ok) {
        const data = await response.json()
        setTrades(data)
      }
    } catch (error) {
      console.error('Failed to fetch trades:', error)
    }
  }



  const handleDeleteTrade = async () => {
    if (!tradeToDelete) return

    try {
      const { deleteTrade } = await import('@/lib/actions')
      await deleteTrade(tradeToDelete.id)

      addToast({
        description: 'Trade deleted successfully!',
        title: 'Success',
        variant: 'default'
      })
      
      setDeleteDialogOpen(false)
      setTradeToDelete(null)
      triggerRefresh()
    } catch (error) {
      addToast({
        description: 'Failed to delete trade',
        title: 'Error',
        variant: 'destructive'
      })
    }
  }

  const confirmDelete = (trade: Trade) => {
    setTradeToDelete(trade)
    setDeleteDialogOpen(true)
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
          <CardDescription>
            Your latest trading activity across all portfolios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trades.slice(0, 10).map((trade) => (
              <TradeCard
                key={trade.id}
                trade={trade}
                portfolios={initialPortfolios}
                onTradeUpdated={triggerRefresh}
                onDelete={confirmDelete}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Trade</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this trade? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex space-x-2">
            <Button
              variant="destructive"
              onClick={handleDeleteTrade}
              className="flex-1"
            >
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false)
                setTradeToDelete(null)
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