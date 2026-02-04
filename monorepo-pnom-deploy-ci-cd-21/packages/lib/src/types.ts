export interface User {
  id: number;
  name: string;
  email: string;
  createdAt?: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  uptime: number;
  environment: string;
  version: string;
}
