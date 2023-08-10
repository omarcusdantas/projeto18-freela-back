import { db } from "../database/database.connection.js";

export async function findUser(email) {
    const foundUser = await db.query(`SELECT * FROM users WHERE "email"=$1`, [email]);
    return foundUser.rows[0];
}

export async function findPhone(phone) {
    const foundPhone = await db.query(`SELECT * FROM users WHERE "phone"=$1`, [phone]);
    return foundPhone.rows[0];
}

export async function createUser(userData) {
    const { name, email, phone, password } = userData;
    await db.query(`
        INSERT INTO users ("name", "email", "phone" ,"password") 
        VALUES ($1, $2, $3, $4)
    `, [name, email, phone, password]);
}

export async function createAddressEntry(userData) {
    const { email, state, city, cep } = userData;

    const foundUser = await findUser(email);
    await db.query(`
        INSERT INTO addresses ("user_id", "state", "city", "cep") 
        VALUES ($1, $2, $3, $4)
    `, [foundUser.id, state, city, cep]);
}