import { MongoClient } from 'mongodb';

// Your connection string
const uri = "mongodb+srv://ganeshprabubo2024cse_db_user:zfzekX35YvgIi0rK@cluster0.3jp3cjb.mongodb.net/taxoraatai?appName=Cluster0";

const users = [
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

async function seed() {
  console.log('🌱 Connecting to MongoDB Atlas...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected successfully.');

    const db = client.db('taxoraatai');
    const usersCollection = db.collection('users');

    // Check if users already exist
    const count = await usersCollection.countDocuments();
    if (count > 0) {
      console.log('⚠️  Users collection already has data. Clearing it to ensure fresh start...');
      await usersCollection.deleteMany({});
    }

    console.log('🚀 Inserting users...');
    await usersCollection.insertMany(users);

    console.log('✅ Database seeded successfully!');
    console.log('   - Database: taxoraatai');
    console.log('   - Collection: users');
    console.log('   - Users created: 3');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seed();
