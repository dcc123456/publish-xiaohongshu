import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { config } from './config';
import { createAppRouter } from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app: Express = express();

app.use(cors());

app.use(express.json({ limit: config.server.bodyParser.jsonLimit }));

app.use(express.urlencoded({ extended: true }));

app.use(config.server.static.imagesRoute, express.static(config.server.static.imagesDir));

const router = createAppRouter();
app.use('/api', router);

app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `路由 ${req.method} ${req.path} 不存在`,
  });
});

export { app };
