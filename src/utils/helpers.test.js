import {
  formatCurrency,
  formatPercentage,
  formatDate,
  calculateBudgetUsage,
  getStatusColor,
  filterTransactions,
  calculateTotalAmount,
  generateId,
  isValidEmail,
  getPriorityColor,
  calculateTrend,
  sortTransactionsByDate
} from './helpers';

describe('Helper Functions', () => {
  describe('formatCurrency', () => {
    test('formats positive numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
    });

    test('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    test('formats zero correctly', () => {
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('formatPercentage', () => {
    test('formats percentage with default decimals', () => {
      expect(formatPercentage(85.6789)).toBe('85.7%');
    });

    test('formats percentage with custom decimals', () => {
      expect(formatPercentage(85.6789, 2)).toBe('85.68%');
    });
  });

  describe('formatDate', () => {
    test('formats date string correctly', () => {
      expect(formatDate('2024-01-15')).toBe('Jan 15, 2024');
    });
  });

  describe('calculateBudgetUsage', () => {
    test('calculates budget usage correctly', () => {
      expect(calculateBudgetUsage(2500, 5000)).toBe(50);
      expect(calculateBudgetUsage(7500, 5000)).toBe(150);
    });
  });

  describe('getStatusColor', () => {
    test('returns correct colors for different statuses', () => {
      expect(getStatusColor('approved')).toBe('success');
      expect(getStatusColor('pending')).toBe('warning');
      expect(getStatusColor('rejected')).toBe('danger');
      expect(getStatusColor('unknown')).toBe('secondary');
    });
  });

  describe('filterTransactions', () => {
    const mockTransactions = [
      { id: 1, description: 'Office Supplies', category: 'Supplies', status: 'approved', employee: 'John Doe', amount: 100 },
      { id: 2, description: 'Travel Expense', category: 'Travel', status: 'pending', employee: 'Jane Smith', amount: 200 },
      { id: 3, description: 'Meal Expense', category: 'Meals', status: 'approved', employee: 'Bob Johnson', amount: 50 }
    ];

    test('filters by search term', () => {
      const result = filterTransactions(mockTransactions, 'office', '', '');
      expect(result).toHaveLength(1);
      expect(result[0].description).toBe('Office Supplies');
    });

    test('filters by category', () => {
      const result = filterTransactions(mockTransactions, '', 'Travel', '');
      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('Travel');
    });

    test('filters by status', () => {
      const result = filterTransactions(mockTransactions, '', '', 'approved');
      expect(result).toHaveLength(2);
    });

    test('filters by multiple criteria', () => {
      const result = filterTransactions(mockTransactions, 'expense', 'Travel', 'pending');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });
  });

  describe('calculateTotalAmount', () => {
    test('calculates total amount correctly', () => {
      const transactions = [
        { amount: 100 },
        { amount: -200 },
        { amount: 50 }
      ];
      expect(calculateTotalAmount(transactions)).toBe(350);
    });
  });

  describe('generateId', () => {
    test('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
    });
  });

  describe('isValidEmail', () => {
    test('validates email addresses correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
    });
  });

  describe('getPriorityColor', () => {
    test('returns correct colors for priorities', () => {
      expect(getPriorityColor('high')).toBe('danger');
      expect(getPriorityColor('medium')).toBe('warning');
      expect(getPriorityColor('low')).toBe('info');
      expect(getPriorityColor('unknown')).toBe('secondary');
    });
  });

  describe('calculateTrend', () => {
    test('calculates trend percentage correctly', () => {
      expect(calculateTrend(110, 100)).toBe(10);
      expect(calculateTrend(90, 100)).toBe(-10);
      expect(calculateTrend(100, 0)).toBe(0);
    });
  });

  describe('sortTransactionsByDate', () => {
    const mockTransactions = [
      { id: 1, date: '2024-01-15' },
      { id: 2, date: '2024-01-10' },
      { id: 3, date: '2024-01-20' }
    ];

    test('sorts transactions by date descending by default', () => {
      const result = sortTransactionsByDate(mockTransactions);
      expect(result[0].id).toBe(3);
      expect(result[2].id).toBe(2);
    });

    test('sorts transactions by date ascending when specified', () => {
      const result = sortTransactionsByDate(mockTransactions, true);
      expect(result[0].id).toBe(2);
      expect(result[2].id).toBe(3);
    });
  });
});
