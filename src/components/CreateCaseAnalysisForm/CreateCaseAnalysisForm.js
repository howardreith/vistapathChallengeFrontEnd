import React, { useState, useEffect } from 'react';
import {
  Box, FormControl, Button, TextField,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { createCaseAnalysis } from '../../api/api';

export default function CreateCaseAnalysisForm() {
  const [caseName, setCaseName] = useState('');
  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState([]);

  // Do not wrap this in a useCallback - it must have access to current state
  const onDrop = (acceptedFiles) => {
    const currentFiles = [...files];
    const newFiles = acceptedFiles.map((file) => Object.assign(file, {
      preview: URL.createObjectURL(file),
    }));
    setFiles([...currentFiles, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: 'image/*', onDrop });

  const handleCreateCaseAnalysisFormSubmit = async (e) => {
    e.preventDefault();
    await createCaseAnalysis({ caseName, notes, files });
  };

  useEffect(() => {
    // Revoking Uris to prevent memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <form id="createCaseAnalysisForm" onSubmit={handleCreateCaseAnalysisFormSubmit}>
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
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
              isDragActive
                ? <p>Drop the files here ...</p>
                : <p>Drag n drop some files here, or click to select files</p>
            }
          </div>
        </Box>
        <Box sx={{ display: 'inline' }}>
          {files.map((file, i) => (
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
          ))}
        </Box>
        <Box margin={1}>
          <Button id="updatePasswordSubmitButton" type="submit" variant="contained">Crate Case Analysis</Button>
        </Box>
      </FormControl>
    </form>
  );
}
