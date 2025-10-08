
// Format currency values
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// Format percentage values
export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

// Format dates
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Calculate budget usage percentage
export const calculateBudgetUsage = (spent, budget) => {
  return (spent / budget) * 100;
};

// Get status color for badges
export const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'danger';
    default:
      return 'secondary';
  }
};

// Filter transactions by search term
export const filterTransactions = (transactions, searchTerm, category, status) => {
  return transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.employee.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !category || transaction.category === category;
    const matchesStatus = !status || transaction.status === status;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
};

// Calculate total amount for transactions
export const calculateTotalAmount = (transactions) => {
  return transactions.reduce((total, transaction) => total + Math.abs(transaction.amount), 0);
};

// Generate random ID
export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Debounce function for search
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get priority color for recommendations
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'danger';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'secondary';
  }
};

// Calculate trend percentage
export const calculateTrend = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Sort transactions by date (newest first)
export const sortTransactionsByDate = (transactions, ascending = false) => {
  return [...transactions].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
