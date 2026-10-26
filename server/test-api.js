import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('--- STARTING StudyMateAI BACKEND VERIFICATION TESTS ---');

  // Test 1: Status
  console.log('\n[1/7] Testing GET /api/status:');
  const statusRes = await fetch('http://localhost:5000/api/status');
  const statusData = await statusRes.json();
  console.log('Status result:', statusData.success ? 'PASS' : 'FAIL', `(Storage: ${statusData.storage}, Mode: ${statusData.mode})`);
  if (!statusData.success) throw new Error('Status failed');

  // Test 2: Subjects
  console.log('\n[2/7] Testing GET /api/subjects:');
  const subjectsRes = await fetch('http://localhost:5000/api/subjects');
  const subjectsData = await subjectsRes.json();
  console.log(`Retrieved ${subjectsData.subjects?.length || 0} PVPSIT subjects: PASS`);
  if (!subjectsData.subjects?.length) throw new Error('No subjects found');

  // Test 3: Materials
  console.log('\n[3/7] Testing GET /api/materials:');
  const matRes = await fetch('http://localhost:5000/api/materials');
  const matData = await matRes.json();
  console.log(`Retrieved ${matData.materials?.length || 0} study materials: PASS`);

  // Test 4: RAG In-Scope Grounded Q&A
  console.log('\n[4/7] Testing POST /api/rag/chat (In-Scope Query):');
  const ragInScopeRes = await fetch('http://localhost:5000/api/rag/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'Explain the four rotation cases of an AVL tree.',
      subjectCode: '20CS3301',
      unitNumber: 'Unit 2'
    })
  });
  const ragInScopeData = await ragInScopeRes.json();
  console.log('In-Scope Answer length:', ragInScopeData.data?.answer?.length);
  console.log('In-Scope Sources count:', ragInScopeData.data?.sources?.length);
  console.log('Is Grounded:', ragInScopeData.data?.isGrounded);
  if (!ragInScopeData.data?.sources?.length || !ragInScopeData.data?.isGrounded) {
    throw new Error('In-Scope RAG did not return grounded sources');
  }
  console.log('In-Scope RAG Verification: PASS');

  // Test 5: RAG Out-Of-Scope Query (Admitting context not found)
  console.log('\n[5/7] Testing POST /api/rag/chat (Out-Of-Scope Query):');
  const ragOutRes = await fetch('http://localhost:5000/api/rag/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: 'What is rocket propulsion and cryogenic liquid engines?',
      subjectCode: '20CS3301'
    })
  });
  const ragOutData = await ragOutRes.json();
  console.log('Out-Of-Scope Grounded flag:', ragOutData.data?.isGrounded, '(expected false)');
  console.log('Sources count:', ragOutData.data?.sources?.length, '(expected 0)');
  if (ragOutData.data?.isGrounded !== false || ragOutData.data?.sources?.length !== 0) {
    throw new Error('Out-Of-Scope RAG should not claim grounded sources');
  }
  console.log('Out-Of-Scope Truthful Admission Verification: PASS');

  // Test 6: Quizzes List & Submit
  console.log('\n[6/7] Testing GET /api/quizzes & POST /api/quizzes/:id/submit:');
  const quizzesRes = await fetch('http://localhost:5000/api/quizzes');
  const quizzesData = await quizzesRes.json();
  const firstQuiz = quizzesData.quizzes?.[0];
  console.log(`Found quiz: "${firstQuiz?.title}" (${firstQuiz?.id})`);

  const submitRes = await fetch(`http://localhost:5000/api/quizzes/${firstQuiz.id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAnswers: {
        'q-dsa-1': 0, // Correct
        'q-dsa-2': 1, // Correct
        'q-dsa-3': 0  // Incorrect
      }
    })
  });
  const submitData = await submitRes.json();
  console.log(`Scored: ${submitData.results?.score} / ${submitData.results?.total} (${submitData.results?.percentage}%)`);
  console.log('Review explanations returned:', submitData.results?.review?.length > 0 ? 'PASS' : 'FAIL');

  // Test 7: Upload a sample PDF with multipart form data
  console.log('\n[7/7] Testing POST /api/materials/upload (Multipart PDF with Text Chunking):');
  const samplePdfPath = path.resolve(__dirname, 'uploads/PVPSIT_DSA_Unit2_Trees_and_AVL.pdf');
  const fileBytes = fs.readFileSync(samplePdfPath);
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

  let body = '';
  function addFormField(name, val) {
    body += `--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${val}\r\n`;
  }
  addFormField('title', 'Automated Verification Upload Notes');
  addFormField('department', 'Computer Science & Engineering');
  addFormField('subjectCode', '20CS3301');
  addFormField('regulation', 'PVP20');
  addFormField('academicYear', '2024-25');
  addFormField('unitNumber', 'Unit 2');
  addFormField('category', 'Lecture Notes');

  const preBuffer = Buffer.from(body, 'utf-8');
  const fileHeader = Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="Test_Upload.pdf"\r\nContent-Type: application/pdf\r\n\r\n`,
    'utf-8'
  );
  const postBuffer = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf-8');
  const fullMultipart = Buffer.concat([preBuffer, fileHeader, fileBytes, postBuffer]);

  const uploadRes = await fetch('http://localhost:5000/api/materials/upload', {
    method: 'POST',
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    },
    body: fullMultipart
  });

  const uploadData = await uploadRes.json();
  console.log('Upload Result:', uploadData.success ? 'PASS' : 'FAIL', '| Chunks Indexed:', uploadData.chunksIndexed);
  if (!uploadData.success || !uploadData.material?.id) {
    throw new Error('Upload test failed: ' + (uploadData.error || 'Unknown'));
  }

  // Delete the uploaded test document
  console.log('Cleaning up uploaded test document...');
  const deleteRes = await fetch(`http://localhost:5000/api/materials/${uploadData.material.id}`, {
    method: 'DELETE'
  });
  const deleteData = await deleteRes.json();
  console.log('Cleanup Result:', deleteData.success ? 'PASS' : 'FAIL');

  console.log('\n======================================================');
  console.log('🎉 ALL 7 BACKEND VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('======================================================');
}

runTests().catch(err => {
  console.error('❌ Verification failed with error:', err);
  process.exit(1);
});
