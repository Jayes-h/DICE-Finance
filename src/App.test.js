import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ children }) => <div data-testid="route">{children}</div>,
  Link: ({ children, to }) => <a href={to} data-testid="link">{children}</a>,
  useLocation: () => ({ pathname: '/' })
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('router')).toBeInTheDocument();
  });

  test('renders navigation', () => {
    render(<App />);
    expect(screen.getByText('DICE Finance')).toBeInTheDocument();
  });

  test('renders main container', () => {
    render(<App />);
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });
});

// Mock component tests
describe('Component Rendering', () => {
  test('Navbar component renders', () => {
    const { getByText } = render(<App />);
    expect(getByText('DICE Finance')).toBeInTheDocument();
  });
});