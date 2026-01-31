import type { VercelRequest, VercelResponse } from '@vercel/node';

// PRESENTATION MODE: Standalone data
export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    success: true,
    marketRates: {
      goldRate: 6250,
      silverRate: 78.50,
      marketIndex: 22456.80,
      lastUpdated: new Date().toISOString(),
    },
    adminRequests: [
      {
        _id: '1',
        userId: 'ganesh@taxora.com',
        userName: 'Ganesh Kumar',
        message: 'Need help understanding GST filing for quarterly returns',
        status: 'pending',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
  });
}
