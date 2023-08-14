import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUser, findPhone, createUser, createAddressEntry } from "../repository/auth.repository.js";
import axios from "axios";

async function checkAddress(cep, state, city) {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        if (data.erro) {
            return false;
        }

        if (data.uf === state && data.localidade === city) {
            return true;
        }

        return false;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

export async function signup(req, res) {
    const userData = req.body;

    try {
        const foundUser = await findUser(userData.email);
        if (foundUser) {
            return res.status(409).send("Email already registered");
        }

        const foundPhone = await findPhone(userData.phone);
        if (foundPhone) {
            return res.status(409).send("Phone number already registered");
        }

        const addressMatch = await checkAddress(userData.cep, userData.state, userData.city);
        if (!addressMatch) {
            return res.status(400).send("State or city don't match cep");
        }

        const hash = bcrypt.hashSync(userData.password, 10);
        userData.password = hash;

        await createUser(userData);
        await createAddressEntry(userData);
        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function signin(req, res) {
    const tokenExpirationSeconds = 60 * 60 * 24 * 30; // 30 days
    const { email, password } = req.body;

    try {
        const foundUser = await findUser(email);
        if (!foundUser) {
            return res.status(404).send("Email not registered");
        }

        if (bcrypt.compareSync(password, foundUser.password)) {
            const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, {
                expiresIn: tokenExpirationSeconds,
            });
            return res.status(200).send({ name: foundUser.name, token });
        }
        return res.status(401).send("Wrong password");
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
