import express from 'express';
import { Request, Response } from 'express';

import routes from './routes';

const app = express();
app.use(express.json());

app.get('/test', (req: Request, res: Response) => {
    res.send("<h1>App running!</h1>")
})

app.use('/api', routes);

export default app;
