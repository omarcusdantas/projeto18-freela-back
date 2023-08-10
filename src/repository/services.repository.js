import { db } from "../database/database.connection.js";

export async function createService(userId, service) {
    const { categoryId, title, description, image, price } = service;

    await db.query(
        `
        INSERT INTO services ("user_id", "category_id" , "title", "description", "image", "price") 
        VALUES ($1, $2, $3, $4, $5, $6)
    `,
        [userId, categoryId, title, description, image, price]
    );
}

export async function getServices(state, limit, category) {
    let query = `
        SELECT 
            s.id, s.title, s.image,
            a.state, a.city
        FROM services s
        INNER JOIN users u ON s.user_id = u.id
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN addresses a ON u.id = a.user_id
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
        query += ` AND ${conditions.join(" AND ")}`;
    }

    if (limit) {
        query += ` LIMIT $${params.length + 1}`;
        params.push(parseInt(limit));
    }

    const services = await db.query(query, params);
    return services.rows;
}

export async function getServicesByUserId(id) {
    const services = await db.query(
        `
        SELECT s.id, s.title, c.category, s.description, s.image, s.price, s.active 
        FROM services s
        LEFT JOIN categories c ON s.category_id = c.id 
        WHERE user_id = $1
    `,
        [id]
    );
    return services.rows;
}

export async function getServiceById(id) {
    const services = await db.query(
        `
        SELECT 
            s.id, s.title, c.category, s.description, s.image, s.price,
            u.name as provider, u.phone as contact, 
            a.state, a.city
        FROM services s
        INNER JOIN users u ON s.user_id = u.id
        LEFT JOIN categories c ON s.category_id = c.id
        LEFT JOIN addresses a ON u.id = a.user_id
        WHERE s.id = $1 AND s.active = true
    `,
        [id]
    );

    if (services.rowCount === 0) {
        return "The id doesn't match an active service";
    }
    return services.rows[0];
}

export async function getServiceState(id) {
    const service = await db.query(`SELECT user_id as "ownerId", active FROM services WHERE id = $1`, [id]);

    if (service.rowCount === 0) {
        return "The id doesn't match a service";
    }
    return service.rows[0];
}

export async function deleteService(id) {
    await db.query(`DELETE FROM services WHERE id = $1`, [id]);
}

export async function updateServiceStatus(id, active) {
    await db.query(`UPDATE services SET active = $1 WHERE id = $2`, [active, id]);
}
