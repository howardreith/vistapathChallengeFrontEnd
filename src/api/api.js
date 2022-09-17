const backendUrl = process.env.REACT_APP_BACKEND_URL;

export async function updateCaseAnalysis(data) {
  const {
    caseName, notes, files, id, filesToDelete,
  } = data;
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file, file.name);
  });
  formData.append('caseName', caseName);
  formData.append('notes', notes);
  formData.append('id', id);
  formData.append('filesToDelete', filesToDelete);
  const result = await fetch(`${backendUrl}/caseAnalysis/update`, {
    method: 'post',
    body: formData,
  });
  return result.json();
}

export async function getCasesAnalyses() {
  const result = await fetch(`${backendUrl}/caseAnalysis/getAll`, {
    method: 'get',
  });
  return result.json();
}

export async function createNewCaseAnalysis() {
  const result = await fetch(`${backendUrl}/caseAnalysis/create`, {
    method: 'post',
  });
  return result.json();
}
