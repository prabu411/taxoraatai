import type { VercelRequest, VercelResponse } from '@vercel/node';

// PRESENTATION MODE: Standalone login without database dependency
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS just in case
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, password } = req.body;

  const user = DEMO_USERS.find(u => u.email === email && u.password === password);

  if (user) {
    const { password: _, ...userData } = user;
    return res.status(200).json({ success: true, user: userData });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
}
