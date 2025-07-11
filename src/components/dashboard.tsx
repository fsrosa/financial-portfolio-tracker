'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortfolioForm } from './portfolio-form'
import { TradeForm } from './trade-form'
import { PortfolioList } from './portfolio-list'
import { TradeList } from './trade-list'
import { Plus } from 'lucide-react'

export function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false)
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)

  const handlePortfolioCreated = () => {
    setRefreshTrigger(prev => prev + 1)
    setIsPortfolioDialogOpen(false)
  }

  const handleTradeCreated = () => {
    setRefreshTrigger(prev => prev + 1)
    setIsTradeDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Financial Portfolio Tracker</h1>
          <p className="text-muted-foreground">
            Track your investment portfolios and analyze your trading performance
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPortfolioDialogOpen} onOpenChange={setIsPortfolioDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Portfolio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Portfolio</DialogTitle>
              </DialogHeader>
              <PortfolioForm onPortfolioCreated={handlePortfolioCreated} />
            </DialogContent>
          </Dialog>

          <Dialog open={isTradeDialogOpen} onOpenChange={setIsTradeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Trade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Trade</DialogTitle>
              </DialogHeader>
              <TradeForm onTradeCreated={handleTradeCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="portfolios" className="space-y-4">
        <TabsList>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolios" className="space-y-4">
          <PortfolioList refreshTrigger={refreshTrigger} />
        </TabsContent>
        
        <TabsContent value="trades" className="space-y-4">
          <TradeList refreshTrigger={refreshTrigger} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 