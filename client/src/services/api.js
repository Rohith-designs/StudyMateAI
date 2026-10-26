// StudyMateAI Client API Client
const BASE_URL = '/api';

export async function fetchSystemStatus() {
  const res = await fetch(`${BASE_URL}/status`);
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}

export async function fetchSubjects() {
  const res = await fetch(`${BASE_URL}/subjects`);
  if (!res.ok) throw new Error('Failed to fetch subjects');
  return res.json();
}

export async function fetchMaterials(params = {}) {
  const query = new URLSearchParams();
  if (params.subjectCode && params.subjectCode !== 'ALL') query.append('subjectCode', params.subjectCode);
  if (params.unitNumber && params.unitNumber !== 'ALL') query.append('unitNumber', params.unitNumber);
  if (params.category && params.category !== 'ALL') query.append('category', params.category);
  if (params.search && params.search.trim()) query.append('search', params.search.trim());

  const res = await fetch(`${BASE_URL}/materials?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch materials');
  return res.json();
}

export async function fetchMaterialById(id) {
  const res = await fetch(`${BASE_URL}/materials/${id}`);
  if (!res.ok) throw new Error('Failed to fetch material details');
  return res.json();
}

export async function uploadMaterial(formData, onProgress) {
  // Use XMLHttpRequest to track actual upload progress
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE_URL}/materials/upload`);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };
    }

    xhr.onload = () => {
      try {
        const response = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || `Upload failed with status ${xhr.status}`));
        }
      } catch (err) {
        reject(new Error('Invalid server response during upload: ' + err.message));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error occurred while uploading document.'));
    };

    xhr.send(formData);
  });
}

export async function deleteMaterial(id) {
  const res = await fetch(`${BASE_URL}/materials/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete material');
  return res.json();
}

export async function askRAG(payload) {
  const res = await fetch(`${BASE_URL}/rag/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Failed to get answer from study assistant');
  }
  return res.json();
}

export async function fetchRAGStatus() {
  const res = await fetch(`${BASE_URL}/rag/status`);
  if (!res.ok) throw new Error('Failed to fetch RAG status');
  return res.json();
}

export async function fetchQuizzes(params = {}) {
  const query = new URLSearchParams();
  if (params.subjectCode && params.subjectCode !== 'ALL') query.append('subjectCode', params.subjectCode);
  if (params.unitNumber && params.unitNumber !== 'ALL') query.append('unitNumber', params.unitNumber);

  const res = await fetch(`${BASE_URL}/quizzes?${query.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch quizzes');
  return res.json();
}

export async function fetchQuizById(id) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch quiz');
  return res.json();
}

export async function submitQuizAnswers(id, userAnswers) {
  const res = await fetch(`${BASE_URL}/quizzes/${id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userAnswers })
  });
  if (!res.ok) throw new Error('Failed to submit quiz');
  return res.json();
}
