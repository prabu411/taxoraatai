import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { userId, userName, message } = req.body;
    return res.status(201).json({
      success: true,
      request: {
        _id: Date.now().toString(),
        userId,
        userName,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    });
  }

  return res.status(200).json({ success: true });
}
