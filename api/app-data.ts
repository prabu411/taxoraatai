import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../src/lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const rates = await db.collection('marketRates').findOne({});
    const requests = await db.collection('adminRequests').find({}).sort({ createdAt: -1 }).toArray();

    res.status(200).json({
      success: true,
      marketRates: rates,
      adminRequests: requests,
    });
  } catch (error) {
    console.error('API app-data error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
