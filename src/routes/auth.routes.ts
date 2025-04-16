
import { signin, signup } from "../controllers/auth.controllers";
import { Router } from "express";

const authRouter = Router();
authRouter.post('/signup', signup);
authRouter.post('/signup', signin);

export default authRouter;