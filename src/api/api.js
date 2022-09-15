const backendUrl = process.env.REACT_APP_BACKEND_URL;

// TODO remove this when a second export is added
// eslint-disable-next-line import/prefer-default-export
export async function createCaseAnalysis(data) {
  const { caseName, notes, files } = data;
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file, file.name);
  });
  formData.append('caseName', caseName);
  formData.append('notes', notes);
  const result = await fetch(`${backendUrl}/caseAnalysis/create`, {
    method: 'post',
    body: formData,
  });
  return result.json();
}
