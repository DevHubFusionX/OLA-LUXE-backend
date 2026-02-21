import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category';
import connectDB from '../config/db';

dotenv.config();

const defaultCategories = [
  { name: 'Jewelry', slug: 'jewelry', description: 'Premium luxury jewelry collections' },
  { name: 'Bags', slug: 'bags', description: 'Exquisite designer bags and clutches' },
  { name: 'Essentials', slug: 'essentials', description: 'Daily luxury essentials' },
];

const seedCategories = async () => {
  try {
    await connectDB();

    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`✅ Category created: ${cat.name}`);
      } else {
        console.log(`ℹ️ Category already exists: ${cat.name}`);
      }
    }

    console.log('\n🚀 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedCategories();
