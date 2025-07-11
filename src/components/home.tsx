'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PortfolioForm } from '@/components/portfolio/portfolio-form'
import { TradeForm } from '@/components/trade/trade-form'
import { PortfolioList } from '@/components/portfolio/portfolio-list'
import { TradeList } from '@/components/trade/trade-list'
import { DashboardView } from '@/components/dashboard/dashboard'
import { Plus } from 'lucide-react'
import { Portfolio, Trade } from '@/lib/data'
import { useRefresh } from './refresh-provider'

interface HomeProps {
  initialPortfolios: Portfolio[]
  initialTrades: Trade[]
}

export function Home({ initialPortfolios, initialTrades }: HomeProps) {
  const { triggerRefresh } = useRefresh()
  const [isPortfolioDialogOpen, setIsPortfolioDialogOpen] = useState(false)
  const [isTradeDialogOpen, setIsTradeDialogOpen] = useState(false)

  const handlePortfolioCreated = () => {
    triggerRefresh()
    setIsPortfolioDialogOpen(false)
  }

  const handleTradeCreated = () => {
    triggerRefresh()
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
              <PortfolioForm mode="create" onPortfolioCreated={handlePortfolioCreated} />
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
              <TradeForm mode="create" portfolios={initialPortfolios} onTradeCreated={handleTradeCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="trades">Recent Trades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <DashboardView 
            initialPortfolios={initialPortfolios}
            initialTrades={initialTrades}
          />
        </TabsContent>
        
        <TabsContent value="portfolios" className="space-y-4">
          <PortfolioList 
            initialPortfolios={initialPortfolios}
          />
        </TabsContent>
        
        <TabsContent value="trades" className="space-y-4">
          <TradeList 
            initialTrades={initialTrades}
            initialPortfolios={initialPortfolios}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 