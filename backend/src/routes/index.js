import express from "express";
import authRoutes from "./authRoutes.js";
import recipeRoutes from "./receipyRoutes.js";

const router = express.Router();

router.use("/", authRoutes);
router.use("/receipy", recipeRoutes);

export default router;