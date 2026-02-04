import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {
  APP_NAME,
  APP_VERSION,
  HTTP_STATUS,
  formatDate,
  generateId,
  type User,
  type ApiResponse,
  type HealthCheckResponse
} from '@packages/lib';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  const response: ApiResponse<{ message: string; version: string }> = {
    success: true,
    data: {
      message: `Welcome to ${APP_NAME}`,
      version: APP_VERSION
    },
    timestamp: formatDate(new Date())
  };
  res.status(HTTP_STATUS.OK).json(response);
});

app.get('/health', (req: Request, res: Response) => {
  const response: HealthCheckResponse = {
    status: 'healthy',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: APP_VERSION
  };
  res.status(HTTP_STATUS.OK).json(response);
});

app.get('/api/users', (req: Request, res: Response) => {
  const users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];

  const response: ApiResponse<{ users: User[]; requestId: string }> = {
    success: true,
    data: {
      users,
      requestId: generateId()
    },
    timestamp: formatDate(new Date())
  };
  res.status(HTTP_STATUS.OK).json(response);
});

app.listen(PORT, () => {
  console.log(`🚀 ${APP_NAME} v${APP_VERSION} running on http://localhost:${PORT}`);
});

export default app;
