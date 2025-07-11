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

### Creating a Portfolio

1. Click the **"New Portfolio"** button at the top of the dashboard.
2. Enter a unique portfolio name and its initial value in the form.
3. Click **"Create Portfolio"** to add it to your list. The new portfolio will appear instantly.

### Adding a Trade

1. In the portfolio list, locate the portfolio you want to add a trade to.
2. Click the **"Add Trade"** button for that portfolio.
3. Fill out the trade form:
   - **Ticker Symbol** (e.g., AAPL)
   - **Entry Price**
   - **Exit Price** (optional, leave blank for open positions)
   - **Quantity**
   - **Trade Date**
4. Click **"Add Trade"**. The trade will be added and the portfolio's stats will update automatically.

### Deleting a Portfolio

- Click the **"Delete"** button on a portfolio card.
- If the portfolio has trades, you'll be warned before deletion.
- Portfolios with trades cannot be deleted without confirmation.

### Viewing Portfolio Performance

- Each portfolio card displays:
  - **Initial Value**
  - **Current Value** (reflects all closed trades)
  - **Total P&L** (profit/loss in dollars)
  - **% Return** (relative to initial value)
  - **Number of Trades**
- Badges indicate performance:
  - **Green badge**: Positive return
  - **Red badge**: Negative return
- All calculations update in real-time as you add or remove trades.

### Tips

- You can manage multiple portfolios independently.
- Open positions (trades without an exit price) are not included in P&L until closed.
- Use the dashboard to quickly compare performance across all your portfolios.

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
│   ├── ui/                # ShadCN & custom UI components (TailwindCSS-based)
│   ├── dashboard.tsx
│   ├── portfolio/
│   │   ├── portfolio-card.tsx
│   │   ├── portfolio-form.tsx
│   │   └── portfolio-list.tsx
│   └── trade/
│       └── trade-form.tsx
└── lib/
    ├── db.ts              # Prisma client instance
    └── utils.ts           # Shared utility functions

## Architecture

This application follows a modern full-stack architecture built on Next.js 15 with the App Router. The frontend utilizes React Server Components for improved performance, while client components handle interactive features like forms and real-time updates. The UI is built with TailwindCSS and ShadCN components for a consistent, accessible design system.

The backend leverages Next.js API routes for server-side operations, with Prisma ORM providing type-safe database interactions. The PostgreSQL database stores portfolio and trade data with proper relationships, enabling efficient queries for P&L calculations. The application uses optimistic updates for a responsive user experience, immediately reflecting changes in the UI while handling database operations in the background. This approach ensures users see instant feedback while maintaining data consistency and reliability.
