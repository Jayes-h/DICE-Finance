// CSV parsing and data transformation utilities

/**
 * Parse CSV content into structured data
 * @param {string} csvContent - Raw CSV content
 * @returns {Object} Parsed CSV data with headers and rows
 */
export const parseCSV = (csvContent) => {
  if (!csvContent || typeof csvContent !== 'string') {
    throw new Error('Invalid CSV content provided');
  }

  const lines = csvContent.split('\n').filter(line => line.trim());
  
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length && values.some(v => v.trim())) {
      const row = {};
      headers.forEach((header, index) => {
        const cleanHeader = header.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        row[cleanHeader] = values[index] ? values[index].trim() : '';
      });
      data.push(row);
    }
  }

  return { headers, data };
};

/**
 * Parse a single CSV line handling quoted values and commas
 * @param {string} line - CSV line to parse
 * @returns {Array} Array of parsed values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

/**
 * Convert CSV data to transaction format
 * @param {Object} csvData - Parsed CSV data
 * @returns {Array} Array of transaction objects
 */
export const convertToTransactions = (csvData) => {
  if (!csvData || !csvData.data || !Array.isArray(csvData.data)) {
    throw new Error('Invalid CSV data provided');
  }

  return csvData.data.map((row, index) => {
    // Map various possible column names to our standard format
    const amount = parseFloat(
      row.amount || 
      row.value || 
      row.cost || 
      row.price || 
      row.expense || 
      row.debit || 
      '0'
    );
    
    const date = normalizeDate(
      row.date || 
      row.transaction_date || 
      row.created_at || 
      row.timestamp || 
      new Date().toISOString().split('T')[0]
    );
    
    const description = cleanString(
      row.description || 
      row.details || 
      row.memo || 
      row.note || 
      row.reference || 
      'Transaction'
    );
    
    const category = cleanString(
      row.category || 
      row.type || 
      row.classification || 
      row.class || 
      'Other'
    );
    
    const merchant = cleanString(
      row.merchant || 
      row.vendor || 
      row.store || 
      row.company || 
      row.supplier || 
      'Unknown'
    );
    
    const employee = cleanString(
      row.employee || 
      row.user || 
      row.name || 
      row.staff || 
      row.person || 
      'Unknown'
    );
    
    const department = cleanString(
      row.department || 
      row.team || 
      row.division || 
      row.unit || 
      row.branch || 
      'General'
    );
    
    const status = normalizeStatus(
      row.status || 
      row.approval_status || 
      row.state || 
      'pending'
    );

    return {
      id: Date.now() + index,
      date: date,
      description: description,
      category: category,
      amount: -Math.abs(amount), // Make negative for expenses
      merchant: merchant,
      status: status,
      employee: employee,
      department: department,
      source: 'csv_upload'
    };
  }).filter(transaction => transaction.amount !== 0); // Filter out zero-amount transactions
};

/**
 * Calculate analytics from transaction data
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} Analytics data
 */
export const calculateAnalytics = (transactions) => {
  if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
    return getEmptyAnalytics();
  }

  const totalSpend = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
  // Group by category
  const categoryMap = {};
  transactions.forEach(t => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { amount: 0, count: 0 };
    }
    categoryMap[t.category].amount += Math.abs(t.amount);
    categoryMap[t.category].count += 1;
  });

  const categories = Object.entries(categoryMap)
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      percentage: totalSpend > 0 ? (data.amount / totalSpend) * 100 : 0,
      color: generateCategoryColor(name)
    }))
    .sort((a, b) => b.amount - a.amount);

  // Group by department
  const deptMap = {};
  transactions.forEach(t => {
    if (!deptMap[t.department]) {
      deptMap[t.department] = { amount: 0, count: 0 };
    }
    deptMap[t.department].amount += Math.abs(t.amount);
    deptMap[t.department].count += 1;
  });

  const departments = Object.entries(deptMap)
    .map(([name, data]) => ({
      name,
      amount: data.amount,
      percentage: totalSpend > 0 ? (data.amount / totalSpend) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount);

  // Generate monthly trend (last 6 months)
  const monthlyTrend = generateMonthlyTrend(transactions);

  // Calculate additional metrics
  const avgTransactionAmount = transactions.length > 0 ? totalSpend / transactions.length : 0;
  const maxTransaction = transactions.reduce((max, t) => 
    Math.abs(t.amount) > Math.abs(max.amount) ? t : max, transactions[0] || { amount: 0 }
  );

  return {
    totalSpend,
    monthlyBudget: totalSpend * 1.5, // Set budget as 150% of current spend
    categories,
    departments,
    monthlyTrend,
    transactionCount: transactions.length,
    avgTransactionAmount,
    maxTransaction: maxTransaction.amount,
    dateRange: getDateRange(transactions)
  };
};

/**
 * Generate monthly trend data based on actual CSV data date range
 * @param {Array} transactions - Transaction data
 * @returns {Array} Monthly trend array
 */
const generateMonthlyTrend = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return [];
  }

  // Get date range from transactions
  const dates = transactions
    .map(t => new Date(t.date))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a - b);

  if (dates.length === 0) {
    return [];
  }

  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  // Create a map of all months in the date range
  const monthlyMap = new Map();
  
  // Add all months from start to end
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const lastDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
  
  while (currentDate <= lastDate) {
    const monthKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}`;
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthlyMap.set(monthKey, {
      month: monthName,
      amount: 0,
      year: currentDate.getFullYear(),
      monthIndex: currentDate.getMonth()
    });
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Group transactions by month
  transactions.forEach(transaction => {
    const transactionDate = new Date(transaction.date);
    if (!isNaN(transactionDate.getTime())) {
      const monthKey = `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`;
      if (monthlyMap.has(monthKey)) {
        monthlyMap.get(monthKey).amount += Math.abs(transaction.amount);
      }
    }
  });

  // Convert map to array and sort by date
  const monthlyTrend = Array.from(monthlyMap.values())
    .sort((a, b) => {
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      return a.monthIndex - b.monthIndex;
    })
    .map(item => ({
      month: item.month,
      amount: item.amount
    }));

  // If we have more than 12 months, show only the last 12
  if (monthlyTrend.length > 12) {
    return monthlyTrend.slice(-12);
  }

  // If we have less than 6 months, pad with empty months at the beginning
  if (monthlyTrend.length < 6) {
    const paddedTrend = [];
    const currentDate = new Date();
    
    // Start from 6 months before the first data month
    const firstDataMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const startFromMonth = new Date(firstDataMonth.getFullYear(), firstDataMonth.getMonth() - 5, 1);
    
    for (let i = 0; i < 6; i++) {
      const date = new Date(startFromMonth.getFullYear(), startFromMonth.getMonth() + i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      
      // Find existing data for this month
      const existingMonth = monthlyTrend.find(item => 
        item.month === monthName
      );
      
      paddedTrend.push({
        month: monthName,
        amount: existingMonth ? existingMonth.amount : 0
      });
    }
    
    return paddedTrend;
  }

  return monthlyTrend;
};

/**
 * Generate consistent color for category
 * @param {string} categoryName - Name of the category
 * @returns {string} HSL color string
 */
const generateCategoryColor = (categoryName) => {
  // Generate a consistent color based on category name
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

/**
 * Normalize date to YYYY-MM-DD format
 * @param {string} dateString - Date string to normalize
 * @returns {string} Normalized date string
 */
const normalizeDate = (dateString) => {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
};

/**
 * Normalize status values
 * @param {string} status - Status string to normalize
 * @returns {string} Normalized status
 */
const normalizeStatus = (status) => {
  const normalized = status.toLowerCase().trim();
  if (['approved', 'approve', 'accepted', 'complete'].includes(normalized)) {
    return 'approved';
  }
  if (['rejected', 'denied', 'declined'].includes(normalized)) {
    return 'rejected';
  }
  return 'pending';
};

/**
 * Clean string values
 * @param {string} str - String to clean
 * @returns {string} Cleaned string
 */
const cleanString = (str) => {
  if (!str) return '';
  return str.toString().trim();
};

/**
 * Get date range from transactions
 * @param {Array} transactions - Transaction data
 * @returns {Object} Date range object
 */
const getDateRange = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return { start: null, end: null };
  }
  
  const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d.getTime()));
  if (dates.length === 0) {
    return { start: null, end: null };
  }
  
  return {
    start: new Date(Math.min(...dates)).toISOString().split('T')[0],
    end: new Date(Math.max(...dates)).toISOString().split('T')[0]
  };
};

/**
 * Get empty analytics structure
 * @returns {Object} Empty analytics object
 */
const getEmptyAnalytics = () => {
  return {
    totalSpend: 0,
    monthlyBudget: 0,
    categories: [],
    departments: [],
    monthlyTrend: [],
    transactionCount: 0,
    avgTransactionAmount: 0,
    maxTransaction: 0,
    dateRange: { start: null, end: null }
  };
};

/**
 * Validate CSV file format
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export const validateCSVFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    return { isValid: false, error: 'File must be a CSV file' };
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    return { isValid: false, error: 'File size must be less than 10MB' };
  }
  
  return { isValid: true };
};

/**
 * Get sample CSV content
 * @returns {string} Sample CSV content
 */
export const getSampleCSV = () => {
  return `date,description,category,amount,merchant,employee,department,status
2024-01-15,Office Supplies - Staples,Office Supplies,45.67,Staples Inc.,John Smith,Marketing,approved
2024-01-14,Client Lunch - Downtown Restaurant,Meals & Entertainment,125.50,Downtown Restaurant,Sarah Johnson,Sales,pending
2024-01-14,Uber Ride to Client Meeting,Transportation,23.80,Uber,Mike Chen,Sales,approved
2024-01-13,Software License - Adobe Creative Suite,Software,89.99,Adobe Inc.,Lisa Wang,Design,approved
2024-01-12,Hotel Stay - Business Trip,Travel,245.00,Marriott Hotel,David Rodriguez,Operations,approved
2024-01-12,Flight - Business Trip,Travel,450.75,American Airlines,David Rodriguez,Operations,approved
2024-01-11,Team Building Event,Meals & Entertainment,320.00,Escape Room Co.,Jennifer Lee,HR,pending
2024-01-10,Office Equipment - Monitor,Equipment,299.99,Best Buy,Tom Wilson,IT,approved`;
};
