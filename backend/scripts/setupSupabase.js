const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const url = process.env.SUPABASE_DB_URL;
  if (!url) {
    console.error('Missing SUPABASE_DB_URL');
    process.exit(1);
  }
  const sqlPath = path.join(__dirname, '..', 'supabase_schema.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new Client({ connectionString: url });
  await client.connect();
  try {
    await client.query(sql);
    if (process.env.SUPABASE_ALLOW_ANON_WRITE === 'true') {
      const anonPolicies = `
create policy if not exists "anon insert products" on products for insert using (true) with check (true);
create policy if not exists "anon update products" on products for update using (true) with check (true);
create policy if not exists "anon delete products" on products for delete using (true) with check (true);
create policy if not exists "anon insert sales" on sales for insert using (true) with check (true);
create policy if not exists "anon delete sales" on sales for delete using (true) with check (true);
create policy if not exists "anon insert promotions" on promotions for insert using (true) with check (true);
create policy if not exists "anon update promotions" on promotions for update using (true) with check (true);
create policy if not exists "anon delete promotions" on promotions for delete using (true) with check (true);
create policy if not exists "anon insert reports" on reports for insert using (true) with check (true);
create policy if not exists "anon delete reports" on reports for delete using (true) with check (true);
`;
      await client.query(anonPolicies);
    }
    console.log('Supabase schema applied successfully');
  } finally {
    await client.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
