import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaDollarSign, FaChartPie, FaExclamationTriangle, FaArrowUp } from 'react-icons/fa';

const SpendOverview = ({ analytics }) => {

  console.log("analytics in spendO",analytics);

  const budgetUsedPercentage = (analytics.totalSpend / analytics.monthlyBudget) * 100;
  const remainingBudget = analytics.monthlyBudget - analytics.totalSpend;

  const getBudgetStatus = () => {
    if (budgetUsedPercentage >= 90) return 'danger';
    if (budgetUsedPercentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <Card className="h-100">
      <Card.Header>
        <h5 className="mb-0">Spend Overview</h5>
      </Card.Header>
      <Card.Body>
        <Row className="g-3">
          {/* Total Spend */}
          <Col md={6}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <FaDollarSign className="text-primary" size={24} />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <div className="fw-bold fs-4">${analytics.totalSpend.toLocaleString()}</div>
                <div className="text-muted small">Total Spend</div>
              </div>
            </div>
          </Col>

          {/* Monthly Budget */}
          <Col md={6}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <FaChartPie className="text-info" size={24} />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <div className="fw-bold fs-4">${analytics.monthlyBudget.toLocaleString()}</div>
                <div className="text-muted small">Monthly Budget</div>
              </div>
            </div>
          </Col>

          {/* Budget Usage */}
          <Col md={6}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                  <FaExclamationTriangle className="text-warning" size={24} />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <div className="fw-bold fs-4">{budgetUsedPercentage.toFixed(1)}%</div>
                <div className="text-muted small">Budget Used</div>
              </div>
            </div>
          </Col>

          {/* Remaining Budget */}
          <Col md={6}>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <FaArrowUp className="text-success" size={24} />
                </div>
              </div>
              <div className="flex-grow-1 ms-3">
                <div className="fw-bold fs-4">${remainingBudget.toLocaleString()}</div>
                <div className="text-muted small">Remaining</div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="d-flex justify-content-between mb-1">
            <small className="text-muted">Budget Progress</small>
            <small className="text-muted">{budgetUsedPercentage.toFixed(1)}%</small>
          </div>
          <div className="progress" style={{ height: '8px' }}>
            <div 
              className={`progress-bar bg-${getBudgetStatus()}`}
              role="progressbar"
              style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
              aria-valuenow={budgetUsedPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SpendOverview;
