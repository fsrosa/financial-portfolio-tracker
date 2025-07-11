import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const portfolios = await prisma.portfolio.findMany({
      include: {
        trades: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(portfolios)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, initialValue } = body

    if (!name || !initialValue) {
      return NextResponse.json({ error: 'Name and initial value are required' }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.create({
      data: {
        name,
        initialValue: parseFloat(initialValue),
      },
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, initialValue } = body

    if (!id || !name || !initialValue) {
      return NextResponse.json({ error: 'ID, name and initial value are required' }, { status: 400 })
    }

    const portfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        name,
        initialValue: parseFloat(initialValue),
      },
    })

    return NextResponse.json(portfolio)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 })
    }

    // Check if portfolio has trades
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { trades: true }
    })

    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
    }

    if (portfolio.trades.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete portfolio with existing trades. Please delete all trades first.' 
      }, { status: 400 })
    }

    await prisma.portfolio.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Portfolio deleted successfully' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
  }
} 