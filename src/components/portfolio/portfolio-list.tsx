'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PortfolioCard } from './portfolio-card'
import { useToast } from '@/components/ui/toast'
import { Portfolio } from '@/lib/data'
import { useRefresh } from '../refresh-provider'

interface PortfolioListProps {
  initialPortfolios: Portfolio[]
}

export function PortfolioList({ initialPortfolios }: PortfolioListProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null)
  const { addToast } = useToast()
  const { refreshTrigger, triggerRefresh } = useRefresh()

  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchPortfolios()
    }
  }, [refreshTrigger])

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios')
      if (response.ok) {
        const data = await response.json()
        setPortfolios(data)
      }
    } catch (error) {
      console.error('Failed to fetch portfolios:', error)
    }
  }

  const handleDeletePortfolio = async () => {
    if (!portfolioToDelete) return

    try {
      const { deletePortfolio } = await import('@/lib/actions')
      await deletePortfolio(portfolioToDelete.id)

      addToast({
        description: 'Portfolio deleted successfully!',
        title: 'Success',
        variant: 'default'
      })
      
      setDeleteDialogOpen(false)
      setPortfolioToDelete(null)
      triggerRefresh()
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
        {portfolios.map((portfolio) => (
          <PortfolioCard
            key={portfolio.id}
            portfolio={portfolio}
            onPortfolioUpdated={triggerRefresh}
            onDelete={confirmDelete}
          />
        ))}
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