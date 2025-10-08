import React, { useEffect, useState } from "react";
import { Card, Row, Col, Badge, Button } from "react-bootstrap";
import {
  FaLightbulb,
  FaArrowRight,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
  FaCog,
} from "react-icons/fa";
import geminiService from "../../services/geminiService";

const AIRecommendations = ({ analytics }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [expandedRec, setExpandedRec] = useState(null);

  // Fetch AI recommendations
  useEffect(() => {
    const fetchData = async () => {
      const recs = await geminiService.generateSpendRecommendations(analytics);
      const recsWithId = recs.map((r, i) => ({ id: i + 1, ...r }));
      setRecommendations(recsWithId);

      console.log("recs",recs);
    };
    fetchData();
  }, [analytics]);


  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "info";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "savings":
        return <FaCheckCircle className="text-success" />;
      case "policy":
        return <FaInfoCircle className="text-info" />;
      case "efficiency":
        return <FaCog className="text-primary" />;
      case "alert":
        return <FaExclamationTriangle className="text-warning" />;
      default:
        return <FaLightbulb className="text-warning" />;
    }
  };

  const toggleExpanded = (id) => {
    setExpandedRec(expandedRec === id ? null : id);
  };

  return (
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <FaLightbulb className="text-warning me-2" />
            <h5 className="mb-0">AI-Powered Recommendations</h5>
          </div>
          <Badge bg="primary" className="px-3 py-2">
            {recommendations.length} insights
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            {recommendations.map((rec) => (
                <Col lg={6} key={rec.id}>
                  <Card
                      className={`h-100 recommendation-card ${
                          expandedRec === rec.id ? "border-primary" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                      onClick={() => toggleExpanded(rec.id)}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div className="d-flex align-items-center">
                          {getTypeIcon(rec.type)}
                          <span className="ms-2 fw-medium">{rec.title}</span>
                        </div>
                        <Badge bg={getPriorityColor(rec.priority)} className="ms-2">
                          {rec.priority}
                        </Badge>
                      </div>

                      <p className="text-muted small mb-3">
                        {expandedRec === rec.id
                            ? rec.description
                            : `${rec.description?.substring(0, 100)}...`}
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <small className="fw-medium text-success">
                          💡 {rec.impact}
                        </small>
                        <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center"
                        >
                          Take Action
                          <FaArrowRight className="ms-1" size={10} />
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
  );
};

export default AIRecommendations;
