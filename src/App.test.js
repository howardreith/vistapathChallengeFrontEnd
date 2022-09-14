import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the app wrapper', () => {
    render(<App />);
    expect(screen.getByTestId('appWrapper')).toBeInTheDocument();
  });
});
