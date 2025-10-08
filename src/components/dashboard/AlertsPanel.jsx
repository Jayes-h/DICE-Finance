import React, { useState } from 'react';
import { Alert, Row, Col, Button } from 'react-bootstrap';
import { FaBell, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimes } from 'react-icons/fa';

const AlertsPanel = ({ alerts }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const dismissAlert = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const getAlertVariant = (type) => {
    switch (type) {
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      case 'success': return 'success';
      case 'info': return 'info';
      default: return 'primary';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <FaExclamationTriangle />;
      case 'danger': return <FaExclamationTriangle />;
      case 'success': return <FaCheckCircle />;
      case 'info': return <FaInfoCircle />;
      default: return <FaBell />;
    }
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  const unreadCount = visibleAlerts.filter(alert => !alert.isRead).length;

  if (visibleAlerts.length === 0) {
    return (
      <Alert variant="success" className="d-flex align-items-center">
        <FaCheckCircle className="me-2" />
        <div>
          <Alert.Heading className="mb-1">All Good!</Alert.Heading>
          No pending alerts or notifications at this time.
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">
          <FaBell className="me-2" />
          Alerts & Notifications
          {unreadCount > 0 && (
            <span className="badge bg-danger ms-2">{unreadCount} new</span>
          )}
        </h5>
        <Button 
          variant="outline-secondary" 
          size="sm"
          onClick={() => setDismissedAlerts(alerts.map(alert => alert.id))}
        >
          Dismiss All
        </Button>
      </div>

      <Row className="g-3">
        {visibleAlerts.map((alert) => (
          <Col md={6} key={alert.id}>
            <Alert 
              variant={getAlertVariant(alert.type)} 
              className="d-flex align-items-start"
            >
              <div className="flex-shrink-0 me-3">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-grow-1">
                <Alert.Heading className="h6 mb-1">
                  {alert.title}
                  {!alert.isRead && (
                    <span className="badge bg-primary ms-2" style={{ fontSize: '0.6rem' }}>
                      NEW
                    </span>
                  )}
                </Alert.Heading>
                <p className="mb-2">{alert.message}</p>
                <small className="text-muted">
                  {new Date(alert.timestamp).toLocaleString()}
                </small>
              </div>
              <Button
                variant="link"
                size="sm"
                className="flex-shrink-0 p-0 text-muted"
                onClick={() => dismissAlert(alert.id)}
                style={{ fontSize: '0.8rem' }}
              >
                <FaTimes />
              </Button>
            </Alert>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AlertsPanel;
