const path = require('path');
const db = require('./config/db');
const fs = require('fs');
const migrationPath = path.resolve(__dirname, 'database/migrations', 'alter_quotations_table.sql');

async function runMigration() {
    try {
        console.log('Starting database migration...');
        
        const sql = fs.readFileSync(migrationPath, 'utf-8');
        const statements = sql.split(';').filter(s => s.trim().length > 0);

        for (const statement of statements) {
            // Skip comments
            if (statement.startsWith('--')) {
                continue;
            }
            console.log(`Executing: ${statement.substring(0, 100)}...`);
            await db.query(statement);
        }

        console.log('\nMigration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error('Error details:', error);
        process.exit(1);
    }
}

runMigration();
