import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ObjectId } from 'mongodb';
import clientPromise from './_lib/mongodb'; // CORRECTED IMPORT PATH

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const client = await clientPromise;
  const db = client.db();

  try {
    switch (req.method) {
      case 'POST':
        const { userId, userName, message } = req.body;
        if (!userId || !userName || !message) {
          return res.status(400).json({ message: 'Missing required fields' });
        }
        const newRequest = {
          userId,
          userName,
          message,
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
        };
        const result = await db.collection('adminRequests').insertOne(newRequest);
        const insertedRequest = { ...newRequest, _id: result.insertedId };
        return res.status(201).json({ success: true, request: insertedRequest });

      case 'PUT':
        const { id } = req.body;
        if (!id) {
          return res.status(400).json({ message: 'Request ID is required' });
        }
        const updateResult = await db.collection('adminRequests').updateOne(
          { _id: new ObjectId(id) },
          { $set: { status: 'resolved' } }
        );
        if (updateResult.modifiedCount === 0) {
          return res.status(404).json({ message: 'Request not found or already resolved' });
        }
        return res.status(200).json({ success: true });

      default:
        res.setHeader('Allow', ['POST', 'PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API requests error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
