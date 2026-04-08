const { Client } = require('pg');

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

const client = new Client({
  connectionString: DB_URL,
  ssl: process.env.DB_SSL_DISABLED === 'true' ? false : { rejectUnauthorized: false }
});

async function verify() {
  try {
    await client.connect();
    console.log('✅ Connected');

    const res = await client.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'videos' AND column_name IN ('error_message', 'processed_at')"
    );

    if (res.rows.length === 2) {
      console.log('✅ Fields exist:');
      res.rows.forEach(r => console.log(`  ${r.column_name}: ${r.data_type}`));
    } else {
      console.log('❌ Fields missing');
    }

    await client.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

verify();
