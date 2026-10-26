import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Creates a valid basic PDF binary with readable text stream
 */
function createMinimalPdf(title, subject, unit, contentLines) {
  const contentStream = [
    'BT',
    '/F1 18 Tf',
    '50 750 Td',
    `(${title}) Tj`,
    '/F1 12 Tf',
    '0 -30 Td',
    `(${subject} - ${unit} | PVPSIT Examination Preparation) Tj`,
    '0 -25 Td',
    '(/F1 10 Tf)',
    ...contentLines.flatMap(line => [
      '0 -18 Td',
      `(${line.replace(/[()\\]/g, '')}) Tj`
    ]),
    'ET'
  ].join('\n');

  const streamLength = Buffer.byteLength(contentStream, 'ascii');

  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${contentStream}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000300 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
400
%%EOF`;

  return Buffer.from(pdf, 'ascii');
}

export function generateAllSamplePdfs() {
  const samples = [
    {
      filename: 'PVPSIT_DSA_Unit2_Trees_and_AVL.pdf',
      title: 'DSA Unit 2: Balanced Search Trees & AVL Rotations',
      subject: '20CS3301 - Data Structures & Algorithms',
      unit: 'Unit 2',
      lines: [
        'Prasad V. Potluri Siddhartha Institute of Technology - Department of CSE',
        'Academic Year: 2024-25 | Regulation: PVP20',
        '----------------------------------------------------------------------',
        '1. Definition: An AVL tree is a self-balancing binary search tree.',
        '2. Balance Factor = Height(Left Subtree) - Height(Right Subtree).',
        '3. Allowable balance factor for each node is strictly in {-1, 0, +1}.',
        '4. Rotation Cases:',
        '   - LL Rotation: Single Right rotation on unbalanced root node.',
        '   - RR Rotation: Single Left rotation on unbalanced root node.',
        '   - LR Rotation: Left rotation on left child, then Right on root.',
        '   - RL Rotation: Right rotation on right child, then Left on root.',
        '5. Height Complexity: O(log n) ensures O(log n) search, insert, delete.'
      ]
    },
    {
      filename: 'PVPSIT_DBMS_Unit3_Normalization.pdf',
      title: 'DBMS Unit 3: Normalization & Functional Dependencies',
      subject: '20CS3402 - Database Management Systems',
      unit: 'Unit 3',
      lines: [
        'Prasad V. Potluri Siddhartha Institute of Technology - Department of CSE',
        'Academic Year: 2024-25 | Regulation: PVP20',
        '----------------------------------------------------------------------',
        '1. Functional Dependencies: X -> Y specifies X uniquely determines Y.',
        '2. First Normal Form (1NF): Values in all columns must be atomic.',
        '3. Second Normal Form (2NF): In 1NF and no partial dependencies.',
        '4. Third Normal Form (3NF): In 2NF and no transitive dependencies.',
        '5. Boyce-Codd Normal Form (BCNF): For every X -> Y, X is a superkey.',
        '6. ACID Properties: Atomicity, Consistency, Isolation, Durability.'
      ]
    },
    {
      filename: 'PVPSIT_COA_Unit1_Instruction_Formats.pdf',
      title: 'COA Unit 1: Instruction Formats & Addressing Modes',
      subject: '20CS3303 - Computer Organization & Architecture',
      unit: 'Unit 1',
      lines: [
        'Prasad V. Potluri Siddhartha Institute of Technology - Department of CSE',
        'Academic Year: 2024-25 | Regulation: PVP20',
        '----------------------------------------------------------------------',
        '1. Addressing Modes: Specify the rule for interpreting operand address.',
        '2. Immediate Addressing: Operand is part of instruction, 0 memory reads.',
        '3. Direct Addressing: Instruction holds exact effective address.',
        '4. Relative Addressing: Effective Address = Program Counter (PC) + offset.',
        '5. Instruction Formats: Zero, One, Two, and Three-Address instructions.',
        '6. Instruction Cycle: Fetch, Decode, Read Effective Address, Execute.'
      ]
    },
    {
      filename: 'PVPSIT_OS_Unit4_Virtual_Memory_Paging.pdf',
      title: 'OS Unit 4: Virtual Memory, Demand Paging & Thrashing',
      subject: '20CS3404 - Operating Systems',
      unit: 'Unit 4',
      lines: [
        'Prasad V. Potluri Siddhartha Institute of Technology - Department of CSE',
        'Academic Year: 2024-25 | Regulation: PVP20',
        '----------------------------------------------------------------------',
        '1. Virtual Memory: Enables execution of partially loaded processes.',
        '2. Demand Paging: Pages loaded only upon reference. Page Fault trap.',
        '3. FIFO Page Replacement: Replaces oldest page. Suffers from Beladys Anomaly.',
        '4. LRU Page Replacement: Replaces least recently used page. Stack algorithm.',
        '5. Optimal Replacement (OPT): Theoretical lower bound benchmark.',
        '6. Thrashing: Processes spend more time paging than executing instructions.'
      ]
    },
    {
      filename: 'PVPSIT_DSA_Semester_End_Exam_2023_24.pdf',
      title: 'DSA Previous Semester Question Paper (PVP20)',
      subject: '20CS3301 - Data Structures & Algorithms',
      unit: 'Unit 1',
      lines: [
        'Prasad V. Potluri Siddhartha Institute of Technology - Autonomous',
        'II B.Tech I Semester Regular Examinations - Model Question Paper',
        '----------------------------------------------------------------------',
        'Part A (Compulsory):',
        'Q1. What is an AVL tree balance factor? (2 Marks)',
        'Q2. Differentiate B-Tree and B+ Tree. (2 Marks)',
        'Part B (Essay Questions):',
        'Q3. Explain all four AVL tree rotation cases with diagrams. (14 Marks)',
        'Q4. Trace Dijkstra algorithm for shortest paths with example. (14 Marks)'
      ]
    },
    {
      filename: 'PVPSIT_DBMS_PVP20_Syllabus_Handout.pdf',
      title: 'DBMS Course Handout & Unit-wise Blueprint',
      subject: '20CS3402 - Database Management Systems',
      unit: 'Unit 1',
      lines: [
        'Prasad V. Potluri Siddhartha Institute of Technology - Syllabus Blueprint',
        'Course: Database Management Systems (20CS3402)',
        '----------------------------------------------------------------------',
        'Unit 1: ER Model and Relational Schemas (Weightage: 14 Marks)',
        'Unit 2: Relational Algebra & SQL Queries (Weightage: 14 Marks)',
        'Unit 3: Functional Dependencies and Normalization (Weightage: 14 Marks)',
        'Unit 4: Transaction Management & Concurrency Control (Weightage: 14 Marks)',
        'Unit 5: Storage and Indexing Structures (Weightage: 14 Marks)'
      ]
    }
  ];

  for (const s of samples) {
    const dest = path.join(UPLOADS_DIR, s.filename);
    const pdfBuf = createMinimalPdf(s.title, s.subject, s.unit, s.lines);
    fs.writeFileSync(dest, pdfBuf);
  }
  console.log(`[SamplePdfs] Successfully generated ${samples.length} valid sample PDF files in ${UPLOADS_DIR}`);
}

// Auto-run if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateAllSamplePdfs();
}
