import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { goldRate, silverRate, marketIndex } = req.body;

  return res.status(200).json({
    success: true,
    updatedRates: {
      goldRate,
      silverRate,
      marketIndex,
      lastUpdated: new Date().toISOString()
    }
  });
}
