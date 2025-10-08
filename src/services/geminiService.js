class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCnSYhjg8gdmUW4KG6iFVqWYr23dQ3rcz4';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  //  AI recommendations based on analytics data
  async generateSpendRecommendations( analytics) {

    console.log("Gemini Fetch URL:", `${this.baseUrl}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`);

    const prompt = `
    Analyze the following spending data and provide total 3-4 actionable recommendations:
    
    Analytics: ${JSON.stringify(analytics, null, 2)}
    
    Provide recommendations in this format:
    - Type: savings/policy/efficiency/alert
    - Title: Brief recommendation title
    - Description: Detailed explanation
    - Impact: Expected benefit or impact
    - Priority: high/medium/low
    
    Focus on cost optimization, policy compliance, and spending patterns.
    dont use *** in responses .
    `;

    try {
      const url = `${this.baseUrl}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
      console.log('API URL:', url);
      console.log('API Key:', this.apiKey ? 'Present' : 'Missing');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("data of rec",data);
      return this.parseRecommendations(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return this.getFallbackRecommendations();
    }
  }

  // AI Chatatbot
  async chatWithAssistant(message, context = {}) {
    const hasCsvData = context.hasCsvData || false;
    const csvTransactionCount = context.csvTransactionCount || 0;
    const allTransactions = context.allTransactions || [];
    
    const prompt = `
    You are an AI financial assistant for DICE Finance. Help the user with their spending questions.
    
    Context: ${JSON.stringify(context, null, 2)}
    User Question: ${message}
    
    ${hasCsvData ? `
    IMPORTANT: The user has uploaded CSV data with ${csvTransactionCount} transactions. 
    The total dataset includes ${allTransactions.length} transactions (mock data + CSV data).
    When answering questions, consider both mock data and uploaded CSV data.
    You can reference specific transactions from the CSV upload when relevant.
    ` : ''}
    
    Provide a helpful, concise response about spending, budgeting, or expense management. 
    Use specific numbers and data from the context when possible.
    Don't use *** in responses.
    `;

    try {
      const url = `${this.baseUrl}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
      console.log('API URL:', url);
      console.log('API Key:', this.apiKey ? 'Present' : 'Missing');
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      return `I understand you're asking about "${message}". Based on your current spending data (Total: $${context.currentSpend || '1,600'}, Budget: $${context.budget || '5,000'}), here are some insights:

      1. You're currently using ${context.currentSpend && context.budget ? ((context.currentSpend / context.budget) * 100).toFixed(1) : '32'}% of your monthly budget.

      2. Your top spending category appears to be ${context.categories && context.categories[0] ? context.categories[0].name : 'Travel'}.

      3. Consider reviewing your ${context.categories && context.categories[0] ? context.categories[0].name.toLowerCase() : 'travel'} expenses to optimize your budget.

      // Note: This is a demo response. The AI service is currently being configured.`;
    }
  }

  parseRecommendations(text) {
    const recommendations = [];
    const lines = text.split('\n').filter(line => line.trim());
    
    let currentRec = {};
    for (const line of lines) {
      if (line.includes('Type:')) {
        if (Object.keys(currentRec).length > 0) {
          recommendations.push(currentRec);
        }
        currentRec = { type: line.split('Type:')[1].trim() };
      } else if (line.includes('Title:')) {
        currentRec.title = line.split('Title:')[1].trim();
      } else if (line.includes('Description:')) {
        currentRec.description = line.split('Description:')[1].trim();
      } else if (line.includes('Impact:')) {
        currentRec.impact = line.split('Impact:')[1].trim();
      } else if (line.includes('Priority:')) {
        currentRec.priority = line.split('Priority:')[1].trim();
      }
    }
    
    if (Object.keys(currentRec).length > 0) {
      recommendations.push(currentRec);
    }
    
    return recommendations.length > 0 ? recommendations : this.getFallbackRecommendations();
  }

  // AI recommendations when API response is not generate
  getFallbackRecommendations() {
    return [
      {
        type: 'savings',
        title: 'Review Subscription Services',
        description: 'Audit all recurring subscriptions and cancel unused services.',
        impact: 'Potential monthly savings: $200-500',
        priority: 'high'
      },
      {
        type: 'efficiency',
        title: 'Implement Spending Limits',
        description: 'Set category-specific spending limits to better control expenses.',
        impact: 'Improved budget adherence',
        priority: 'medium'
      },
      {
        type: 'policy',
        title: 'Standardize Approval Process',
        description: 'Create clear approval workflows for different expense categories.',
        impact: 'Faster processing and better compliance',
        priority: 'medium'
      }
    ];
  }

  // Analyze CSV data and generate insights
  async analyzeCSVData(csvAnalytics, transactions) {
    const prompt = `
    Analyze the following CSV financial data and provide 4-5 actionable insights and recommendations:
    
    Analytics Summary:
    - Total Spend: $${csvAnalytics.totalSpend?.toFixed(2) || '0'}
    - Transaction Count: ${csvAnalytics.transactionCount || 0}
    - Average Transaction: $${csvAnalytics.avgTransactionAmount?.toFixed(2) || '0'}
    - Date Range: ${csvAnalytics.dateRange?.start || 'N/A'} to ${csvAnalytics.dateRange?.end || 'N/A'}
    
    Category Breakdown:
    ${csvAnalytics.categories?.map(cat => `- ${cat.name}: $${cat.amount?.toFixed(2)} (${cat.percentage?.toFixed(1)}%)`).join('\n') || 'No categories found'}
    
    Department Breakdown:
    ${csvAnalytics.departments?.map(dept => `- ${dept.name}: $${dept.amount?.toFixed(2)} (${dept.percentage?.toFixed(1)}%)`).join('\n') || 'No departments found'}
    
    Sample Transactions:
    ${transactions?.slice(0, 10).map(t => 
      `${t.date} | ${t.category} | ${t.description} | $${Math.abs(t.amount).toFixed(2)} | ${t.employee} (${t.department})`
    ).join('\n') || 'No transactions found'}
    
    Provide insights in this format:
    - Type: savings/policy/efficiency/alert/insight
    - Title: Brief insight title
    - Description: Detailed explanation with specific data points
    - Impact: Expected benefit or impact with potential savings
    - Priority: high/medium/low
    
    Focus on:
    1. Cost optimization opportunities
    2. Spending pattern anomalies
    3. Department/category efficiency
    4. Policy compliance issues
    5. Budget management recommendations
    
    Use specific numbers from the data in your recommendations. Don't use *** in responses.
    `;

    try {
      const url = `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return this.parseRecommendations(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error('Error analyzing CSV data:', error);
      return this.getCSVFallbackRecommendations(csvAnalytics);
    }
  }

  // Analyze CSV data for GST and Income Tax saving opportunities
  async analyzeTaxSavings(csvAnalytics, transactions) {
    const prompt = `
    You are a tax optimization assistant for Indian businesses. Analyze the following CSV-derived analytics and transactions to propose 3-5 actionable tax-saving tips focused on GST and Income Tax.

    Provide recommendations in this exact structured format for each item:
    - Type: GST/IncomeTax
    - Title: Brief, action-oriented title
    - Description: What to do and why, referencing specific data patterns if possible
    - Impact: Expected tax benefit (qualitative or rough quantitative)
    - Priority: high/medium/low

    CSV Analytics Summary:
    - Total Spend: $${csvAnalytics?.totalSpend?.toFixed(2) || '0'}
    - Transaction Count: ${csvAnalytics?.transactionCount || 0}
    - Average Transaction: $${csvAnalytics?.avgTransactionAmount?.toFixed(2) || '0'}
    - Date Range: ${csvAnalytics?.dateRange?.start || 'N/A'} to ${csvAnalytics?.dateRange?.end || 'N/A'}

    Category Breakdown:
    ${csvAnalytics?.categories?.map(cat => `- ${cat.name}: $${cat.amount?.toFixed(2)} (${cat.percentage?.toFixed(1)}%)`).join('\n') || 'No categories found'}

    Department Breakdown:
    ${csvAnalytics?.departments?.map(dept => `- ${dept.name}: $${dept.amount?.toFixed(2)} (${dept.percentage?.toFixed(1)}%)`).join('\n') || 'No departments found'}

    Sample Transactions (first 10):
    ${transactions?.slice(0, 10).map(t => `${t.date} | ${t.category} | ${t.description} | $${Math.abs(t.amount).toFixed(2)} | ${t.employee} (${t.department})`).join('\n') || 'No transactions found'}

    Focus on:
    1) Missed input tax credits (ITC) and GST compliance improvements (e.g., vendor GSTIN validity, expense categories typically eligible for ITC)
    2) TDS/TCS, depreciation, Section 80C/80D/80G and business expense deductions under Income Tax
    3) Timing optimization (advance payments, year-end provisioning) and documentation best practices

    Don't use *** in responses.
    `;

    try {
      const url = `${this.baseUrl}/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const parsed = this.parseRecommendations(text);
      return parsed && parsed.length ? parsed : this.getTaxFallbackRecommendations(csvAnalytics);
    } catch (error) {
      console.error('Error analyzing tax savings with Gemini:', error);
      return this.getTaxFallbackRecommendations(csvAnalytics);
    }
  }

  // Fallback GST/Income Tax tips when API fails
  getTaxFallbackRecommendations(csvAnalytics) {
    const tips = [];
    const topCategory = csvAnalytics?.categories?.[0];
    if (topCategory) {
      tips.push({
        type: 'GST',
        title: `Claim ITC on ${topCategory.name} where eligible`,
        description: `${topCategory.name} forms ${topCategory.percentage?.toFixed(1) || '—'}% of spend. Ensure vendor GSTIN validity and invoices meet ITC criteria to claim input tax credit.`,
        impact: 'Reduce net GST outflow by claiming eligible ITC',
        priority: 'high'
      });
    }
    tips.push(
      {
        type: 'IncomeTax',
        title: 'Capitalize assets and claim depreciation',
        description: 'Identify high-value purchases suitable as fixed assets and apply appropriate depreciation to reduce taxable income.',
        impact: 'Lower taxable profits via depreciation shield',
        priority: 'medium'
      },
      {
        type: 'GST',
        title: 'Reconcile GSTR-2B with purchases',
        description: 'Match purchase invoices with GSTR-2B to catch missed ITC and follow up with vendors for timely filing.',
        impact: 'Recover missed ITC; reduce working capital strain',
        priority: 'high'
      },
      {
        type: 'IncomeTax',
        title: 'Review allowable business deductions',
        description: 'Classify legitimate business expenses (travel, utilities, software) correctly and maintain documentation for deductions.',
        impact: 'Optimize deductible expenses; reduce income tax liability',
        priority: 'medium'
      }
    );
    return tips;
  }

  // Generate CSV-specific fallback recommendations
  getCSVFallbackRecommendations(csvAnalytics) {
    const recommendations = [];
    
    // Analyze top spending category
    if (csvAnalytics.categories && csvAnalytics.categories.length > 0) {
      const topCategory = csvAnalytics.categories[0];
      recommendations.push({
        type: 'savings',
        title: `Optimize ${topCategory.name} Expenses`,
        description: `${topCategory.name} represents ${topCategory.percentage?.toFixed(1)}% of total spend ($${topCategory.amount?.toFixed(2)}). Consider negotiating bulk discounts or finding alternative suppliers.`,
        impact: `Potential savings: $${(topCategory.amount * 0.1).toFixed(2)}-${(topCategory.amount * 0.2).toFixed(2)}`,
        priority: 'high'
      });
    }

    // Department spending analysis
    if (csvAnalytics.departments && csvAnalytics.departments.length > 0) {
      const topDept = csvAnalytics.departments[0];
      recommendations.push({
        type: 'policy',
        title: `Review ${topDept.name} Department Spending`,
        description: `${topDept.name} department accounts for ${topDept.percentage?.toFixed(1)}% of total expenses. Consider implementing department-specific spending limits.`,
        impact: 'Better budget control and accountability',
        priority: 'medium'
      });
    }

    // Transaction volume analysis
    if (csvAnalytics.avgTransactionAmount > 100) {
      recommendations.push({
        type: 'efficiency',
        title: 'High-Value Transaction Review',
        description: `Average transaction amount is $${csvAnalytics.avgTransactionAmount?.toFixed(2)}, indicating significant individual expenses. Implement higher approval thresholds.`,
        impact: 'Reduced processing overhead and better oversight',
        priority: 'medium'
      });
    }

    // General recommendations
    recommendations.push({
      type: 'insight',
      title: 'Data-Driven Decision Making',
      description: `Your CSV data shows ${csvAnalytics.transactionCount} transactions totaling $${csvAnalytics.totalSpend?.toFixed(2)}. Regular analysis of this data will help identify cost-saving opportunities.`,
      impact: 'Improved financial visibility and control',
      priority: 'low'
    });

    return recommendations;
  }
}

export default new GeminiService() ;

