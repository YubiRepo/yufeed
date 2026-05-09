const db = require('./src/utils/db');
const sourcesConfig = require('./src/config/sources');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function seed() {
  console.log('🚀 Starting migration to MySQL...');
  
  try {
    await db.initDb();
    console.log('✅ Database initialized.');

    for (const [id, config] of Object.entries(sourcesConfig)) {
      console.log(`📦 Migrating: ${config.name} (${id})...`);
      await db.upsertSource(
        id,
        config.name,
        config.baseUrl,
        config.categories,
        config.selectors
      );
    }

    // Default Admin User
    const adminEmail = 'yubidev@mail.com';
    const adminPass = 'password';
    
    const existingAdmin = await db.getUserByUsername(adminEmail);
    if (!existingAdmin) {
      console.log(`👤 Creating default admin: ${adminEmail}...`);
      const hashedPassword = await bcrypt.hash(adminPass, 10);
      const apiKey = crypto.randomBytes(24).toString('hex');
      await db.createUser(adminEmail, hashedPassword, apiKey, 'admin');
      console.log('✅ Admin user created.');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    console.log('\n✨ Migration complete! All sources are now in MySQL.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

seed();
