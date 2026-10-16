/**
 * Admin & User Seed Script for Kalptaruu Yoga Vidhyalaya
 * 
 * Safely creates or updates administrator and student accounts directly in MongoDB.
 * Credentials are read from .env.local — NO hardcoded passwords in client/server code.
 * Passwords are securely hashed with bcrypt (12 rounds).
 * 
 * Usage:
 *   npm run seed:admin
 *   npm run seed:admin -- --email admin@example.com --password "SecurePassword123!"
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

// Load environment variables from .env.local if present
if (fs.existsSync(envPath)) {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile(envPath);
  } else {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim();
          if (!process.env[key]) {
            process.env[key] = val.replace(/^["']|["']$/g, '');
          }
        }
      }
    }
  }
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('\x1b[31m[Error] MONGODB_URI is not set in .env.local\x1b[0m');
  process.exit(1);
}

// Parse command-line flags
function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

async function seedUser(userCol, { name, email, phone, password, role }) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const existing = await userCol.findOne({ email: email.toLowerCase() });

  if (existing) {
    await userCol.updateOne(
      { _id: existing._id },
      {
        $set: {
          name,
          phone,
          password: hashedPassword,
          role,
          isActive: true,
          isEmailVerified: true,
          updatedAt: new Date(),
        },
      }
    );
    console.log(`\x1b[32m✔ Updated existing ${role} account: ${email}\x1b[0m`);
  } else {
    await userCol.insertOne({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log(`\x1b[32m✔ Created new ${role} account: ${email}\x1b[0m`);
  }
}

async function main() {
  const flags = parseArgs();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    console.log('\n\x1b[33m═══ Kalptaruu Yoga Vidhyalaya: User Provisioning ═══\x1b[0m\n');

    let email = flags.email || process.env.ADMIN_EMAIL;
    if (!email) {
      email = await rl.question('Enter Admin Email: ');
      email = email.trim().toLowerCase();
    }

    if (!email || !email.includes('@')) {
      console.error('\x1b[31m[Error] A valid email address is required.\x1b[0m');
      process.exit(1);
    }

    let password = flags.password || process.env.ADMIN_PASSWORD;
    if (!password) {
      password = await rl.question('Enter Admin Password (min 8 chars): ');
      password = password.trim();
    }

    if (!password || password.length < 8) {
      console.error('\x1b[31m[Error] Password must be at least 8 characters long.\x1b[0m');
      process.exit(1);
    }

    let name = flags.name || process.env.ADMIN_NAME || 'Kalptaru Administrator';
    let phone = flags.phone || process.env.ADMIN_PHONE || '+91 9876543210';

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri, { bufferCommands: false });
    console.log('\x1b[32m✔ Connected to database successfully.\x1b[0m\n');

    const userCol = mongoose.connection.collection('users');

    // 1. Provision Admin
    await seedUser(userCol, {
      name,
      email,
      phone,
      password,
      role: 'admin',
    });

    // 2. Provision Student if defined in .env.local
    const studentEmail = process.env.STUDENT_EMAIL;
    const studentPassword = process.env.STUDENT_PASSWORD;
    if (studentEmail && studentPassword) {
      const studentName = process.env.STUDENT_NAME || 'Kalptaru Student';
      const studentPhone = process.env.STUDENT_PHONE || '+91 9876543211';
      await seedUser(userCol, {
        name: studentName,
        email: studentEmail,
        phone: studentPhone,
        password: studentPassword,
        role: 'student',
      });
    }

    console.log('\n\x1b[36mYou can now sign in at /login with these credentials.\x1b[0m\n');
  } finally {
    rl.close();
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error('\x1b[31m[Fatal Error]\x1b[0m', err);
  process.exit(1);
});
