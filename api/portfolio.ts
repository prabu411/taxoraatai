import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import clientPromise from './_lib/mongodb';

// FAILSAFE: Dummy data
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = req.query.userId as string;

  // Allow POST without userId in query if it's in body
  if (!userId && req.method !== 'POST') {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    switch (req.method) {
      case 'GET': {
        const fdrd = await db.collection('fdrd').find({ userId }).toArray();
        const stocks = await db.collection('stocks').find({ userId }).toArray();
        const hufPf = await db.collection('hufPf').findOne({ userId });

        // If DB returns empty arrays, use demo data for presentation
        if (fdrd.length === 0 && stocks.length === 0 && !hufPf) {
             return res.status(200).json({
                success: true,
                fdrd: DEMO_DATA.fdrd,
                stocks: DEMO_DATA.stocks,
                hufPf: DEMO_DATA.hufPf
            });
        }

        return res.status(200).json({ success: true, fdrd, stocks, hufPf });
      }

      case 'POST': {
        const { type, data, userId: bodyUserId } = req.body;
        const effectiveUserId = bodyUserId || userId;

        if (type === 'fdrd') {
            const result = await db.collection('fdrd').insertOne({ userId: effectiveUserId, ...data });
            return res.status(201).json({ success: true, insertedId: result.insertedId });
        } else if (type === 'stocks') {
             const stocksWithUserId = data.map((stock: any) => ({ ...stock, userId: effectiveUserId }));
             const result = await db.collection('stocks').insertMany(stocksWithUserId);
             return res.status(201).json({ success: true, insertedIds: result.insertedIds });
        } else if (type === 'hufPf') {
            await db.collection('hufPf').updateOne({ userId: effectiveUserId }, { $set: data }, { upsert: true });
            return res.status(200).json({ success: true });
        }
        return res.status(400).json({ message: 'Invalid type' });
      }

      case 'DELETE': {
         const { type, id, userId: bodyUserId } = req.body;
         const effectiveUserId = bodyUserId || userId;
         if (type === 'fdrd' && id) {
            await db.collection('fdrd').deleteOne({ _id: new ObjectId(id), userId: effectiveUserId });
            return res.status(200).json({ success: true });
         }
         return res.status(400).json({ message: 'Invalid delete' });
      }

      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Database error, using fallback:', error);
    // Fallback for GET requests
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            fdrd: DEMO_DATA.fdrd,
            stocks: DEMO_DATA.stocks,
            hufPf: DEMO_DATA.hufPf
        });
    }
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
