import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Form, InputGroup, Button, Badge, Modal, Alert } from 'react-bootstrap';
import { FaSearch, FaFilter, FaDownload, FaEye, FaCheck, FaTimes, FaFlag, FaFileCsv, FaUpload } from 'react-icons/fa';
import { useAppContext } from '../contexts/AppContext';

const TransactionHistory = () => {
  const { csvData, hasCsvData, updateTransactionStatus } = useAppContext();
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  console.log("csv data aya kyaa ",csvData);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  // Slice data for current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, startIndex + rowsPerPage);

  const categories = csvData ? [...new Set(csvData.map(t => t.category))] : [];
  const statuses = csvData ? [...new Set(csvData.map(t => t.status))] : [];

  useEffect(() => {
    filterTransactions();
    document.title = 'DICE Finance - Transactions';
  }, [searchTerm, selectedCategory, selectedStatus, csvData]);

  const filterTransactions = () => {
    if (!csvData) {
      setFilteredTransactions([]);
      return;
    }

    let filtered = csvData;

    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.employee.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory);
    }

    if (selectedStatus) {
      filtered = filtered.filter(t => t.status === selectedStatus);
    }

    setFilteredTransactions(filtered);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge bg="success">Approved</Badge>;
      case 'pending':
        return <Badge bg="warning">Pending</Badge>;
      case 'rejected':
        return <Badge bg="danger">Rejected</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleApproveTransaction = (transactionId) => {
    updateTransactionStatus(transactionId, 'approved');
  };

  const handleRejectTransaction = (transactionId) => {
    updateTransactionStatus(transactionId, 'rejected');
  };

  const exportToCSV = () => {
    if (!filteredTransactions.length) return;
    
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Merchant', 'Employee', 'Department', 'Status'],
      ...filteredTransactions.map(t => [
        t.date,
        t.description,
        t.category,
        t.amount,
        t.merchant,
        t.employee,
        t.department,
        t.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_transactions.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalAmount = filteredTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);

  if (!hasCsvData) {
    return (
      <Container fluid>
        <div className="mb-4">
          <h1 className="h2 mb-1 fw-bold">Transaction History</h1>
          <p className="text-muted">View and manage your expense transactions</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="shadow-sm border-warning">
              <Card.Body className="text-center py-5">
                <FaFileCsv size={64} className="text-warning mb-4" />
                <h4 className="text-warning mb-3">No CSV Data Available</h4>
                <p className="text-muted mb-4">
                  Upload your CSV file to view and manage your expense transactions.
                </p>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => window.location.href = '/'}
                  className="d-flex align-items-center mx-auto"
                >
                  <FaUpload className="me-2" />
                  Go to Dashboard to Upload CSV
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid>
      <div className="mb-4">
        <h1 className="h2 mb-1 fw-bold">Transaction History</h1>
        <p className="text-muted">View, filter, and manage your CSV expense transactions</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Button 
                variant="outline-primary" 
                onClick={exportToCSV} 
                className="w-100"
                disabled={!filteredTransactions.length}
              >
                <FaDownload className="me-1" />
                Export
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center border-primary">
            <Card.Body>
              <h5 className="text-primary">{filteredTransactions.length}</h5>
              <small className="text-muted">Filtered Transactions</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-success">
            <Card.Body>
              <h5 className="text-success">${totalAmount.toFixed(2)}</h5>
              <small className="text-muted">Total Amount</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-warning">
            <Card.Body>
              <h5 className="text-warning">
                {filteredTransactions.filter(t => t.status === 'pending').length}
              </h5>
              <small className="text-muted">Pending Approval</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-info">
            <Card.Body>
              <h5 className="text-info">{categories.length}</h5>
              <small className="text-muted">Categories</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card className="shadow-sm">
        <Card.Header className="bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">CSV Transactions</h5>
          <Badge bg="info" className="d-flex align-items-center">
            <FaFileCsv className="me-1" />
            {csvData?.length || 0} total
          </Badge>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredTransactions.length === 0 ? (
              <div className="text-center py-5">
                <FaSearch size={48} className="text-muted mb-3" />
                <h5 className="text-muted">No transactions found</h5>
                <p className="text-muted">Try adjusting your filters or search terms.</p>
              </div>
          ) : (
              <>
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                          <td>{new Date(transaction.date).toLocaleDateString()}</td>
                          <td>
                            <div>
                              <div className="fw-medium">{transaction.description}</div>
                              <small className="text-muted">{transaction.merchant}</small>
                            </div>
                          </td>
                          <td>
                            <Badge bg="light" text="dark">{transaction.category}</Badge>
                          </td>
                          <td className="fw-medium">
                            ${Math.abs(transaction.amount).toFixed(2)}
                          </td>
                          <td>{transaction.employee}</td>
                          <td>{transaction.department}</td>
                          <td>{getStatusBadge(transaction.status)}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleViewTransaction(transaction)}
                                  title="View Details"
                              >
                                <FaEye />
                              </Button>
                              {transaction.status === "pending" && (
                                  <>
                                    <Button
                                        variant="outline-success"
                                        size="sm"
                                        onClick={() => handleApproveTransaction(transaction.id)}
                                        title="Approve"
                                    >
                                      <FaCheck />
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleRejectTransaction(transaction.id)}
                                        title="Reject"
                                    >
                                      <FaTimes />
                                    </Button>
                                  </>
                              )}
                              <Button variant="outline-warning" size="sm" title="Flag">
                                <FaFlag />
                              </Button>
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center p-3">
                  <Button
                      variant="secondary"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  <span>
                Page {currentPage} of {totalPages}
              </span>
                  <Button
                      variant="secondary"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </>
          )}
        </Card.Body>
      </Card>
      {/* Transaction Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Transaction Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTransaction && (
            <Row className="g-3">
              <Col md={6}>
                <strong>Date:</strong> {new Date(selectedTransaction.date).toLocaleDateString()}
              </Col>
              <Col md={6}>
                <strong>Amount:</strong> ${Math.abs(selectedTransaction.amount).toFixed(2)}
              </Col>
              <Col md={12}>
                <strong>Description:</strong> {selectedTransaction.description}
              </Col>
              <Col md={6}>
                <strong>Category:</strong> {selectedTransaction.category}
              </Col>
              <Col md={6}>
                <strong>Merchant:</strong> {selectedTransaction.merchant}
              </Col>
              <Col md={6}>
                <strong>Employee:</strong> {selectedTransaction.employee}
              </Col>
              <Col md={6}>
                <strong>Department:</strong> {selectedTransaction.department}
              </Col>
              <Col md={6}>
                <strong>Status:</strong> {getStatusBadge(selectedTransaction.status)}
              </Col>
              <Col md={6}>
                <strong>Source:</strong> <Badge bg="info">CSV Upload</Badge>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedTransaction?.status === 'pending' && (
            <>
              <Button 
                variant="success" 
                onClick={() => {
                  handleApproveTransaction(selectedTransaction.id);
                  setShowModal(false);
                }}
              >
                Approve
              </Button>
              <Button 
                variant="danger"
                onClick={() => {
                  handleRejectTransaction(selectedTransaction.id);
                  setShowModal(false);
                }}
              >
                Reject
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default TransactionHistory;