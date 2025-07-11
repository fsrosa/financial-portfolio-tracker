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

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ticker, entryPrice, exitPrice, quantity, date, portfolioId } = body

    if (!id || !ticker || !entryPrice || !quantity || !date || !portfolioId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const trade = await prisma.trade.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update trade' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Trade ID is required' }, { status: 400 })
    }

    await prisma.trade.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Trade deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete trade' }, { status: 500 })
  }
} 