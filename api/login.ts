import type { VercelRequest, VercelResponse } from '@vercel/node';
import clientPromise from '../src/lib/mongodb';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("--- Login API triggered ---");

  if (req.method !== 'POST') {
    console.log("Incorrect method:", req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = req.body;
    console.log("Attempting login for email:", email);

    if (!email || !password) {
      console.log("Missing email or password in request body");
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const client = await clientPromise;
    const db = client.db(); // Uses DB from connection string
    console.log("Connected to database:", db.databaseName);

    const userRecord = await db.collection('users').findOne({ email });

    if (userRecord) {
      console.log("User record found in database.");
      // IMPORTANT: Do not log the password itself in a real application
      console.log("Password from DB matches provided password:", userRecord.password === password);

      if (userRecord.password === password) {
        console.log("Login successful. Sending user data.");
        const { password: _, ...user } = userRecord;
        return res.status(200).json({ success: true, user });
      } else {
        console.log("Password mismatch.");
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      console.log("User record NOT found for email:", email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login API error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
