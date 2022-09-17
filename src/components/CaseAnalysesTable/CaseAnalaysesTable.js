import React, { useState } from 'react';
import {
  Box, Button, MenuItem, Select, Table, TableBody, TableCell, TableHead, TableRow,
} from '@mui/material';
import * as PropTypes from 'prop-types';
import { STATUSES } from '../../utils/constants';

export default function CaseAnalysesTable({ caseAnalyses, onSetSelectedCaseAnalysis }) {
  const [filter, setFilter] = useState('');

  const handleChange = ({ target: { value } }) => {
    setFilter(value);
  };

  const handleDetailsClick = (target) => {
    const { id } = target;
    const caseAnalysisId = id.replace('editButton', '');
    onSetSelectedCaseAnalysis(caseAnalysisId);
  };

  const caseAnalysesArray = [...Object.values(caseAnalyses)];
  const caseAnalysesToDisplay = caseAnalysesArray.filter((ca) => ca.status.toUpperCase().includes(filter));

  return (
    <Box>
      <Box margin={1}>
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
};
