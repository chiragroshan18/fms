const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed Categories
  const defaultCategories = ['Service', 'Product', 'Website', 'Support', 'Other'];
  for (const catName of defaultCategories) {
    await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName },
    });
  }
  console.log('✅ Categories seeded successfully.');

  // Seed / Update Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@fms.com';
  const adminPassword = process.env.ADMIN_PASSWORD || '123456';
  const adminName = process.env.ADMIN_NAME || 'System Administrator';

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(adminPassword, salt);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        passwordHash,
        role: 'ADMIN',
      },
    });
    console.log(`✅ Default Admin user created (${adminEmail}). Password: ${adminPassword}`);
  } else {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        passwordHash,
      },
    });
    console.log(`✅ Admin user updated (${adminEmail}). Password forced to: ${adminPassword}`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
