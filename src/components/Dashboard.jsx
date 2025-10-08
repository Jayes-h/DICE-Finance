import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Container, Button } from 'react-bootstrap';
import SpendOverview from './dashboard/SpendOverview';
import CategoryChart from './dashboard/CategoryChart';
import MonthlyTrend from './dashboard/MonthlyTrend';
import AIRecommendations from './dashboard/AIRecommendations';
import CsvUpload from './CsvUpload';
import { useAppContext } from '../contexts/AppContext';

const Dashboard = () => {
  const { 
    csvData, 
    csvAnalytics, 
    csvRecommendations, 
    updateCsvData, 
    updateCsvRecommendations,
    clearCsvData
  } = useAppContext();

  console.log("csvRecommendations", csvRecommendations);

  useEffect(() => {
    document.title = 'DICE Finance - Dashboard';
  }, []);

  // Handle CSV data upload
  const handleCsvDataUpload = (data) => {
    updateCsvData(data);
  };

  // Handle CSV analysis completion
  const handleCsvAnalysisComplete = async (data) => {
    updateCsvData(data);
    
    // Generate AI recommendations for CSV data
    try {
      const geminiService = (await import('../services/geminiService')).default;
      const csvRecs = await geminiService.analyzeCSVData(data.analytics, data.transactions);
      updateCsvRecommendations(csvRecs);
    } catch (error) {
      console.error('Error generating CSV recommendations:', error);
      updateCsvRecommendations([]);
    }
  };

  return (
    <Container fluid>
      <div className="mb-4">
        <h1 className="h2 mb-1 fw-bold">Spend Dashboard</h1>
        <p className="text-muted">Upload your CSV data to monitor expenses, track trends, and get AI-powered insights</p>
      </div>

      {!csvAnalytics ? (
        // Show upload interface when no CSV data is available
        <div className="mt-3">
          <Row className="mb-4">
            <Col lg={8}>
              <CsvUpload 
                onDataUploaded={handleCsvDataUpload}
                onAnalysisComplete={handleCsvAnalysisComplete}
              />
            </Col>
            <Col lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">CSV Analysis Guide</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <h6>How to prepare your CSV file:</h6>
                    <ul className="list-unstyled">
                      <li>• Include headers in the first row</li>
                      <li>• Use standard column names (see sample CSV)</li>
                      <li>• Ensure dates are in YYYY-MM-DD format</li>
                      <li>• Use positive values for expenses</li>
                      <li>• Keep file size under 10MB</li>
                    </ul>
                  </div>
                  <div className="mb-3">
                    <h6>Supported columns:</h6>
                    <small className="text-muted">
                      date, description, category, amount, merchant, employee, department, status
                    </small>
                  </div>
                  <div className="alert alert-info">
                    <small>
                      <strong>Note:</strong> Upload your CSV file to get started with expense analysis and AI-powered insights.
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Welcome message when no data */}
          <Row>
            <Col>
              <Card className="shadow-sm border-primary">
                <Card.Body className="text-center py-5">
                  <h4 className="text-primary mb-3">Welcome to DICE Finance Dashboard</h4>
                  <p className="text-muted mb-4">
                    Upload your CSV file to start analyzing your expenses and getting AI-powered insights.
                  </p>
                  <div className="row justify-content-center">
                    <div className="col-md-8">
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                            1
                          </div>
                          <span>Upload your CSV file with expense data</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                            2
                          </div>
                          <span>View comprehensive analytics and charts</span>
                        </div>
                        <div className="d-flex align-items-center">
                          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '40px', height: '40px'}}>
                            3
                          </div>
                          <span>Get AI-powered recommendations and insights</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : (
        // Show analysis when CSV data is available
        <div className="mt-3">
          {/* Header with clear data option */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="text-success mb-1">
                    <i className="fas fa-check-circle me-2"></i>
                    CSV Data Loaded Successfully
                  </h4>
                  <p className="text-muted mb-0">
                    {csvAnalytics.transactionCount} transactions analyzed • 
                    ${csvAnalytics.totalSpend?.toFixed(2)} total spend
                  </p>
                </div>
                <Button 
                  variant="outline-danger" 
                  onClick={clearCsvData}
                  className="d-flex align-items-center"
                >
                  <i className="fas fa-trash me-2"></i>
                  Clear Data
                </Button>
              </div>
            </Col>
          </Row>

          {/* Upload new file option */}
          <Row className="mb-4">
            <Col lg={6}>
              <Card className="h-100 shadow-sm">
                {/*<Card.Header className="bg-info text-white">*/}
                {/*  <h5 className="mb-0">Upload New CSV</h5>*/}
                {/*</Card.Header>*/}
                <Card.Body>
                  <CsvUpload 
                    onDataUploaded={handleCsvDataUpload}
                    onAnalysisComplete={handleCsvAnalysisComplete}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0">CSV Data Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between">
                      <span>Total Transactions:</span>
                      <strong>{csvAnalytics.transactionCount}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Average Transaction:</span>
                      <strong>${csvAnalytics.avgTransactionAmount?.toFixed(2)}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Date Range:</span>
                      <small>{csvAnalytics.dateRange?.start} to {csvAnalytics.dateRange?.end}</small>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Categories:</span>
                      <strong>{csvAnalytics.categories?.length || 0}</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>Departments:</span>
                      <strong>{csvAnalytics.departments?.length || 0}</strong>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Main Analytics */}
          <Row className="mb-4">
            <Col lg={8}>
              <SpendOverview analytics={csvAnalytics} />
            </Col>
            <Col lg={4}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Quick Stats</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-3">
                    <div className="text-center p-3 bg-light rounded">
                      <h3 className="text-primary mb-1">{csvAnalytics.transactionCount}</h3>
                      <small className="text-muted">Total Transactions</small>
                    </div>
                    <div className="text-center p-3 bg-light rounded">
                      <h3 className="text-success mb-1">${csvAnalytics.totalSpend?.toFixed(2)}</h3>
                      <small className="text-muted">Total Spend</small>
                    </div>
                    <div className="text-center p-3 bg-light rounded">
                      <h3 className="text-info mb-1">${csvAnalytics.avgTransactionAmount?.toFixed(2)}</h3>
                      <small className="text-muted">Average Transaction</small>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row className="mb-4">
            <Col lg={6}>
              <CategoryChart data={csvAnalytics.categories} />
            </Col>
            <Col lg={6}>
              <MonthlyTrend data={csvAnalytics.monthlyTrend} />
            </Col>
          </Row>

          {/* AI Recommendations */}
          {csvRecommendations.length > 0 && (
            <Row className="mb-4">
              <Col>
                <AIRecommendations
                  recommendations={csvRecommendations}
                  analytics={csvAnalytics}
                />
              </Col>
            </Row>
          )}

          {/* Data Tables */}
          <Row>
            <Col lg={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Spend by Department</h5>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Department</th>
                          <th className="text-end">Amount</th>
                          <th className="text-end">%</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvAnalytics.departments?.map((dept, index) => (
                          <tr key={index}>
                            <td>{dept.name}</td>
                            <td className="text-end fw-medium">${dept.amount.toFixed(2)}</td>
                            <td className="text-end">
                              <span className="badge bg-light text-dark">{dept.percentage.toFixed(1)}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h5 className="mb-0">Sample Transactions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-column gap-3">
                    {csvData?.slice(0, 5).map((transaction, index) => (
                      <div key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                          <div className="fw-medium">{transaction.description}</div>
                          <small className="text-muted">{transaction.category} • ${Math.abs(transaction.amount).toFixed(2)}</small>
                        </div>
                        <span className={`badge bg-${transaction.status === 'approved' ? 'success' : transaction.status === 'pending' ? 'warning' : 'danger'}`}>
                          {transaction.status}
                        </span>
                      </div>
                    ))}
                    {csvData?.length > 5 && (
                      <small className="text-muted text-center">
                        ... and {csvData.length - 5} more transactions
                      </small>
                    )}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;