import { createService } from "../repository/services.repository.js";

export async function addService(req, res) {
    const userId = res.locals.userId;
    const service = req.body;

    try {
        await createService(userId, service);
        return res.sendStatus(201);
    } catch (error) {
        if (error.code === "23503") {
            return res.status(400).send("Invalid category id");
        }
        return res.status(500).send(error.message);
    }
}