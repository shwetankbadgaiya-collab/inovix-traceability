import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../prisma/schema.prisma');

const dbUrl = process.env.DATABASE_URL || '';

if (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://')) {
  let content = fs.readFileSync(schemaPath, 'utf8');
  if (content.includes('provider = "sqlite"')) {
    content = content.replace('provider = "sqlite"', 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, content, 'utf8');
    console.log('[INOVIX] Automatically configured Prisma provider for PostgreSQL.');
  }
} else {
  console.log('[INOVIX] Using SQLite database configuration.');
}
