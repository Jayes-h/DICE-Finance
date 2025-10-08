import React from 'react';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const MonthlyTrend = ({ data }) => {
  // Handle empty or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <Card className="h-100">
        <Card.Header>
          <h5 className="mb-0">Monthly Trend</h5>
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <div className="mb-2">📊</div>
            <div>No monthly data available</div>
          </div>
        </Card.Body>
      </Card>
    );
  }

  // Check if all amounts are zero
  const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0);
  const hasData = totalAmount > 0;

  const chartData = {
    labels: data.map(item => item.month || 'Unknown'),
    datasets: [
      {
        label: 'Monthly Spend',
        data: data.map(item => item.amount || 0),
        borderColor: hasData ? 'rgb(75, 192, 192)' : 'rgb(200, 200, 200)',
        backgroundColor: hasData ? 'rgba(75, 192, 192, 0.1)' : 'rgba(200, 200, 200, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: hasData ? 'rgb(75, 192, 192)' : 'rgb(200, 200, 200)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Spend: $${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: 'rgb(75, 192, 192)',
      },
    },
  };

  // Calculate trend
  const currentMonth = data[data.length - 1]?.amount || 0;
  const previousMonth = data[data.length - 2]?.amount || 0;
  const trendPercentage = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0;
  
  // Calculate average monthly spend
  const averageMonthlySpend = data.length > 0 ? totalAmount / data.length : 0;
  
  // Find peak month
  const peakMonth = data.reduce((max, item) => 
    (item.amount || 0) > (max.amount || 0) ? item : max, 
    { amount: 0, month: 'N/A' }
  );

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Monthly Trend</h5>
        <div className="d-flex align-items-center">
          {data.length >= 2 ? (
            <>
              <span className={`badge ${trendPercentage >= 0 ? 'bg-success' : 'bg-danger'} me-2`}>
                {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
              </span>
              <small className="text-muted">vs last month</small>
            </>
          ) : (
            <small className="text-muted">Single month data</small>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        <div style={{ height: '300px', position: 'relative' }}>
          <Line data={chartData} options={options} />
        </div>
        
        {/* Trend Summary */}
        <div className="row mt-3 text-center">
          <div className="col-4">
            <div className="border-end">
              <div className="fw-bold fs-5">${currentMonth.toLocaleString()}</div>
              <div className="text-muted small">Latest Month</div>
            </div>
          </div>
          <div className="col-4">
            <div className="border-end">
              <div className="fw-bold fs-5">${averageMonthlySpend.toLocaleString()}</div>
              <div className="text-muted small">Average Monthly</div>
            </div>
          </div>
          <div className="col-4">
            <div className="fw-bold fs-5">${peakMonth.amount.toLocaleString()}</div>
            <div className="text-muted small">Peak: {peakMonth.month}</div>
          </div>
        </div>
        
        {/* Data Info */}
        {data.length > 0 && (
          <div className="mt-2 text-center">
            <small className="text-muted">
              Showing {data.length} month{data.length !== 1 ? 's' : ''} of data
            </small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MonthlyTrend;

