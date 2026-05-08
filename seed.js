const db = require('./src/utils/db');
const sourcesConfig = require('./src/config/sources');

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

    console.log('\n✨ Migration complete! All sources are now in MySQL.');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  }
}

seed();
