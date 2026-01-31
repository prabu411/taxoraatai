# TaxoraAI Login Instructions

## Quick Setup

1. **Install dependencies:**
   ```bash
   bun install
   ```

2. **Seed the database with users:**
   ```bash
   bun run seed-users
   ```

3. **Start the development server:**
   ```bash
   bun run dev
   ```

## Login Credentials

### Admin Account
- **Email:** admin@taxora.com
- **Password:** admin123
- **Access:** Admin Dashboard with market rate controls and user request management

### User Accounts
- **Email:** user@taxora.com
- **Password:** user123
- **Access:** Full user dashboard with portfolio, GST, and business tools

- **Email:** ganesh@taxora.com  
- **Password:** ganesh123
- **Access:** Full user dashboard with portfolio, GST, and business tools

## Features

### Admin Dashboard
- Market rate management (Gold, Silver, Market Index)
- User request management
- System statistics
- Real-time updates to all users

### User Dashboard
- Portfolio tracking (FD/RD, Stocks, HUF/PF)
- GST compliance tools
- Bill tracking
- Business tools
- AI assistant (coming soon)

## Deployment

The app is configured for Vercel deployment. Make sure to:
1. Set `MONGODB_URI` environment variable in Vercel
2. Deploy and run the seed script once to create users
3. The API routes will automatically work with Vercel's serverless functions

## Troubleshooting

If you see module resolution errors:
1. Make sure all dependencies are installed
2. Check that the MongoDB connection string is correct
3. Ensure the database is accessible from your deployment environment