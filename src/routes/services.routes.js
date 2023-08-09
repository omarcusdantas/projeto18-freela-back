import { Router } from "express";
import { addService } from "../controllers/servicesController.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { validateAuth } from "../middlewares/validateAuth.js";
import { serviceSchema } from "../schemas/services.schemas.js";

const servicesRouter = Router();
servicesRouter.post("/services", validateAuth, validateSchema(serviceSchema), addService);

export default servicesRouter;
