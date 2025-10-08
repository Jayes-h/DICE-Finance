import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge } from 'react-bootstrap';
import { FaRobot, FaPaperPlane, FaLightbulb, FaHistory, FaTimes, FaBug, FaFileCsv, FaUpload } from 'react-icons/fa';
import geminiService from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';

const AIAssistant = () => {
  const { getAIContext, csvData, hasCsvData } = useAppContext();
  
  console.log("getAIContect",getAIContext);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI Spend Coach. Upload your CSV file to get started with expense analysis and AI-powered insights.',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [taxTips, setTaxTips] = useState([]);
  const [isTaxLoading, setIsTaxLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    document.title = 'DICE Finance - AI Assistant';
    
    // Update welcome message when CSV data becomes available
    if (hasCsvData && messages.length === 1) {
      const welcomeMessage = {
        id: 2,
        type: 'ai',
        content: 'Great! I can see you\'ve uploaded CSV data. I can now analyze your expenses and provide personalized insights. What would you like to know about your spending?',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, welcomeMessage]);
    }
  }, [messages.length, hasCsvData]);

  // Load AI-generated tax-saving tips when CSV data is available
  useEffect(() => {
    const loadTaxTips = async () => {
      if (!hasCsvData) {
        setTaxTips([]);
        return;
      }
      try {
        setIsTaxLoading(true);
        const context = getAIContext();
        const tips = await geminiService.analyzeTaxSavings(context, csvData);
        setTaxTips(Array.isArray(tips) ? tips : []);
      } catch (e) {
        setTaxTips([]);
      } finally {
        setIsTaxLoading(false);
      }
    };
    loadTaxTips();
  }, [hasCsvData, csvData, getAIContext]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    if (!hasCsvData) {
      const noDataMessage = {
        id: Date.now(),
        type: 'ai',
        content: 'I need CSV data to help you with expense analysis. Please upload your CSV file first by going to the Dashboard.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, noDataMessage]);
      setInputMessage('');
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get current context including CSV data
      const context = getAIContext();
      
      // Check if user is asking about CSV data specifically
      const isCsvRelated = inputMessage.toLowerCase().includes('csv') || 
                          inputMessage.toLowerCase().includes('upload') ||
                          inputMessage.toLowerCase().includes('file');
      
      let aiResponse;
      if (isCsvRelated) {
        // Use CSV-specific analysis
        aiResponse = await geminiService.analyzeCSVData(context, csvData);
        // Convert array response to string
        if (Array.isArray(aiResponse)) {
          aiResponse = aiResponse.map(rec => 
            `${rec.title}: ${rec.description} (Impact: ${rec.impact})`
          ).join('\n\n');
        }
      } else {
        // Use regular chat with CSV context
        aiResponse = await geminiService.chatWithAssistant(inputMessage, context);
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: typeof aiResponse === 'string' ? aiResponse : 'Analysis completed successfully!',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = hasCsvData ? [
    'What are my biggest expense categories?',
    'How can I reduce travel costs?',
    'Am I over budget this month?',
    'What spending patterns do you notice?',
    'Suggest ways to save money',
    'Explain my recent expense trends',
    'Analyze my CSV data',
    'What insights do you have from my data?',
    'Compare spending by department',
    'What are my top merchants?'
  ] : [
    'How do I upload CSV data?',
    'What CSV format is supported?',
    'How does the analysis work?'
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const clearChat = () => {
    const welcomeMessage = hasCsvData 
      ? 'Hello! I\'m your AI Spend Coach. I can see you\'ve uploaded CSV data - feel free to ask me about your expenses! What would you like to know?'
      : 'Hello! I\'m your AI Spend Coach. Upload your CSV file to get started with expense analysis and AI-powered insights.';
    
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: welcomeMessage,
        timestamp: new Date()
      }
    ]);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!hasCsvData) {
    return (
      <Container fluid>
        <div className="mb-4">
          <h1 className="h2 mb-1 fw-bold">AI Spend Coach</h1>
          <p className="text-muted">Upload your CSV data to get personalized insights and recommendations</p>
        </div>

        <Row className="g-4">
          {/* Chat Interface */}
          <Col lg={8}>
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <FaRobot className="text-primary me-2" />
                  <h5 className="mb-0">Chat Assistant</h5>
                  <Badge bg="warning" className="ms-2">Waiting for Data</Badge>
                </div>
                <Button variant="outline-light" size="sm" onClick={clearChat}>
                  <FaHistory className="me-1" />
                  Clear Chat
                </Button>
              </Card.Header>
              <Card.Body className="d-flex flex-column" style={{ height: '600px' }}>
                <div className="flex-grow-1 overflow-auto mb-3">
                  {messages.map((message) => (
                    <div key={message.id} className="mb-3">
                      <div className={`d-flex ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                        <div className={`chat-bubble ${message.type}`}>
                          <div className="message-content">{message.content}</div>
                          <div className="message-time small text-muted mt-1">
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="d-flex justify-content-start mb-3">
                      <div className="chat-bubble ai">
                        <div className="d-flex align-items-center">
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Thinking...
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form */}
                <Form onSubmit={handleSendMessage}>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Ask me anything about your expenses..."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      disabled={isLoading}
                    />
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={!inputMessage.trim() || isLoading}
                    >
                      <FaPaperPlane />
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <div className="d-flex flex-column gap-3">
              <Card className="shadow-sm border-warning">
                <Card.Header className="bg-warning text-dark">
                  <h6 className="mb-0">
                    <FaFileCsv className="me-2" />
                    No CSV Data Available
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Alert variant="info">
                    <small>
                      Upload your CSV file to start getting AI-powered insights about your expenses.
                    </small>
                  </Alert>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => window.location.href = '/'}
                    className="w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaUpload className="me-2" />
                    Go to Dashboard
                  </Button>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h6 className="mb-0">💡 Tips</h6>
                </Card.Header>
                <Card.Body>
                  <div className="small">
                    <div className="mb-2">
                      <strong>Upload CSV:</strong> Use the Dashboard to upload your expense data.
                    </div>
                    <div className="mb-2">
                      <strong>Supported format:</strong> date, description, category, amount, merchant, employee, department, status
                    </div>
                    <div>
                      <strong>Get insights:</strong> Once uploaded, ask me about your spending patterns.
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="mb-4">
        <h1 className="h2 mb-1 fw-bold">AI Spend Coach</h1>
        <p className="text-muted">Get personalized insights and recommendations for your CSV expense data</p>
      </div>

      <Row className="g-4">
        {/* Chat Interface */}
        <Col lg={8}>
          <Card className="h-100 shadow-sm">
            <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <FaRobot className="text-primary me-2" />
                <h5 className="mb-0">Chat Assistant</h5>
                <Badge bg="success" className="ms-2">Online</Badge>
              </div>
              <div className="d-flex gap-2">
                <Button variant="outline-light" size="sm" onClick={clearChat}>
                  <FaHistory className="me-1" />
                  Clear Chat
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="d-flex flex-column" style={{ height: '600px' }}>
              <div className="flex-grow-1 overflow-auto mb-3">
                {messages.map((message) => (
                  <div key={message.id} className="mb-3">
                    <div className={`d-flex ${message.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div className={`chat-bubble ${message.type}`}>
                        <div className="message-content">{message.content}</div>
                        <div className="message-time small text-muted mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="d-flex justify-content-start mb-3">
                    <div className="chat-bubble ai">
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Thinking...
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <Form onSubmit={handleSendMessage}>
                <div className="d-flex gap-2">
                  <Form.Control
                    type="text"
                    placeholder="Ask me anything about your expenses..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    variant="primary"
                    disabled={!inputMessage.trim() || isLoading}
                  >
                    <FaPaperPlane />
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <div className="d-flex flex-column gap-3">
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h6 className="mb-0">
                  <FaLightbulb className="me-2" />
                  Quick Questions
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline-primary"
                      size="sm"
                      className="mb-1"
                      onClick={() => handleQuickQuestion(question)}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-success text-white">
                <h6 className="mb-0">🤖 AI Tax Analysis</h6>
              </Card.Header>
              <Card.Body>
                {!hasCsvData && (
                  <div className="text-center small text-muted">
                    Upload CSV data to get AI-generated GST and Income Tax tips.
                  </div>
                )}
                {hasCsvData && (
                  <div className="small">
                    {isTaxLoading && (
                      <div className="d-flex align-items-center justify-content-center text-muted mb-2">
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Generating tax-saving tips...
                      </div>
                    )}
                    {!isTaxLoading && taxTips && taxTips.length > 0 && (
                      <ul className="mb-0">
                        {taxTips.map((tip, idx) => (
                          <li key={idx} className="mb-2">
                            <div className="d-flex justify-content-between">
                              <strong>{tip.title || 'Recommendation'}</strong>
                              <span className="badge bg-secondary ms-2">{tip.type || 'Tip'}</span>
                            </div>
                            {tip.description && (
                              <div className="text-muted">{tip.description}</div>
                            )}
                            <div className="d-flex justify-content-between mt-1">
                              {tip.impact && <small className="text-success">Impact: {tip.impact}</small>}
                              {tip.priority && <small className="text-muted">Priority: {tip.priority}</small>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {!isTaxLoading && (!taxTips || taxTips.length === 0) && (
                      <div className="text-center text-muted">No tips available yet.</div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">💡 Tips</h6>
              </Card.Header>
              <Card.Body>
                <div className="small">
                  <div className="mb-2">
                    <strong>Be specific:</strong> Ask about particular categories or time periods for better insights.
                  </div>
                  <div className="mb-2">
                    <strong>Compare data:</strong> Request comparisons between departments or categories.
                  </div>
                  <div className="mb-2">
                    <strong>CSV Analysis:</strong> Ask me to analyze your uploaded CSV data specifically.
                  </div>
                  <div>
                    <strong>Get recommendations:</strong> Ask for actionable advice to optimize spending.
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AIAssistant;