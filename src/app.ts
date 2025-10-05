
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import router from './rootRoutes';

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


// application routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Blog Server' });
});
// app.use(globalErrorHandler);
// app.use(notFound);

export default app;

