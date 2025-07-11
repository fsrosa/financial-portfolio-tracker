'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TradeForm } from './trade-form'
import { Trade, Portfolio } from '@/lib/data'

interface TradeCardProps {
  trade: Trade
  portfolios: Portfolio[]
  onTradeUpdated: () => void
  onDelete: (trade: Trade) => void
}

export function TradeCard({ trade, portfolios, onTradeUpdated, onDelete }: TradeCardProps) {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const pnl = calculateTradePnL(trade)
  const isPositive = pnl && pnl > 0
  const isOpen = !trade.exitPrice
  const pnlPercentage = trade.exitPrice 
    ? ((trade.exitPrice - trade.entryPrice) / trade.entryPrice) * 100 
    : null

  return (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500 hover:border-l-blue-600">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {/* Left side - Trade info */}
          <div className="flex items-center space-x-4 flex-1">
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {trade.ticker}
                </h3>
                <Badge 
                  variant={isOpen ? 'secondary' : isPositive ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {isOpen ? 'Open' : isPositive ? 'Profit' : 'Loss'}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                Portfolio: <span className="font-medium">{trade.portfolio.name}</span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="font-medium">{trade.quantity} shares</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500">Date:</span>
                  <span className="font-medium">{formatDate(trade.date)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Price and PnL info */}
          <div className="flex flex-col items-end space-y-2 ml-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Entry → Exit</div>
              <div className="font-medium">
                {formatCurrency(trade.entryPrice)} → {trade.exitPrice ? formatCurrency(trade.exitPrice) : 'Open'}
              </div>
            </div>
            
            {pnl && (
              <div className="text-right">
                <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(pnl)}
                </div>
                {pnlPercentage && (
                  <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{pnlPercentage.toFixed(2)}%
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <TradeForm
              mode="edit"
              trade={trade}
              portfolios={portfolios}
              onTradeUpdated={onTradeUpdated}
              trigger={
                <Button variant="outline" size="sm" className="h-8 px-3">
                  Edit
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(trade)}
              className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 