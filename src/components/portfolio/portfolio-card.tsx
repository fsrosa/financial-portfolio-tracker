'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PortfolioForm } from './portfolio-form'
import { Portfolio } from '@/lib/data'
import { useState } from 'react'

interface PortfolioCardProps {
  portfolio: Portfolio
  onPortfolioUpdated: () => void
  onDelete: (portfolio: Portfolio) => void
}

export function PortfolioCard({ portfolio, onPortfolioUpdated, onDelete }: PortfolioCardProps) {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const { totalPnL, totalValue, percentageChange } = calculatePortfolioPnL(portfolio)
  const isPositive = totalPnL >= 0
  const hasTrades = portfolio.trades.length > 0

  const handleDeleteClick = () => {
    if (hasTrades) {
      setShowDeleteWarning(true)
      setTimeout(() => setShowDeleteWarning(false), 3000)
    } else {
      onDelete(portfolio)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500 hover:border-l-purple-600">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {portfolio.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {portfolio.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Created {formatDate(portfolio.createdAt)}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant={isPositive ? 'default' : 'destructive'}
            className="text-xs font-medium"
          >
            {formatPercentage(percentageChange)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Portfolio Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Initial Value</div>
              <div className="font-semibold text-gray-900">
                {formatCurrency(portfolio.initialValue)}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Current Value</div>
              <div className="font-semibold text-gray-900">
                {formatCurrency(totalValue)}
              </div>
            </div>
          </div>

          {/* P&L and Trades */}
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Total P&L</div>
                <div className={`font-bold text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalPnL)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Trades</div>
                <div className="font-semibold text-gray-900">
                  {portfolio.trades.length}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <PortfolioForm
              mode="edit"
              portfolio={portfolio}
              onPortfolioUpdated={onPortfolioUpdated}
              trigger={
                <Button variant="outline" size="sm" className="flex-1 h-8">
                  Edit
                </Button>
              }
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteClick}
              className="flex-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              title={hasTrades ? `Cannot delete portfolio with ${portfolio.trades.length} trade(s)` : 'Delete portfolio'}
            >
              Delete
            </Button>
          </div>

          {showDeleteWarning && hasTrades && (
            <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md border border-amber-200">
              ⚠️ Portfolio contains {portfolio.trades.length} trade(s). Delete all trades first.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 