import dotenv from 'dotenv';
import connectDB from './config/db';
import { Category } from './models/Category';
import { Product } from './models/Product';

dotenv.config();

const categoriesData = [
  { name: 'Jewelry', slug: 'jewelry', description: 'Premium luxury jewelry collections' },
  { name: 'Bags', slug: 'bags', description: 'Exquisite designer bags and clutches' },
  { name: 'Essentials', slug: 'essentials', description: 'Daily luxury essentials' },
];

const productsData = [
  {
    name: 'Vintage Gold Necklace',
    price: 12000,
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000'],
    category: 'Jewelry',
    description: 'A beautiful minimalist gold necklace with a vintage touch.',
    variations: [
      { type: 'Length', options: ['16 inch', '18 inch', '20 inch'] },
    ],
    inStock: true,
  },
  {
    name: 'Peach Pastel Tote Bag',
    price: 18000,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000'],
    category: 'Bags',
    description: 'Soft girl aesthetic tote bag in a lovely peach color.',
    inStock: true,
  },
  {
    name: 'Silk Hair Scrunchie',
    price: 2500,
    images: ['https://images.unsplash.com/photo-1621244299818-421b493bc673?q=80&w=1000'],
    category: 'Essentials',
    description: 'Premium silk scrunchie, gentle on hair.',
    variations: [
      { type: 'Color', options: ['Peach', 'Cream', 'Dusty Rose'] },
    ],
    inStock: true,
  },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting database seeding...');

    // ── Seed Categories ───────────────────────────────────────
    console.log('📦 Seeding categories...');
    await Category.deleteMany({});
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Seeded ${insertedCategories.length} categories.`);

    // ── Seed Products ─────────────────────────────────────────
    console.log('🛍️ Seeding products...');
    await Product.deleteMany({});
    const insertedProducts = await Product.insertMany(productsData);
    console.log(`✅ Seeded ${insertedProducts.length} products.`);

    console.log('\n🚀 Database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
