import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import clientPromise from './_lib/mongodb'; // CORRECTED IMPORT PATH

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db();

  const userId = req.query.userId as string;
  if (!userId && req.method !== 'POST') { // POST might have userId in body
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET': {
        const fdrd = await db.collection('fdrd').find({ userId }).toArray();
        const stocks = await db.collection('stocks').find({ userId }).toArray();
        const hufPf = await db.collection('hufPf').findOne({ userId });
        return res.status(200).json({ success: true, fdrd, stocks, hufPf });
      }

      case 'POST': {
        const { type, data, userId: bodyUserId } = req.body;
        const effectiveUserId = bodyUserId || userId;
        if (!effectiveUserId) return res.status(400).json({ message: 'User ID is required' });

        switch (type) {
          case 'fdrd': {
            const result = await db.collection('fdrd').insertOne({ userId: effectiveUserId, ...data });
            return res.status(201).json({ success: true, insertedId: result.insertedId });
          }
          case 'stocks': {
            const stocksWithUserId = data.map((stock: any) => ({ ...stock, userId: effectiveUserId }));
            const result = await db.collection('stocks').insertMany(stocksWithUserId);
            return res.status(201).json({ success: true, insertedIds: result.insertedIds });
          }
          case 'hufPf': {
            await db.collection('hufPf').updateOne({ userId: effectiveUserId }, { $set: data }, { upsert: true });
            return res.status(200).json({ success: true });
          }
          default:
            return res.status(400).json({ message: 'Invalid data type for POST' });
        }
      }

      case 'DELETE': {
        const { type, id, userId: bodyUserId } = req.body;
        const effectiveUserId = bodyUserId || userId;
        if (!effectiveUserId) return res.status(400).json({ message: 'User ID is required' });

        if (type === 'fdrd' && id) {
          await db.collection('fdrd').deleteOne({ _id: new ObjectId(id), userId: effectiveUserId });
          return res.status(200).json({ success: true });
        }
        return res.status(400).json({ message: 'Invalid data type for DELETE' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API portfolio error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
