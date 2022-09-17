import React, { useState } from 'react';
import {
  Box, Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow, Typography,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { STATUSES } from '../../utils/constants';
import { createNewCaseAnalysis } from '../../api/api';

export default function CaseAnalysesTable({
  caseAnalyses, onSetSelectedCaseAnalysis, onUpdateCaseAnalyses, onSetIsEditingToTrue,
}) {
  const [filter, setFilter] = useState('');

  const handleChange = ({ target: { value } }) => {
    setFilter(value);
  };

  const handleCreateNewCaseAnalysisClick = async () => {
    const { data } = await createNewCaseAnalysis();
    onUpdateCaseAnalyses(data._id, data);
    onSetSelectedCaseAnalysis(data._id);
    onSetIsEditingToTrue();
  };

  const handleDetailsClick = (target) => {
    const { id } = target;
    const caseAnalysisId = id.replace('editButton', '');
    onSetSelectedCaseAnalysis(caseAnalysisId);
  };

  const caseAnalysesArray = [...Object.values(caseAnalyses)];
  const caseAnalysesToDisplay = caseAnalysesArray.filter((ca) => ca.status.toUpperCase().includes(filter));

  return (
    <Box align="center">
      <Box margin={1}>
        <Button onClick={handleCreateNewCaseAnalysisClick}>Create New Case Analysis</Button>
      </Box>
      <Box margin={1}>
        <Typography>Filter by Status</Typography>
        <Select
          labelId="filterByStatus"
          value={filter}
          label="Filter by Status"
          onChange={handleChange}
          sx={{ width: 160 }}
        >
          <MenuItem value="">(None)</MenuItem>
          {Object.keys(STATUSES).map((status) => <MenuItem key={status} value={status}>{status}</MenuItem>)}
        </Select>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Case Name</TableCell>
            <TableCell>Created</TableCell>
            <TableCell>Modified</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Details / Edit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {caseAnalysesToDisplay.map((ca) => (
            <TableRow key={ca._id}>
              <TableCell>{ca.caseName}</TableCell>
              <TableCell>{ca.createdAt}</TableCell>
              <TableCell>{ca.updatedAt}</TableCell>
              <TableCell>{ca.status}</TableCell>
              <TableCell>
                <Button id={`editButton${ca._id}`} onClick={(e) => handleDetailsClick(e.target)}>Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}

CaseAnalysesTable.propTypes = {
  caseAnalyses: PropTypes.shape({}).isRequired,
  onSetSelectedCaseAnalysis: PropTypes.func.isRequired,
  onUpdateCaseAnalyses: PropTypes.func.isRequired,
  onSetIsEditingToTrue: PropTypes.func.isRequired,
};
