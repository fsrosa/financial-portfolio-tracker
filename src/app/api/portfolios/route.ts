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