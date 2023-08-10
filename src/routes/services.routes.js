import { Router } from "express";
import {
    addService,
    retrieveServices,
    retrieveUserServices,
    retrieveServiceById,
    removeService,
    changeServiceStatus,
} from "../controllers/servicesController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import { serviceSchema } from "../schemas/services.schemas.js";

const servicesRouter = Router();
servicesRouter.post("/services", validateAuth, validateSchema(serviceSchema), addService);
servicesRouter.get("/services", validateAuth, retrieveServices);
servicesRouter.get("/services/mine", validateAuth, retrieveUserServices);
servicesRouter.get("/services/:id", validateAuth, retrieveServiceById);
servicesRouter.delete("/services/:id", validateAuth, removeService);
servicesRouter.put("/services/:id/:status", validateAuth, changeServiceStatus);

export default servicesRouter;
