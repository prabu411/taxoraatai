import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../src/lib/mongodb';

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
    // Rely on the database name from the connection string
    const db = client.db();

    const newRates = {
      goldRate: parseFloat(goldRate),
      silverRate: parseFloat(silverRate),
      marketIndex: parseFloat(marketIndex),
      lastUpdated: new Date().toISOString(),
    };

    // Using upsert: true will create the document if it doesn't exist,
    // or update it if it does. We assume there's only one document for market rates.
    const result = await db.collection('marketRates').updateOne(
      {}, // An empty filter matches the first document in the collection
      { $set: newRates },
      { upsert: true }
    );

    return res.status(200).json({ success: true, updatedRates: newRates });

  } catch (error) {
    console.error('API market-rates error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
