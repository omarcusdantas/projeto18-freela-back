import { Router } from "express";
import { retrieveCategories } from "../controllers/categoriesController.js";
import { validateAuth } from "../middlewares/validateAuth.js";

const categoriesRouter = Router();
categoriesRouter.get("/categories", validateAuth, retrieveCategories);

export default categoriesRouter;
