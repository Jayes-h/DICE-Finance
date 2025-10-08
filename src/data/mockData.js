// Mock transaction data
export const mockTransactions = [
  {
    id: 1,
    date: '2024-01-15',
    description: 'Office Supplies - Staples',
    category: 'Office Supplies',
    amount: -45.67,
    merchant: 'Staples Inc.',
    status: 'approved',
    employee: 'John Smith',
    department: 'Marketing'
  },
  {
    id: 2,
    date: '2024-01-14',
    description: 'Client Lunch - Downtown Restaurant',
    category: 'Meals & Entertainment',
    amount: -125.50,
    merchant: 'Downtown Restaurant',
    status: 'pending',
    employee: 'Sarah Johnson',
    department: 'Sales'
  },
  {
    id: 3,
    date: '2024-01-14',
    description: 'Uber Ride to Client Meeting',
    category: 'Transportation',
    amount: -23.80,
    merchant: 'Uber',
    status: 'approved',
    employee: 'Mike Chen',
    department: 'Sales'
  },
  {
    id: 4,
    date: '2024-01-13',
    description: 'Software License - Adobe Creative Suite',
    category: 'Software',
    amount: -89.99,
    merchant: 'Adobe Inc.',
    status: 'approved',
    employee: 'Lisa Wang',
    department: 'Design'
  },
  {
    id: 5,
    date: '2024-01-12',
    description: 'Hotel Stay - Business Trip',
    category: 'Travel',
    amount: -245.00,
    merchant: 'Marriott Hotel',
    status: 'approved',
    employee: 'David Rodriguez',
    department: 'Operations'
  },
  {
    id: 6,
    date: '2024-01-12',
    description: 'Flight - Business Trip',
    category: 'Travel',
    amount: -450.75,
    merchant: 'American Airlines',
    status: 'approved',
    employee: 'David Rodriguez',
    department: 'Operations'
  },
  {
    id: 7,
    date: '2024-01-11',
    description: 'Team Building Event',
    category: 'Meals & Entertainment',
    amount: -320.00,
    merchant: 'Escape Room Co.',
    status: 'pending',
    employee: 'Jennifer Lee',
    department: 'HR'
  },
  {
    id: 8,
    date: '2024-01-10',
    description: 'Office Equipment - Monitor',
    category: 'Equipment',
    amount: -299.99,
    merchant: 'Best Buy',
    status: 'approved',
    employee: 'Tom Wilson',
    department: 'IT'
  }
];

// Mock spend analytics data
export const mockSpendAnalytics = {
  totalSpend: 1600.70,
  monthlyBudget: 5000.00,
  categories: [
    { name: 'Travel', amount: 695.75, percentage: 43.5, color: '#FF6B6B' },
    { name: 'Meals & Entertainment', amount: 445.50, percentage: 27.8, color: '#4ECDC4' },
    { name: 'Office Supplies', amount: 345.66, percentage: 21.6, color: '#45B7D1' },
    { name: 'Software', amount: 89.99, percentage: 5.6, color: '#96CEB4' },
    { name: 'Equipment', amount: 299.99, percentage: 1.5, color: '#FFEAA7' }
  ],
  monthlyTrend: [
    { month: 'June', amount: 4200 },
    { month: 'July', amount: 3800 },
    { month: 'Aug', amount: 4500 },
    { month: 'Sept', amount: 1600 }
  ],
  departments: [
    { name: 'Sales', amount: 599.30, percentage: 37.4 },
    { name: 'Operations', amount: 695.75, percentage: 43.5 },
    { name: 'Marketing', amount: 45.67, percentage: 2.9 },
    { name: 'Design', amount: 89.99, percentage: 5.6 },
    { name: 'HR', amount: 320.00, percentage: 20.0 },
    { name: 'IT', amount: 299.99, percentage: 1.9 }
  ]
};

// Mock AI recommendations
export const mockRecommendations = [
  {
    id: 1,
    type: 'savings',
    title: 'Optimize Travel Expenses',
    description: 'Consider booking flights 2 weeks in advance to save 15-20% on travel costs.',
    impact: 'Potential savings: $90-120 per trip',
    priority: 'high',
    category: 'travel'
  },
  {
    id: 2,
    type: 'policy',
    title: 'Review Meal Expense Policy',
    description: 'Current meal expenses exceed department average by 25%. Consider setting per-diem limits.',
    impact: 'Better budget control and compliance',
    priority: 'medium',
    category: 'meals'
  },
  {
    id: 3,
    type: 'efficiency',
    title: 'Bulk Office Supply Orders',
    description: 'Combine office supply orders to reduce shipping costs and get volume discounts.',
    impact: 'Save 10-15% on office supplies',
    priority: 'low',
    category: 'supplies'
  },
  {
    id: 4,
    type: 'alert',
    title: 'Unusual Spending Pattern Detected',
    description: 'Sales department spending increased 40% this month compared to last month.',
    impact: 'Requires immediate review',
    priority: 'high',
    category: 'analytics'
  }
];

// Mock alerts
export const mockAlerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Budget Alert',
    message: 'You are at 75% of your monthly travel budget',
    timestamp: '2024-01-15T10:30:00Z',
    isRead: false
  },
  {
    id: 2,
    type: 'info',
    title: 'New Policy Update',
    message: 'Updated meal expense policy effective January 1st',
    timestamp: '2024-01-14T14:20:00Z',
    isRead: true
  },
  {
    id: 3,
    type: 'success',
    title: 'Expense Approved',
    message: 'Your office supplies expense has been approved',
    timestamp: '2024-01-13T16:45:00Z',
    isRead: true
  }
];
