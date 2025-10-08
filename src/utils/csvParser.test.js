import { parseCSV, convertToTransactions, calculateAnalytics, validateCSVFile, getSampleCSV } from './csvParser';

describe('CSV Parser Utilities', () => {
  const sampleCSV = `date,description,category,amount,merchant,employee,department,status
2024-01-15,Office Supplies - Staples,Office Supplies,45.67,Staples Inc.,John Smith,Marketing,approved
2024-01-14,Client Lunch - Downtown Restaurant,Meals & Entertainment,125.50,Downtown Restaurant,Sarah Johnson,Sales,pending
2024-01-14,Uber Ride to Client Meeting,Transportation,23.80,Uber,Mike Chen,Sales,approved`;

  describe('parseCSV', () => {
    test('should parse CSV content correctly', () => {
      const result = parseCSV(sampleCSV);
      
      expect(result.headers).toEqual([
        'date', 'description', 'category', 'amount', 'merchant', 'employee', 'department', 'status'
      ]);
      expect(result.data).toHaveLength(3);
      expect(result.data[0]).toHaveProperty('date', '2024-01-15');
      expect(result.data[0]).toHaveProperty('description', 'Office Supplies - Staples');
    });

    test('should handle empty CSV', () => {
      expect(() => parseCSV('')).toThrow('CSV file must contain at least a header row and one data row');
    });

    test('should handle CSV with only headers', () => {
      expect(() => parseCSV('date,amount')).toThrow('CSV file must contain at least a header row and one data row');
    });
  });

  describe('convertToTransactions', () => {
    test('should convert CSV data to transaction format', () => {
      const csvData = parseCSV(sampleCSV);
      const transactions = convertToTransactions(csvData);
      
      expect(transactions).toHaveLength(3);
      expect(transactions[0]).toMatchObject({
        date: '2024-01-15',
        description: 'Office Supplies - Staples',
        category: 'Office Supplies',
        amount: -45.67,
        merchant: 'Staples Inc.',
        status: 'approved',
        employee: 'John Smith',
        department: 'Marketing',
        source: 'csv_upload'
      });
    });

    test('should handle empty data', () => {
      expect(() => convertToTransactions(null)).toThrow('Invalid CSV data provided');
    });
  });

  describe('calculateAnalytics', () => {
    test('should calculate analytics correctly', () => {
      const csvData = parseCSV(sampleCSV);
      const transactions = convertToTransactions(csvData);
      const analytics = calculateAnalytics(transactions);
      
      expect(analytics.totalSpend).toBe(194.97);
      expect(analytics.transactionCount).toBe(3);
      expect(analytics.categories).toHaveLength(3);
      expect(analytics.departments).toHaveLength(2);
      expect(analytics.monthlyTrend).toHaveLength(6);
    });

    test('should handle empty transactions', () => {
      const analytics = calculateAnalytics([]);
      
      expect(analytics.totalSpend).toBe(0);
      expect(analytics.transactionCount).toBe(0);
      expect(analytics.categories).toHaveLength(0);
      expect(analytics.departments).toHaveLength(0);
    });
  });

  describe('validateCSVFile', () => {
    test('should validate CSV file correctly', () => {
      const validFile = { name: 'test.csv', size: 1000 };
      const result = validateCSVFile(validFile);
      
      expect(result.isValid).toBe(true);
    });

    test('should reject non-CSV files', () => {
      const invalidFile = { name: 'test.txt', size: 1000 };
      const result = validateCSVFile(invalidFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File must be a CSV file');
    });

    test('should reject large files', () => {
      const largeFile = { name: 'test.csv', size: 11 * 1024 * 1024 };
      const result = validateCSVFile(largeFile);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File size must be less than 10MB');
    });

    test('should handle null file', () => {
      const result = validateCSVFile(null);
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('No file provided');
    });
  });

  describe('getSampleCSV', () => {
    test('should return sample CSV content', () => {
      const sample = getSampleCSV();
      
      expect(sample).toContain('date,description,category,amount,merchant,employee,department,status');
      expect(sample).toContain('Office Supplies - Staples');
    });
  });
});

