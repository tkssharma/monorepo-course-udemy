import { describe, expect, test } from 'bun:test';
import { isEmail, isNotEmpty, formatDate, createResponse, createError } from './index';

describe('Validation utilities', () => {
  test('isEmail validates correct emails', () => {
    expect(isEmail('test@example.com')).toBe(true);
    expect(isEmail('user.name@domain.org')).toBe(true);
  });

  test('isEmail rejects invalid emails', () => {
    expect(isEmail('invalid')).toBe(false);
    expect(isEmail('missing@domain')).toBe(false);
    expect(isEmail('@nodomain.com')).toBe(false);
  });

  test('isNotEmpty checks for non-empty strings', () => {
    expect(isNotEmpty('hello')).toBe(true);
    expect(isNotEmpty('')).toBe(false);
    expect(isNotEmpty('   ')).toBe(false);
  });
});

describe('Date utilities', () => {
  test('formatDate returns ISO date string', () => {
    const date = new Date('2026-01-15T10:30:00Z');
    expect(formatDate(date)).toBe('2026-01-15');
  });
});

describe('Response utilities', () => {
  test('createResponse creates success response', () => {
    const response = createResponse({ id: 1, name: 'Test' });
    expect(response.success).toBe(true);
    expect(response.data).toEqual({ id: 1, name: 'Test' });
  });

  test('createError creates error response', () => {
    const response = createError('Something went wrong');
    expect(response.success).toBe(false);
    expect(response.error).toBe('Something went wrong');
  });
});
