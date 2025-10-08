import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Context provider component
export const AppProvider = ({ children }) => {
  // CSV Data State
  const [csvData, setCsvData] = useState(null);
  const [csvAnalytics, setCsvAnalytics] = useState(null);
  const [csvRecommendations, setCsvRecommendations] = useState([]);
  
  // CSV Data Management Functions
  const updateCsvData = useCallback((data) => {
    setCsvData(data.transactions);
    setCsvAnalytics(data.analytics);
  }, []);

  // Update a single CSV transaction's status by id
  const updateTransactionStatus = useCallback((transactionId, nextStatus) => {
    setCsvData((prev) => {
      if (!prev || !Array.isArray(prev)) return prev;
      const updated = prev.map((t) => (t.id === transactionId ? { ...t, status: nextStatus } : t));
      return updated;
    });
    // Optionally, we could update analytics counts here if needed in future
  }, []);

  const updateCsvRecommendations = useCallback((recommendations) => {
    setCsvRecommendations(recommendations);
  }, []);

  const clearCsvData = useCallback(() => {
    setCsvData(null);
    setCsvAnalytics(null);
    setCsvRecommendations([]);
  }, []);

  // Get context for AI Assistant (CSV-only)
  const getAIContext = useCallback(() => {
    if (!csvAnalytics || !csvData) {
      return {
        currentSpend: 0,
        budget: 0,
        categories: [],
        departments: [],
        transactionCount: 0,
        avgTransactionAmount: 0,
        hasCsvData: false,
        csvTransactionCount: 0,
        csvTotalSpend: 0,
        allTransactions: []
      };
    }

    return {
      currentSpend: csvAnalytics.totalSpend || 0,
      budget: csvAnalytics.monthlyBudget || 0,
      categories: csvAnalytics.categories || [],
      departments: csvAnalytics.departments || [],
      transactionCount: csvAnalytics.transactionCount || 0,
      avgTransactionAmount: csvAnalytics.avgTransactionAmount || 0,
      hasCsvData: true,
      csvTransactionCount: csvData.length,
      csvTotalSpend: csvAnalytics.totalSpend || 0,
      allTransactions: csvData,
      dateRange: csvAnalytics.dateRange
    };
  }, [csvAnalytics, csvData]);

  const value = {
    // CSV Data
    csvData,
    csvAnalytics,
    csvRecommendations,
    
    // Functions
    updateCsvData,
    updateCsvRecommendations,
    clearCsvData,
    getAIContext,
    updateTransactionStatus,
    
    // State flags
    hasCsvData: !!csvData,
    hasAnalytics: !!csvAnalytics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;