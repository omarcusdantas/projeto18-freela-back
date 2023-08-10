import { createService, getServices, getServicesByUserId, getServiceById, getServiceOwnerId, deleteService } from "../repository/services.repository.js";

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

export async function retrieveServices(req, res) {
    const { state, limit, category } = req.query;

    try {
        const services = await getServices(state, limit, category);
        res.send(services);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function retrieveUserServices(req, res) {
    const userId = res.locals.userId;

    try {
        const services = await getServicesByUserId(userId);
        res.send(services);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function retrieveServiceById(req, res) {
    const id = req.params.id;

    try {
        const service = await getServiceById(id);
        res.send(service);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}

export async function removeService(req, res) {
    const serviceId = req.params.id;
    const userId = res.locals.userId;

    try {
        const ownerId = await getServiceOwnerId(serviceId);
        if (ownerId!== userId) {
            return res.status(401).send("User is not the provider of the service");
        }

        await deleteService(serviceId);
        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).send(error.message);
    }
}
