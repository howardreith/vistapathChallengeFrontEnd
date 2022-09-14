import React from 'react'
import { render, screen } from '@testing-library/react';
import LandingPage from "./LandingPage";

describe('LandingPage', () => {
  function sutFactory() {
    return render(<LandingPage />)
  }

  it('should render the landing page', () => {
    sutFactory()
    expect(screen.getByTestId('landingPage')).toBeInTheDocument()
  })
})