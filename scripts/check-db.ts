import 'dotenv/config';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    const { db } = await import('@/lib/db');
    const { sql } = await import('drizzle-orm');

    try {
        const result = await db.execute(sql`DESCRIBE account`);
        console.log(result[0]);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

check();
