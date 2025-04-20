import express from 'express';
import { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import connectDB from './config/db';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { authenticate } from 'middlewares/auth';

const app = express();
connectDB();
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.get('/test', (req: Request, res: Response) => {
    res.send("<h1>App running!</h1>")
})

app.use('/api', routes);
app.use(notFound)
app.use(errorHandler)

export default app;
