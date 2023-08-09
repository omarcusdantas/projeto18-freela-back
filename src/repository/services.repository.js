import { db } from "../database/database.connection.js";

export async function createService(userId, service) {
    const { categoryId, title, description, image } = service;

    await db.query(`
        INSERT INTO services ("user_id", "category_id" , "title", "description", "image") 
        VALUES ( $1, $2, $3, $4, $5 )
    `, [
        userId,
        categoryId,
        title,
        description,
        image,
    ]);
}