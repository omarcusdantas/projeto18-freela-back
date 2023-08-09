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

export async function getServices(state, limit, category) {
    let query = `
        SELECT 
            s.id, s.title, c.category, s.description, s.image,
            u.name as provider, u.email as email,
            a.state as state, a.city as city
        FROM services s
        INNER JOIN users u ON s.user_id = u.id
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN addresses a ON s.user_id = a.user_id
        WHERE s.active = true
    `;

    let conditions = [];
    let params = [];

    if (state) {
        conditions.push("a.state = $1");
        params.push(state.toUpperCase());
    }

    if (category) {
        conditions.push(`s.category_id = $${params.length + 1}`);
        params.push(parseInt(category));
    }

    if (conditions.length > 0) {
        query += ` AND ${conditions.join(' AND ')}`;
    }

    if (limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
    }

    const services = await db.query(query, params);
    return services.rows;
}