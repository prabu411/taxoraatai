import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './_lib/mongodb'; // CORRECTED IMPORT PATH

// A trivial comment to force a new build cache in Vercel.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const client = await clientPromise;
    const db = client.db();

    const userRecord = await db.collection('users').findOne({ email });

    if (userRecord && userRecord.password === password) {
      const { password: _, ...user } = userRecord;
      return res.status(200).json({ success: true, user });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
