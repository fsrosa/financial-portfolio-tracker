import { prisma } from './db'

export interface Trade {
  id: string
  ticker: string
  entryPrice: number
  exitPrice: number | null
  quantity: number
  date: string
  portfolioId: string
  portfolio: {
    id: string
    name: string
  }
}

export interface Portfolio {
  id: string
  name: string
  initialValue: number
  createdAt: string
  trades: Trade[]
}

export async function getPortfolios(): Promise<Portfolio[]> {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: {
        trades: {
          orderBy: {
            date: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return portfolios.map((portfolio: any) => ({
      ...portfolio,
      createdAt: portfolio.createdAt.toISOString(),
      trades: portfolio.trades.map((trade: any) => ({
        ...trade,
        date: trade.date.toISOString()
      }))
    }))
  } catch (error) {
    console.error('Failed to fetch portfolios:', error)
    return []
  }
}

export async function getTrades(): Promise<Trade[]> {
  try {
    const trades = await prisma.trade.findMany({
      include: {
        portfolio: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return trades.map((trade: any) => ({
      ...trade,
      date: trade.date.toISOString()
    }))
  } catch (error) {
    console.error('Failed to fetch trades:', error)
    return []
  }
}

export async function getPortfolioTrades(portfolioId: string): Promise<Trade[]> {
  try {
    const trades = await prisma.trade.findMany({
      where: {
        portfolioId
      },
      include: {
        portfolio: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return trades.map((trade: any) => ({
      ...trade,
      date: trade.date.toISOString()
    }))
  } catch (error) {
    console.error('Failed to fetch portfolio trades:', error)
    return []
  }
} 