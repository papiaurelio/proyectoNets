// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'; // 👈 Importamos Role
import * as bcrypt from 'bcryptjs'; // Para hash de contraseñas

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');
  await prisma.$connect();

  // Borrar datos existentes
  console.log('🗑️ Cleaning existing data...');
  await prisma.user.deleteMany().catch((e) => {
    console.warn('Warning deleting users:', e.message || e);
  });
  await prisma.tenant.deleteMany().catch((e) => {
    console.warn('Warning deleting tenants:', e.message || e);
  });

  // Crear tenants
  console.log('🏢 Creating tenants...');
  const tenant1 = await prisma.tenant.create({
    data: { name: 'Tech Solutions Inc.' },
  });
  const tenant2 = await prisma.tenant.create({
    data: { name: 'Marketing Pro Agency' },
  });
  const tenant3 = await prisma.tenant.create({
    data: { name: 'Consulting Experts LLC' },
  });

  // Hashear contraseñas
  console.log('🔐 Hashing passwords...');
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('securepass', 10);

  // Crear usuarios
  console.log('👥 Creating users...');
  const usersToCreate = [
    {
      email: 'admin@techsolutions.com',
      name: 'Admin Tech Solutions',
      password: hashedPassword1,
      telephone: '+1-555-0101',
      role: Role.ADMIN, // 👈 Usar enum Role.ADMIN
      tenantId: tenant1.id,
    },
    {
      email: 'user@techsolutions.com',
      name: 'John Developer',
      password: hashedPassword2,
      telephone: '+1-555-0102',
      role: Role.USER, // 👈 Usar enum Role.USER
      tenantId: tenant1.id,
    },
    {
      email: 'admin@marketingpro.com',
      name: 'Admin Marketing Pro',
      password: hashedPassword1,
      telephone: '+1-555-0201',
      role: Role.ADMIN,
      tenantId: tenant2.id,
    },
    {
      email: 'user@marketingpro.com',
      name: 'Sarah Designer',
      password: hashedPassword2,
      telephone: '+1-555-0202',
      role: Role.USER,
      tenantId: tenant2.id,
    },
    {
      email: 'admin@consultingexperts.com',
      name: 'Admin Consulting Experts',
      password: hashedPassword1,
      telephone: '+1-555-0301',
      role: Role.ADMIN,
      tenantId: tenant3.id,
    },
    {
      email: 'user@consultingexperts.com',
      name: 'Michael Consultant',
      password: hashedPassword2,
      telephone: '+1-555-0302',
      role: Role.USER,
      tenantId: tenant3.id,
    },
  ];

  for (const u of usersToCreate) {
    try {
      const created = await prisma.user.create({ data: u });
      console.log(`   + Created user ${created.email}`);
    } catch (e: any) {
      console.error(`   ! Error creating ${u.email}:`, e.message || e);
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error (uncaught):', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
