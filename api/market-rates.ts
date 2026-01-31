import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './_lib/mongodb'; // CORRECTED IMPORT PATH

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { goldRate, silverRate, marketIndex } = req.body;

    if (goldRate === undefined || silverRate === undefined || marketIndex === undefined) {
      return res.status(400).json({ message: 'Missing required rate fields' });
    }

    const client = await clientPromise;
    const db = client.db();

    const newRates = {
      goldRate: parseFloat(goldRate),
      silverRate: parseFloat(silverRate),
      marketIndex: parseFloat(marketIndex),
      lastUpdated: new Date().toISOString(),
    };

    const result = await db.collection('marketRates').updateOne(
      {},
      { $set: newRates },
      { upsert: true }
    );

    return res.status(200).json({ success: true, updatedRates: newRates });

  } catch (error) {
    console.error('API market-rates error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
