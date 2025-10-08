// Simple API test function for debugging Gemini API issues
export const testGeminiAPI = async () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCnSYhjg8gdmUW4KG6iFVqWYr23dQ3rcz4';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
  console.log('Testing Gemini API...');
  console.log('API Key:', apiKey ? 'Present' : 'Missing');
  console.log('API URL:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, can you respond with "API test successful"?'
          }]
        }]
      })
    });
    
    console.log('Response Status:', response.status);
    console.log('Response Headers:', response.headers);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response:', errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
    
    const data = await response.json();
    console.log('Success Response:', data);
    return { success: true, data };
    
  } catch (error) {
    console.error('Network Error:', error);
    return { success: false, error: error.message };
  }
};

// Test different endpoint variations
export const testGeminiEndpoints = async () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCnSYhjg8gdmUW4KG6iFVqWYr23dQ3rcz4';
  
  const endpoints = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
  ];
  
  console.log('Testing multiple Gemini endpoints...');
  
  for (const endpoint of endpoints) {
    const url = `${endpoint}?key=${apiKey}`;
    console.log(`Testing: ${url}`);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: 'Test'
            }]
          }]
        })
      });
      
      console.log(`Endpoint ${endpoint}: Status ${response.status}`);
      
    } catch (error) {
      console.error(`Endpoint ${endpoint}: Error ${error.message}`);
    }
  }
};
