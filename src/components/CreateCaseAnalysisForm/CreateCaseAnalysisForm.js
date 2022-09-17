import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, Button, TextField, Typography, Link,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import * as PropTypes from 'prop-types';
import { transitionCaseStatus, updateCaseAnalysis } from '../../api/api';
import { STATUSES } from '../../utils/constants';

export default function CreateCaseAnalysisForm({
  selectedCaseAnalysis, onGoBackToTable, isEditing, onToggleIsEditing, onUpdateCaseAnalyses,
}) {
  const [caseName, setCaseName] = useState(selectedCaseAnalysis.caseName || '');
  const [notes, setNotes] = useState(selectedCaseAnalysis.notes || '');
  const [files, setFiles] = useState([]);
  const [filesToDelete, setFilesToDelete] = useState([]);

  // Do not wrap this in a useCallback - it must have access to current state
  const onDrop = (acceptedFiles) => {
    const currentFiles = [...files];
    const newFiles = acceptedFiles.map((file) => Object.assign(file, {
      preview: URL.createObjectURL(file),
    }));
    setFiles([...currentFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
    },
    onDrop,
  });

  const handleDeleteUnsavedImage = (index) => {
    const filesClone = [...files];
    filesClone.splice(index, 1);
    setFiles(filesClone);
  };

  const handleDeleteOrUndoDeleteOfSavedImage = (key) => {
    const filesToDeleteClone = [...filesToDelete];
    const indexOfKey = filesToDeleteClone.indexOf(key);
    if (indexOfKey !== -1) {
      filesToDeleteClone.splice(indexOfKey, 1);
    } else {
      filesToDeleteClone.push(key);
    }
    setFilesToDelete(filesToDeleteClone);
  };

  const handleClearEditState = () => {
    setFiles([]);
    setCaseName(selectedCaseAnalysis.caseName || '');
    setNotes(selectedCaseAnalysis.notes || '');
    setFilesToDelete([]);
    onToggleIsEditing();
  };

  const handleSaveCaseAnalysisFormSubmit = async (e) => {
    e.preventDefault();
    const { data } = await updateCaseAnalysis({
      caseName, notes, files, id: selectedCaseAnalysis._id, filesToDelete,
    });
    handleClearEditState();
    onUpdateCaseAnalyses(selectedCaseAnalysis._id, data);
    onToggleIsEditing();
  };

  const handleBackToTable = () => {
    if (isEditing) {
      onToggleIsEditing();
    }
    onGoBackToTable();
  };

  useEffect(() => {
    // Revoking Uris to prevent memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const handleStatusTransition = async (newStatus) => {
    const response = await transitionCaseStatus({ id: selectedCaseAnalysis._id, newStatus });
    onUpdateCaseAnalyses(selectedCaseAnalysis._id, response.data);
  };

  const renderApprovalButtons = () => {
    const { status } = selectedCaseAnalysis;
    if (status === STATUSES.INITIATED) {
      return <Box><Button onClick={() => handleStatusTransition(STATUSES.SUBMITTED)}>Submit</Button></Box>;
    }
    if (status === STATUSES.REJECTED) {
      return <Box><Button onClick={() => handleStatusTransition(STATUSES.RESUBMITTED)}>Resubmit</Button></Box>;
    }
    if ([STATUSES.SUBMITTED, STATUSES.RESUBMITTED].includes(status)) {
      return (
        <Box>
          <Button onClick={() => handleStatusTransition(STATUSES.APPROVED)}>Approve</Button>
          <Button onClick={() => handleStatusTransition(STATUSES.REJECTED)}>Reject</Button>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box align="center">
      <Box>
        <Button onClick={handleBackToTable}>Back to Table</Button>
      </Box>
      {!isEditing && selectedCaseAnalysis.status !== STATUSES.APPROVED
        && (
        <Box>
          <Button onClick={onToggleIsEditing}>Edit</Button>
        </Box>
        )}
      {!isEditing && (
      <Box>
        <Box>
          <Typography variant="h2">{selectedCaseAnalysis.caseName}</Typography>
        </Box>
        <Box>
          <Typography variant="h3">{`Current Status: ${selectedCaseAnalysis.status}`}</Typography>
        </Box>
        <Box>
          <Typography>{notes}</Typography>
        </Box>
        <Box>
          <Typography>{`Last Modified: ${selectedCaseAnalysis.updatedAt}`}</Typography>
        </Box>
        <Box>
          <Typography>{`Created: ${selectedCaseAnalysis.createdAt}`}</Typography>
        </Box>
        <Box>
          {selectedCaseAnalysis.images.map((image) => (
            <Link href={image.location} target="_blank">
              <Box
                key={image.key}
                component="img"
                margin={1}
                sx={{
                  height: 233,
                  width: 350,
                  maxHeight: { xs: 233, md: 167 },
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt={`Uploaded image with key ${image.key}`}
                src={image.location}
              />
            </Link>
          ))}
        </Box>
        {renderApprovalButtons()}
      </Box>
      )}
      {isEditing && (
      <Box>
        <form id="createCaseAnalysisForm" onSubmit={handleSaveCaseAnalysisFormSubmit}>
          <FormControl>
            <TextField
              id="caseNameInput"
              type="text"
              name="caseNameInput"
              label="Case Name"
              value={caseName}
              onChange={(e) => setCaseName(e.target.value)}
            />
            <TextField
              id="caseNotesTextBox"
              multiline
              name="caseNotesTExtBox"
              label="Notes"
              value={notes}
              rows={3}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Box>
              <Box {...getRootProps()} margin={5} sx={{ border: 1, width: 300, height: 300 }}>
                <input {...getInputProps()} />
                {
              isDragActive
                ? <p>Drop your images here.</p>
                : <p>Drag your images here or click to browse for images</p>
            }
              </Box>
            </Box>
            <Box sx={{ display: 'inline' }}>
              {files.map((file, i) => (
                <Box>
                  <Box
                    key={file.name}
                    component="img"
                    margin={1}
                    sx={{
                      height: 233,
                      width: 350,
                      maxHeight: { xs: 233, md: 167 },
                      maxWidth: { xs: 350, md: 250 },
                    }}
                    alt={`Item you uploaded #${i + 1}`}
                    src={file.preview}
                  />
                  <Button onClick={() => handleDeleteUnsavedImage(i)}>Delete</Button>
                </Box>
              ))}
            </Box>
            <Box>
              <Typography>Previously uploaded images</Typography>
              <Box>
                {selectedCaseAnalysis.images.map((image) => (
                  <Box>
                    <Link href={image.location} target="_blank">
                      <Box
                        key={image.key}
                        component="img"
                        margin={1}
                        sx={{
                          height: 233,
                          width: 350,
                          maxHeight: { xs: 233, md: 167 },
                          maxWidth: { xs: 350, md: 250 },
                        }}
                        alt={`Uploaded image with key ${image.key}`}
                        src={image.location}
                      />
                    </Link>
                    <Box>
                      {filesToDelete.includes(image.key)
                        ? <Box><Typography>This image will delete when updates saved</Typography></Box>
                        : null}
                      <Button onClick={() => handleDeleteOrUndoDeleteOfSavedImage(image.key)}>
                        {filesToDelete.includes(image.key) ? 'Undo' : 'Delete'}
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box margin={1}>
              <Button id="updatePasswordSubmitButton" type="submit" variant="contained">Save Case Analysis</Button>
            </Box>
            <Box margin={1}>
              <Button onClick={handleClearEditState}>Cancel Editing</Button>
            </Box>
          </FormControl>
        </form>
      </Box>
      )}
    </Box>
  );
}

CreateCaseAnalysisForm.propTypes = {
  selectedCaseAnalysis: PropTypes.shape({
    caseName: PropTypes.string,
    notes: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.shape({})),
    status: PropTypes.string,
    updatedAt: PropTypes.string,
    createdAt: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  onGoBackToTable: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onToggleIsEditing: PropTypes.func.isRequired,
  onUpdateCaseAnalyses: PropTypes.func.isRequired,
};
