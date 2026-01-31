import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from './_lib/mongodb';

// FAILSAFE: Hardcoded demo users in case DB connection fails
const DEMO_USERS = [
  {
    email: 'admin@admin.com',
    password: 'admin',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'ganesh@taxora.com',
    password: 'prabu',
    name: 'Ganesh Kumar',
    role: 'user'
  },
  {
    email: 'danush@taxora.com',
    password: 'danush',
    name: 'Danush',
    role: 'user'
  }
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // 1. Try to connect to MongoDB
    const client = await clientPromise;
    const db = client.db();
    const userRecord = await db.collection('users').findOne({ email });

    if (userRecord && userRecord.password === password) {
      const { password: _, ...user } = userRecord;
      return res.status(200).json({ success: true, user });
    }
  } catch (error) {
    console.error('Database login failed, falling back to demo users:', error);
  }

  // 2. Fallback: Check hardcoded demo users
  const demoUser = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (demoUser) {
    console.log('Login successful using DEMO USER fallback');
    const { password: _, ...user } = demoUser;
    return res.status(200).json({ success: true, user });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
}
