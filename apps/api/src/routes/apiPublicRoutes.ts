import { Router } from "express";
import authRoutes from "../modules/auth/routes/authRoutes";
import healthRoutes from "../modules/health/routes/healthRoutes";

const apiPublic: Router = Router();

apiPublic.use(
  //
  "/v1/auth",
  authRoutes
);

apiPublic.use(
  //
  "/v1/health",
  healthRoutes
);

export default apiPublic;
