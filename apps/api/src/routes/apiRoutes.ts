import { Router } from "express";

import usersRoutes from "../modules/users/routes/usersRoutes";

const api: Router = Router();

api.use(
  //
  "/v1/users",
  usersRoutes
);

export default api;
