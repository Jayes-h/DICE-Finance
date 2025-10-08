import React, { useState, useCallback } from 'react';
import { Card, Button, Alert, ProgressBar, Row, Col } from 'react-bootstrap';
import { FaUpload, FaFileCsv, FaCheck, FaTimes, FaDownload } from 'react-icons/fa';
import { parseCSV, convertToTransactions, calculateAnalytics, validateCSVFile, getSampleCSV } from '../utils/csvParser';

const CsvUpload = ({ onDataUploaded, onAnalysisComplete }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedData, setUploadedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle drag and drop events
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);


  // Handle file drop
  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));
    
    if (!csvFile) {
      setUploadStatus({ type: 'error', message: 'Please upload a valid CSV file' });
      return;
    }

    await processFile(csvFile);
  }, []);

  // Handle file input change
  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processFile(file);
    }
  };

  // Process uploaded file
  const processFile = async (file) => {
    setUploadStatus(null);
    setUploadProgress(0);
    setIsProcessing(true);

    try {
      // Validate file
      const validation = validateCSVFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      setUploadedFileName(file.name);
      setUploadProgress(25);

      // Read file content
      const content = await readFileContent(file);
      setUploadProgress(50);

      // Parse CSV
      const csvData = parseCSV(content);
      setUploadProgress(75);

      // Convert to transactions
      const transactions = convertToTransactions(csvData);
      const analytics = calculateAnalytics(transactions);

      setUploadedData({ transactions, analytics, csvData });
      setUploadProgress(100);
      setUploadStatus({ 
        type: 'success', 
        message: `Successfully processed ${transactions.length} transactions from ${file.name}` 
      });

      // Notify parent component
      if (onDataUploaded) {
        onDataUploaded({ transactions, analytics });
      }

      if (onAnalysisComplete) {
        onAnalysisComplete({ transactions, analytics });
      }

    } catch (error) {
      setUploadStatus({ type: 'error', message: error.message });
      setUploadProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  // Read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  // Download sample CSV template
  const downloadSampleCSV = () => {
    const sampleData = getSampleCSV();

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Reset upload
  const resetUpload = () => {
    setUploadedData(null);
    setUploadedFileName('');
    setUploadStatus(null);
    setUploadProgress(0);
    setIsProcessing(false);
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Header className="bg-info text-white">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaFileCsv className="me-2" />
            <h5 className="mb-0">CSV Data Upload</h5>
          </div>
          <Button 
            variant="light" 
            size="sm" 
            onClick={downloadSampleCSV}
            className="d-flex align-items-center"
          >
            <FaDownload className="me-1" />
            Sample CSV
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {!uploadedData ? (
          <div
            className={`upload-area ${isDragOver ? 'drag-over' : ''} ${isProcessing ? 'processing' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: '2px dashed #dee2e6',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: isDragOver ? '#f8f9fa' : 'transparent',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
          >
            {isProcessing ? (
              <div>
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Processing...</span>
                </div>
                <h6>Processing CSV file...</h6>
                <ProgressBar now={uploadProgress} className="mt-3" />
                <small className="text-muted mt-2 d-block">
                  {uploadProgress < 50 ? 'Reading file...' : 
                   uploadProgress < 75 ? 'Parsing data...' : 
                   'Converting to transactions...'}
                </small>
              </div>
            ) : (
              <div>
                <FaUpload className="text-muted mb-3" size={48} />
                <h5>Upload CSV File</h5>
                <p className="text-muted mb-3">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                  id="csv-upload-input"
                />
                <Button
                  variant="primary"
                  onClick={() => document.getElementById('csv-upload-input').click()}
                >
                  <FaUpload className="me-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-success">
            <div className="d-flex align-items-center mb-3">
              <FaCheck className="text-success me-2" size={24} />
              <div>
                <h6 className="mb-0">Upload Successful</h6>
                <small className="text-muted">{uploadedFileName}</small>
              </div>
            </div>
            
            <Row className="g-3 mb-3">
              <Col md={6}>
                <div className="text-center p-3 bg-light rounded">
                  <h4 className="text-primary mb-0">{uploadedData.analytics.transactionCount}</h4>
                  <small className="text-muted">Transactions</small>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-center p-3 bg-light rounded">
                  <h4 className="text-success mb-0">
                    ${uploadedData.analytics.totalSpend.toFixed(2)}
                  </h4>
                  <small className="text-muted">Total Spend</small>
                </div>
              </Col>
            </Row>

            <div className="d-flex gap-2">
              <Button variant="outline-primary" size="sm" onClick={resetUpload}>
                <FaTimes className="me-1" />
                Upload New File
              </Button>
            </div>
          </div>
        )}

        {uploadStatus && (
          <Alert 
            variant={uploadStatus.type === 'success' ? 'success' : 'danger'} 
            className="mt-3"
          >
            {uploadStatus.message}
          </Alert>
        )}

        <div className="mt-3">
          <small className="text-muted">
            <strong>Supported CSV format:</strong><br />
            Columns: date, description, category, amount, merchant, employee, department, status<br />
            <em>Download the sample CSV above to see the expected format.</em>
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CsvUpload;
