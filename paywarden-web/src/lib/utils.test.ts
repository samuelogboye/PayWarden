import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, cn } from './utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('formats numbers as Nigerian currency', () => {
      expect(formatCurrency(1000)).toBe('₦1,000.00');
      expect(formatCurrency(1000.50)).toBe('₦1,000.50');
      expect(formatCurrency(0)).toBe('₦0.00');
    });

    it('handles large numbers', () => {
      expect(formatCurrency(1000000)).toBe('₦1,000,000.00');
    });
  });

  describe('formatDate', () => {
    it('formats ISO date strings', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toContain('Jan');
      expect(formatted).toContain('2024');
    });
  });

  describe('cn (classNames utility)', () => {
    it('merges class names', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('filters out falsy values', () => {
      expect(cn('class1', false, 'class2', undefined)).toBe('class1 class2');
    });

    it('handles empty input', () => {
      expect(cn()).toBe('');
    });
  });
});
