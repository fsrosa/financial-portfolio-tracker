import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required' }, { status: 400 })
    }

    const trades = await prisma.trade.findMany({
      where: {
        portfolioId: id,
      },
      include: {
        portfolio: true,
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(trades)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
} 