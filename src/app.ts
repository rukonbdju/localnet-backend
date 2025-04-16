import express from 'express';
import { Request, Response } from 'express';

import connectDB from './config/db';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

const app = express();
connectDB();

app.use(express.json());

app.get('/test', (req: Request, res: Response) => {
    res.send("<h1>App running!</h1>")
})

app.use('/api', routes);
app.use(notFound)
app.use(errorHandler)

export default app;
