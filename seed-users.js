import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb+srv://your-connection-string';

async function seedUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Clear existing users
    await db.collection('users').deleteMany({});
    
    // Create admin and user accounts
    const users = [
      {
        email: 'admin@taxora.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'user@taxora.com', 
        password: 'user123',
        name: 'Regular User',
        role: 'user'
      },
      {
        email: 'ganesh@taxora.com',
        password: 'ganesh123', 
        name: 'Ganesh Kumar',
        role: 'user'
      }
    ];
    
    await db.collection('users').insertMany(users);
    
    // Initialize market rates if not exists
    const existingRates = await db.collection('marketRates').findOne({});
    if (!existingRates) {
      await db.collection('marketRates').insertOne({
        goldRate: 6500,
        silverRate: 85,
        marketIndex: 22500,
        lastUpdated: new Date().toISOString()
      });
    }
    
    console.log('✅ Users seeded successfully!');
    console.log('Admin: admin@taxora.com / admin123');
    console.log('User: user@taxora.com / user123');
    console.log('User: ganesh@taxora.com / ganesh123');
    
  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await client.close();
  }
}

seedUsers();