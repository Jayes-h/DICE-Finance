import React from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { 
  FaPlus, 
  FaFileExport, 
  FaUserCheck, 
  FaFlag, 
  FaReceipt, 
  FaChartBar,
  FaCog,
  FaQuestionCircle
} from 'react-icons/fa';

const QuickActions = () => {
  const handleAction = (action) => {
    // In a real app, this would trigger the appropriate action
    console.log(`Action triggered: ${action}`);
    // You could show a modal, navigate to a page, or make an API call
  };

  const primaryActions = [
    {
      id: 'add-expense',
      title: 'Add Expense',
      description: 'Record a new expense',
      icon: <FaPlus />,
      variant: 'primary',
      action: () => handleAction('add-expense')
    },
    {
      id: 'export-report',
      title: 'Export Report',
      description: 'Download spend report',
      icon: <FaFileExport />,
      variant: 'success',
      action: () => handleAction('export-report')
    },
    {
      id: 'approve-expenses',
      title: 'Approve Expenses',
      description: 'Review pending expenses',
      icon: <FaUserCheck />,
      variant: 'warning',
      action: () => handleAction('approve-expenses')
    }
  ];

  const secondaryActions = [
    {
      id: 'flag-transaction',
      title: 'Flag Transaction',
      icon: <FaFlag />,
      action: () => handleAction('flag-transaction')
    },
    {
      id: 'view-receipts',
      title: 'View Receipts',
      icon: <FaReceipt />,
      action: () => handleAction('view-receipts')
    },
    {
      id: 'generate-insights',
      title: 'Generate Insights',
      icon: <FaChartBar />,
      action: () => handleAction('generate-insights')
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: <FaCog />,
      action: () => handleAction('settings')
    }
  ];

  return (
    <Card className="h-100">
      <Card.Header>
        <h5 className="mb-0">Quick Actions</h5>
      </Card.Header>
      <Card.Body>
        {/* Primary Actions */}
        <div className="mb-4">
          <h6 className="text-muted mb-3">Frequent Actions</h6>
          {primaryActions.map((action) => (
            <Button
              key={action.id}
              variant={action.variant}
              className="w-100 mb-2 d-flex align-items-center"
              onClick={action.action}
            >
              <span className="me-2">{action.icon}</span>
              <div className="text-start">
                <div className="fw-medium">{action.title}</div>
                <small className="opacity-75">{action.description}</small>
              </div>
            </Button>
          ))}
        </div>

        {/* Secondary Actions */}
        {/* <div>
          <h6 className="text-muted mb-3">Other Actions</h6>
          <ListGroup variant="flush">
            {secondaryActions.map((action) => (
              <ListGroup.Item 
                key={action.id}
                className="d-flex align-items-center justify-content-between border-0 px-0 cursor-pointer"
                style={{ cursor: 'pointer' }}
                onClick={action.action}
              >
                <div className="d-flex align-items-center">
                  <span className="me-3 text-muted">{action.icon}</span>
                  <span>{action.title}</span>
                </div>
                <FaQuestionCircle className="text-muted" size={12} />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div> */}

        {/* Help Section */}
        <div className="mt-4 p-3 bg-light rounded">
          <div className="d-flex align-items-center mb-2">
            <FaQuestionCircle className="text-primary me-2" />
            <small className="fw-medium">Need Help?</small>
          </div>
          <p className="small text-muted mb-2">
            Get assistance with expense management and policy questions.
          </p>
          <Button variant="outline-primary" size="sm" className="w-100">
            Contact Support
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default QuickActions;
