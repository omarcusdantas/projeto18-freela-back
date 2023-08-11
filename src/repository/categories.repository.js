import { db } from "../database/database.connection.js";

export async function getCategories() {
    const services = await db.query(`SELECT * FROM categories`);
    return services.rows;
}
