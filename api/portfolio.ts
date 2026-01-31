import type { VercelRequest, VercelResponse } from '@vercel/node';

// PRESENTATION MODE: Standalone portfolio data
const DEMO_DATA = {
  fdrd: [
    { _id: '1', type: 'FD', bankName: 'State Bank of India', principal: 100000, interestRate: 7.1, maturityDate: '2025-01-15' },
    { _id: '2', type: 'RD', bankName: 'HDFC Bank', principal: 5000, interestRate: 6.8, maturityDate: '2025-06-01' }
  ],
  stocks: [
    { _id: '1', symbol: 'RELIANCE', quantity: 10, avgPrice: 2450, currentPrice: 2520 },
    { _id: '2', symbol: 'TCS', quantity: 5, avgPrice: 3800, currentPrice: 3950 }
  ],
  hufPf: {
    hufPan: 'AABCH1234F',
    hufAssets: 1500000,
    epfBalance: 450000,
    npsBalance: 230000
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Return success for any request type to simulate a working backend
  if (req.method === 'GET') {
    return res.status(200).json({
        success: true,
        fdrd: DEMO_DATA.fdrd,
        stocks: DEMO_DATA.stocks,
        hufPf: DEMO_DATA.hufPf
    });
  }

  // For POST/DELETE, just return success
  return res.status(200).json({ success: true, insertedId: 'demo-id' });
}
