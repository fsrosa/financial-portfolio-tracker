import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample portfolios
  const portfolio1 = await prisma.portfolio.create({
    data: {
      name: 'Growth Portfolio',
      initialValue: 10000,
    },
  })

  const portfolio2 = await prisma.portfolio.create({
    data: {
      name: 'Dividend Portfolio',
      initialValue: 15000,
    },
  })

  // Create sample trades
  await prisma.trade.createMany({
    data: [
      {
        ticker: 'AAPL',
        entryPrice: 150.00,
        exitPrice: 165.00,
        quantity: 10,
        date: new Date('2024-01-15'),
        portfolioId: portfolio1.id,
      },
      {
        ticker: 'GOOGL',
        entryPrice: 2800.00,
        exitPrice: 2950.00,
        quantity: 2,
        date: new Date('2024-02-01'),
        portfolioId: portfolio1.id,
      },
      {
        ticker: 'MSFT',
        entryPrice: 320.00,
        exitPrice: null, // Open position
        quantity: 15,
        date: new Date('2024-03-01'),
        portfolioId: portfolio1.id,
      },
      {
        ticker: 'JNJ',
        entryPrice: 160.00,
        exitPrice: 155.00,
        quantity: 20,
        date: new Date('2024-01-20'),
        portfolioId: portfolio2.id,
      },
      {
        ticker: 'PG',
        entryPrice: 140.00,
        exitPrice: 145.00,
        quantity: 25,
        date: new Date('2024-02-15'),
        portfolioId: portfolio2.id,
      },
    ],
  })

  console.log('Sample data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 