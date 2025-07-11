import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      include: {
        portfolio: true,
      },
      orderBy: {
        date: 'desc',
      },
    })
    return NextResponse.json(trades)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticker, entryPrice, exitPrice, quantity, date, portfolioId } = body

    if (!ticker || !entryPrice || !quantity || !date || !portfolioId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const trade = await prisma.trade.create({
      data: {
        ticker,
        entryPrice: parseFloat(entryPrice),
        exitPrice: exitPrice ? parseFloat(exitPrice) : null,
        quantity: parseInt(quantity),
        date: new Date(date),
        portfolioId,
      },
      include: {
        portfolio: true,
      },
    })

    return NextResponse.json(trade)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create trade' }, { status: 500 })
  }
} 