// Validation utilities
export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

// Date utilities
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const parseDate = (dateStr: string): Date => {
  return new Date(dateStr);
};

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const createResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
});

export const createError = (error: string): ApiResponse<never> => ({
  success: false,
  error,
});

// Constants
export const APP_NAME = 'Bun Monorepo Demo';
export const API_VERSION = 'v1';
