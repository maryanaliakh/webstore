import dotenv from 'dotenv'
import {Pool} from 'pg'

dotenv.config();

const db = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME
})

async function connection(): Promise<void> {
    try {
        const client = await db.connect();
        console.log('Connected to DB')
        client.release()
    } catch(error) {
        console.log('Error connecting to DB')
    }
}

connection();

export default db;