import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function makeAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const db = mongoose.connection.db!;
  const users = await db.collection('users').find({}).toArray();

  if (users.length === 0) {
    console.log('⚠️  No users found. Please sign up first via /login.');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log('\n📋 Existing users:');
  users.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.email} ${u.isAdmin ? '(ADMIN ✅)' : ''}`);
  });

  // Make ALL users admin (or you can filter by email)
  const result = await db.collection('users').updateMany(
    {},
    { $set: { isAdmin: true } }
  );

  console.log(`\n🔑 Updated ${result.modifiedCount} user(s) to admin.`);

  // Verify
  const updated = await db.collection('users').find({}).toArray();
  console.log('\n✅ Updated users:');
  updated.forEach((u, i) => {
    console.log(`  ${i + 1}. ${u.email} ${u.isAdmin ? '(ADMIN ✅)' : ''}`);
  });

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected from MongoDB');
}

makeAdmin().catch(console.error);
