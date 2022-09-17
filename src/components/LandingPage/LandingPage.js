import React, { useEffect, useState } from 'react';
import CaseAnalysisDetailsView from '../CreateCaseAnalysisForm/CreateCaseAnalysisForm';
import { getCasesAnalyses } from '../../api/api';
import CaseAnalysesTable from '../CaseAnalysesTable/CaseAnalaysesTable';

export default function LandingPage() {
  const [caseAnalyses, setCaseAnalyses] = useState({});
  const [selectedCaseAnalysis, setSelectedCaseAnalysis] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    getCasesAnalyses().then((res) => {
      const caseAnalysisHashtable = res.data.reduce((acc, curr) => {
        acc[curr._id] = curr;
        return acc;
      }, {});
      setCaseAnalyses(caseAnalysisHashtable);
    });
  }, []);

  const updateCaseAnalyses = (id, data) => {
    const clonedCaseAnalyses = { ...caseAnalyses };
    clonedCaseAnalyses[id] = data;
    setCaseAnalyses(clonedCaseAnalyses);
  };

  return (
    <div data-testid="landingPage">
      {selectedCaseAnalysis && (
      <CaseAnalysisDetailsView
        onUpdateCaseAnalyses={updateCaseAnalyses}
        selectedCaseAnalysis={caseAnalyses[selectedCaseAnalysis]}
        onGoBackToTable={() => setSelectedCaseAnalysis(null)}
        isEditing={isEditing}
        onToggleIsEditing={() => setIsEditing(!isEditing)}
      />
      )}
      {!selectedCaseAnalysis && (
      <CaseAnalysesTable
        onUpdateCaseAnalyses={updateCaseAnalyses}
        caseAnalyses={caseAnalyses}
        onSetSelectedCaseAnalysis={setSelectedCaseAnalysis}
        onSetIsEditingToTrue={() => setIsEditing(true)}
      />
      )}
    </div>
  );
}
