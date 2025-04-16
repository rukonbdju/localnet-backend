import { refreshToken, signin, signup } from "../controllers/auth.controllers";
import { Router } from "express";

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/signin', signin);
authRouter.post('/refresh', refreshToken)

export default authRouter;