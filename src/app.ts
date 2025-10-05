
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './rootRoutes';
import globalErrorHandler from './middleware/errorHandler';
import AppError from './errors/AppError';
import httpStatus from 'http-status';

const app: Application = express();

//parsers
app.use(express.json());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],  // Allow only your frontend origin
    credentials: true,                // Allow cookies and other credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allowed headers
  })
);

app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Server' });
});

app.use("*", (req, res, next) => {
  next(new AppError(httpStatus.BAD_REQUEST, "Route not found on this server"));
});


app.use(globalErrorHandler);

export default app;

