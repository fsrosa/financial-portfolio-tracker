'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/toast'
import { Portfolio } from '@/lib/data'

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

interface TradeFormProps {
  mode: 'create' | 'edit'
  trade?: Trade
  portfolios: Portfolio[]
  onTradeCreated?: () => void
  onTradeUpdated?: () => void
  trigger?: React.ReactNode
}

export function TradeForm({ mode, trade, portfolios, onTradeCreated, onTradeUpdated, trigger }: TradeFormProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState(trade?.portfolio.id || '')
  const [ticker, setTicker] = useState(trade?.ticker || '')
  const [entryPrice, setEntryPrice] = useState(trade?.entryPrice.toString() || '')
  const [exitPrice, setExitPrice] = useState(trade?.exitPrice?.toString() || '')
  const [quantity, setQuantity] = useState(trade?.quantity.toString() || '')
  const [date, setDate] = useState(trade?.date.split('T')[0] || '')
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { addToast } = useToast()

  const isEditMode = mode === 'edit'

  const showToast = (type: 'success' | 'error', message: string) => {
    addToast({
      description: message,
      title: type === 'error' ? 'Error' : 'Success',
      variant: type === 'error' ? 'destructive' : 'default'
    })
  }

  const resetForm = () => {
    if (isEditMode && trade) {
      setSelectedPortfolio(trade.portfolio.id)
      setTicker(trade.ticker)
      setEntryPrice(trade.entryPrice.toString())
      setExitPrice(trade.exitPrice?.toString() || '')
      setQuantity(trade.quantity.toString())
      setDate(trade.date.split('T')[0])
    } else {
      setSelectedPortfolio('')
      setTicker('')
      setEntryPrice('')
      setExitPrice('')
      setQuantity('')
      setDate('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPortfolio || !ticker.trim() || !entryPrice.trim() || !quantity.trim() || !date) {
      showToast('error', 'Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      if (isEditMode) {
        // Use server action for update
        const { updateTrade } = await import('@/lib/actions')
        const formData = new FormData()
        formData.append('id', trade!.id)
        formData.append('ticker', ticker.trim().toUpperCase())
        formData.append('entryPrice', entryPrice)
        formData.append('exitPrice', exitPrice || '')
        formData.append('quantity', quantity)
        formData.append('date', date)
        formData.append('portfolioId', selectedPortfolio)
        
        await updateTrade(formData)
        showToast('success', 'Trade updated successfully!')
        setIsOpen(false)
        onTradeUpdated?.()
      } else {
        // Use server action for create
        const { createTrade } = await import('@/lib/actions')
        const formData = new FormData()
        formData.append('ticker', ticker.trim().toUpperCase())
        formData.append('entryPrice', entryPrice)
        formData.append('exitPrice', exitPrice || '')
        formData.append('quantity', quantity)
        formData.append('date', date)
        formData.append('portfolioId', selectedPortfolio)
        
        await createTrade(formData)
        showToast('success', 'Trade created successfully!')
        resetForm()
        onTradeCreated?.()
      }
    } catch (error) {
      showToast('error', `Failed to ${isEditMode ? 'update' : 'create'} trade`)
    } finally {
      setIsLoading(false)
    }
  }

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="portfolio">Portfolio</Label>
        <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
          <SelectTrigger>
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="ticker">Ticker Symbol</Label>
        <Input
          id="ticker"
          type="text"
          placeholder="e.g., AAPL"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="entryPrice">Entry Price ($)</Label>
        <Input
          id="entryPrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="150.00"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="exitPrice">Exit Price ($) - Optional</Label>
        <Input
          id="exitPrice"
          type="number"
          step="0.01"
          min="0"
          placeholder="160.00"
          value={exitPrice}
          onChange={(e) => setExitPrice(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="1"
          placeholder="100"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Trade Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      {isEditMode ? (
        <div className="flex space-x-2">
          <Button type="submit" className="flex-1" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Trade'}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Add Trade'}
        </Button>
      )}
    </form>
  )

  if (isEditMode) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) {
          resetForm()
        }
      }}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Trade</DialogTitle>
            <DialogDescription>
              Update the details of your trade entry
            </DialogDescription>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Add New Trade</CardTitle>
        <CardDescription>
          Record a new stock trade for your portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formContent}
      </CardContent>
    </Card>
  )
} 