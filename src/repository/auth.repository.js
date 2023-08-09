import { db } from "../database/database.connection.js";

export async function findUser(email) {
    const foundUser = await db.query(`SELECT * FROM users WHERE "email"=$1`, [email]);
    return foundUser.rows[0];
}

export async function createUser(userData) {
    const { name, email, password } = userData;
    await db.query(`
        INSERT INTO users ("name", "email" ,"password") 
        VALUES ( $1, $2, $3 )
    `, [name, email, password]);
}

export async function createAddressEntry(userData) {
    const { email, state, city, address, cep } = userData;

    const foundUser = await findUser(email);
    await db.query(`
        INSERT INTO addresses ("user_id", "state", "city", "address", "cep") 
        VALUES ($1, $2, $3, $4, $5)
    `, [foundUser.id, state, city, address, cep]);
}