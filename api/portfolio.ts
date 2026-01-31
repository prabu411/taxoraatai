import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import clientPromise from '../src/lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  // Rely on the database name from the connection string
  const db = client.db();

  // All portfolio actions require a userId
  const userId = req.query.userId as string;
  if (!userId) {
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
        const { type, data } = req.body;
        switch (type) {
          case 'fdrd': {
            const result = await db.collection('fdrd').insertOne({ userId, ...data });
            return res.status(201).json({ success: true, insertedId: result.insertedId });
          }
          case 'stocks': {
            const stocksWithUserId = data.map((stock: any) => ({ ...stock, userId }));
            const result = await db.collection('stocks').insertMany(stocksWithUserId);
            return res.status(201).json({ success: true, insertedIds: result.insertedIds });
          }
          case 'hufPf': {
            await db.collection('hufPf').updateOne({ userId }, { $set: data }, { upsert: true });
            return res.status(200).json({ success: true });
          }
          default:
            return res.status(400).json({ message: 'Invalid data type for POST' });
        }
      }

      case 'DELETE': {
        const { type, id } = req.body;
        if (type === 'fdrd' && id) {
          await db.collection('fdrd').deleteOne({ _id: new ObjectId(id), userId });
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
