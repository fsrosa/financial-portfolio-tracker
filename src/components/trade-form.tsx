'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/toast'

interface Portfolio {
  id: string
  name: string
  initialValue: number
}

interface TradeFormProps {
  onTradeCreated: () => void
}

export function TradeForm({ onTradeCreated }: TradeFormProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [selectedPortfolio, setSelectedPortfolio] = useState('')
  const [ticker, setTicker] = useState('')
  const [entryPrice, setEntryPrice] = useState('')
  const [exitPrice, setExitPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [date, setDate] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  useEffect(() => {
    fetchPortfolios()
  }, [])

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

  const showToast = (type: 'success' | 'error', message: string) => {
    addToast({
      description: message,
      title: type === 'error' ? 'Error' : 'Success',
      variant: type === 'error' ? 'destructive' : 'default'
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedPortfolio || !ticker.trim() || !entryPrice.trim() || !quantity.trim() || !date) {
      showToast('error', 'Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/trades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: ticker.trim().toUpperCase(),
          entryPrice: parseFloat(entryPrice),
          exitPrice: exitPrice ? parseFloat(exitPrice) : null,
          quantity: parseInt(quantity),
          date,
          portfolioId: selectedPortfolio,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create trade')
      }

      showToast('success', 'Trade created successfully!')
      setTicker('')
      setEntryPrice('')
      setExitPrice('')
      setQuantity('')
      setDate('')
      onTradeCreated()
    } catch (error) {
      showToast('error', 'Failed to create trade')
    } finally {
      setIsLoading(false)
    }
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Add Trade'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 