import { db as prisma } from '../index.js';
import bcrypt from 'bcryptjs'; // If this fails, use: import pkg from 'bcryptjs'; const { hash } = pkg;
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

async function main() {
  const email = 'admin@primestakecorp.com'; 
  const password = 'JustMe&GOD27'; 
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL not found. Path checked: " + path.resolve(__dirname, '../../../.env'));
  }

  console.log(`[GENESIS] Establishing Handshake with Database...`);

  // 12 rounds is the institutional standard for administrative entropy
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      status: 'APPROVED',
      kycLevel: 3,
    },
  });

  console.log(`\n-----------------------------------------`);
  console.log(`[SUCCESS] Admin Protocol Active: ${admin.id}`);
  console.log(`[CREDENTIALS] Email: ${email}`);
  console.log(`[CREDENTIALS] Pass:  ${password}`);
  console.log(`-----------------------------------------\n`);
}

main()
  .catch((e) => {
    console.error('[FAILURE] Protocol Abortion:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



  // npx ts-node --esm scripts/create-admin.ts  ---run script command in packages/db directory---