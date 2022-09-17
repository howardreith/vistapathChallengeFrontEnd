import React from 'react';
import {
  render, screen, fireEvent, asyncFlush, waitForComponentToPaint,
} from '../../utils/testUtils';
import CreateCaseAnalysisForm from './CreateCaseAnalysisForm';
import { STATUSES } from '../../utils/constants';

describe('CreateCaseAnalysisForm', () => {
  const defaultProps = {
    selectedCaseAnalysis: {
      caseName: 'banana',
      notes: 'They peel',
      images: [],
      status: STATUSES.INITIATED,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      _id: 'sdf089sdfsdf90w34',
    },
    onGoBackToTable: jest.fn(),
    isEditing: false,
    onToggleIsEditing: jest.fn(),
    onUpdateCaseAnalyses: jest.fn(),
  };

  function subject(overrideProps) {
    return render(<CreateCaseAnalysisForm {...defaultProps} {...overrideProps} />);
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the form', () => {
    subject();
    expect(screen.getByTestId('createCaseAnalysisForm')).toBeInTheDocument();
  });

  it('displays the data in read mode when isEditing is false', () => {
    subject();
    expect(screen.getByTestId('readModeContainer')).toBeInTheDocument();
  });

  it('displays the data in edit mode when isEditing is true', () => {
    subject({ isEditing: true });
    expect(screen.getByTestId('editModeContainer')).toBeInTheDocument();
  });

  it('switches to edit mode when the edit button is clicked', () => {
    const onToggleIsEditing = jest.fn();
    subject({ onToggleIsEditing });
    fireEvent.click(screen.getByTestId('editButton'));
    expect(onToggleIsEditing).toHaveBeenCalled();
  });

  it('saves the case analysis when the button is clicked', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({ mock: 'data' }) });
    subject({ isEditing: true });
    fireEvent.click(screen.getByTestId('saveSubmitButton'));
    await waitForComponentToPaint();
    expect(global.fetch).toHaveBeenCalled();
  });

  it('updates the parent state with received new data from saving', async () => {
    global.fetch = jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({ data: { mock: 'data' } }) });
    const onUpdateCaseAnalyses = jest.fn();
    subject({ isEditing: true, onUpdateCaseAnalyses });
    fireEvent.click(screen.getByTestId('saveSubmitButton'));
    await waitForComponentToPaint();
    expect(onUpdateCaseAnalyses).toHaveBeenCalledWith(defaultProps.selectedCaseAnalysis._id, { mock: 'data' });
  });
});
