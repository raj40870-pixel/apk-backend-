import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mongoUri = 'mongodb://raj40870:lVjEIl6i2wch8AbX@ac-ekmvanb-shard-00-00.d1qshcp.mongodb.net:27017,ac-ekmvanb-shard-00-01.d1qshcp.mongodb.net:27017,ac-ekmvanb-shard-00-02.d1qshcp.mongodb.net:27017/AppifyNow?ssl=true&replicaSet=atlas-kyyvyz-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0';

async function main() {
  await mongoose.connect(mongoUri);
  const usersColl = mongoose.connection.db.collection('users');

  const adminEmail = 'kamaljit444501@gmail.com';
  const rawPassword = 'Admin@APKify2026!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const adminUser = {
    email: adminEmail,
    password: hashedPassword,
    fullName: 'Kamaljit (Owner & Admin)',
    role: 'admin',
    credits_remaining: 999999,
    history_limit: 9999,
    plan_type: 'Enterprise Admin',
    watermark_enabled: false,
    signup_date: new Date(),
    last_credit_refill: new Date()
  };

  const res = await usersColl.updateOne(
    { email: adminEmail },
    { $set: adminUser },
    { upsert: true }
  );

  console.log('✅ Super Admin Account seeded successfully!');
  console.log('Admin Email:', adminEmail);
  console.log('Admin Default Password:', rawPassword);
  console.log('Admin Role:', 'admin');
  console.log('Admin Credits:', 999999);

  await mongoose.disconnect();
}

main().catch(console.error);
