import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { 
  createResponse, 
  createError, 
  isEmail, 
  APP_NAME, 
  API_VERSION 
} from '@repo/shared';

const app = new Hono();

// Middleware
app.use('/*', cors());

// Types
interface User {
  id: number;
  name: string;
  email: string;
}

// In-memory store (for demo)
const users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

// Routes
app.get('/', (c) => {
  return c.json(createResponse({
    app: APP_NAME,
    version: API_VERSION,
    message: 'Welcome to the Bun + Hono API!',
  }));
});

app.get('/users', (c) => {
  return c.json(createResponse(users));
});

app.get('/users/:id', (c) => {
  const id = parseInt(c.req.param('id'));
  const user = users.find((u) => u.id === id);
  
  if (!user) {
    return c.json(createError('User not found'), 404);
  }
  
  return c.json(createResponse(user));
});

app.post('/users', async (c) => {
  const body = await c.req.json<{ name: string; email: string }>();
  
  if (!body.name || !body.email) {
    return c.json(createError('Name and email are required'), 400);
  }
  
  if (!isEmail(body.email)) {
    return c.json(createError('Invalid email format'), 400);
  }
  
  const newUser: User = {
    id: users.length + 1,
    name: body.name,
    email: body.email,
  };
  
  users.push(newUser);
  return c.json(createResponse(newUser), 201);
});

// Start server
const port = process.env.PORT || 3000;
console.log(`🚀 Server running at http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
