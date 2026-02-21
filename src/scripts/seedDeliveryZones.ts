import dotenv from 'dotenv';
import connectDB from '../config/db';
import { DeliveryZone } from '../models/DeliveryZone';

dotenv.config();

const defaultZones = [
  { name: 'Island (Lekki, VI, Ikoyi)', fee: 3000 },
  { name: 'Mainland (Surulere, Yaba, Ikeja)', fee: 4000 },
  { name: 'Outer Mainland (Magodo, Ajah, Ipaja)', fee: 5000 },
  { name: 'Extreme Mainland (Ikorodu, Alimosho)', fee: 7000 },
  { name: 'Pickup (Self pick-up)', fee: 0 },
];

const seedDeliveryZones = async () => {
  try {
    await connectDB();

    for (const zone of defaultZones) {
      const exists = await DeliveryZone.findOne({ name: zone.name });
      if (!exists) {
        await DeliveryZone.create(zone);
        console.log(`✅ Delivery zone created: ${zone.name}`);
      } else {
        console.log(`ℹ️ Delivery zone already exists: ${zone.name}`);
      }
    }

    console.log('\n🚀 Delivery zones seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Delivery zones seeding failed:', error);
    process.exit(1);
  }
};

seedDeliveryZones();
