# Financial Portfolio Tracker

A modern web application for tracking investment portfolios and analyzing trading performance. Built with Next.js, TypeScript, TailwindCSS, and Prisma.

## Features

- ✅ **Portfolio Management**: Create and manage multiple investment portfolios
- ✅ **Trade Tracking**: Log individual stock trades with entry/exit prices
- ✅ **PnL Calculation**: Automatic profit/loss calculations for each portfolio
- ✅ **Modern UI**: Clean, responsive interface built with ShadCN components
- ✅ **Real-time Updates**: Instant updates when adding portfolios or trades

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS, ShadCN UI components
- **Database**: PostgreSQL with Prisma ORM
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd financial-portfolio-tracker
npm install
```

### 2. Set Up Database

Create a `.env` file in the root directory:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_tracker"
```

### 3. Start PostgreSQL Database

Using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432 with:
- Database: `portfolio_tracker`
- Username: `postgres`
- Password: `password`

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

This will create the database tables for portfolios and trades.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

### Creating Portfolios

1. Click the "New Portfolio" button
2. Enter a portfolio name and initial value
3. Click "Create Portfolio"

### Adding Trades

1. Click the "Add Trade" button
2. Select a portfolio from the dropdown
3. Fill in the trade details:
   - Ticker symbol (e.g., AAPL)
   - Entry price
   - Exit price (optional - for closed positions)
   - Quantity
   - Trade date
4. Click "Add Trade"

### Viewing Performance

- Portfolios are displayed with current P&L calculations
- Green badges indicate positive returns
- Red badges indicate negative returns
- Each portfolio shows initial value, total P&L, current value, and number of trades

## Database Schema

### Portfolio
- `id`: Unique identifier
- `name`: Portfolio name
- `initialValue`: Starting portfolio value
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Trade
- `id`: Unique identifier
- `ticker`: Stock ticker symbol
- `entryPrice`: Purchase price
- `exitPrice`: Sale price (nullable for open positions)
- `quantity`: Number of shares
- `date`: Trade date
- `portfolioId`: Reference to portfolio
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Development

### Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Database Commands

- `npx prisma studio`: Open Prisma Studio for database management
- `npx prisma migrate dev`: Create and apply new migrations
- `npx prisma db seed`: Seed database with sample data (if configured)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── portfolios/
│   │   └── trades/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/          # ShadCN components
│   ├── dashboard.tsx
│   ├── portfolio-form.tsx
│   ├── portfolio-list.tsx
│   └── trade-form.tsx
└── lib/
    ├── db.ts        # Prisma client
    └── utils.ts     # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
