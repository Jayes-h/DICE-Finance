import React from 'react';
import { Card } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ data }) => {
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [
      {
        data: data.map(item => item.amount),
        backgroundColor: data.map(item => item.color),
        borderColor: data.map(item => item.color),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percentage = data[context.dataIndex].percentage;
            return `${label}: $${value.toFixed(2)} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };

  return (
    <Card className="h-100">
      <Card.Header>
        <h5 className="mb-0">Spend by Category</h5>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '300px', position: 'relative' }}>
          <Doughnut data={chartData} options={options} />
        </div>
        
        {/* Category Details */}
        <div className="mt-3">
          {data.map((item, index) => (
            <div key={index} className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center">
                <div 
                  className="rounded-circle me-2" 
                  style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: item.color 
                  }}
                ></div>
                <span className="small">{item.name}</span>
              </div>
              <div className="text-end">
                <div className="fw-medium">${item.amount.toFixed(2)}</div>
                <div className="text-muted small">{item.percentage.toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CategoryChart;
