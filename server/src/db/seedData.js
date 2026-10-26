// PVPSIT Engineering Curriculum Seed Data
export const SEED_SUBJECTS = [
  {
    id: "sub-dsa",
    code: "20CS3301",
    name: "Data Structures & Algorithms",
    shortName: "DSA",
    department: "Computer Science & Engineering",
    regulation: "PVP20",
    semester: "II B.Tech I Sem",
    credits: 3,
    color: "blue",
    description: "Core algorithms, data abstractions, asymptotic analysis, linear and non-linear data structures, trees, graphs, sorting, and hashing techniques.",
    units: [
      { unit: "Unit 1", title: "Linear Data Structures: Stacks and Queues, Applications, Infix to Postfix conversion, Circular Queues, Deque" },
      { unit: "Unit 2", title: "Non-Linear Structures: Trees, Binary Search Trees, AVL Trees, B-Trees, Traversals and Height Balancing" },
      { unit: "Unit 3", title: "Graph Theory: Graph Representations, BFS, DFS, Minimum Spanning Trees (Prim's & Kruskal's), Shortest Paths (Dijkstra)" },
      { unit: "Unit 4", title: "Sorting & Searching: QuickSort, MergeSort, HeapSort, Linear Search, Binary Search, Time Complexity Analysis" },
      { unit: "Unit 5", title: "Hashing & Collision Resolution: Hash Functions, Separate Chaining, Open Addressing (Linear, Quadratic Probing, Double Hashing)" }
    ]
  },
  {
    id: "sub-dbms",
    code: "20CS3402",
    name: "Database Management Systems",
    shortName: "DBMS",
    department: "Computer Science & Engineering",
    regulation: "PVP20",
    semester: "II B.Tech II Sem",
    credits: 3,
    color: "indigo",
    description: "Relational database concepts, ER modeling, SQL querying, functional dependencies, normalization, ACID properties, transaction concurrency, and crash recovery.",
    units: [
      { unit: "Unit 1", title: "Introduction & Conceptual Modeling: Database Architecture, Data Models, Schemas, ER Diagrams, Weak Entities, Cardinality" },
      { unit: "Unit 2", title: "Relational Model & Relational Algebra: Relational Constraints, Relational Algebra Operations, Extended SQL, Views, Triggers" },
      { unit: "Unit 3", title: "Normalization & Functional Dependencies: 1NF, 2NF, 3NF, BCNF, Multi-valued Dependencies (4NF), Lossless Decomposition" },
      { unit: "Unit 4", title: "Transaction Processing & Concurrency: ACID Properties, Serializability, Two-Phase Locking (2PL), Deadlock Handling, Timestamp Ordering" },
      { unit: "Unit 5", title: "Storage & Indexing: File Organization, B+ Tree Indexing, Static & Dynamic Hashing, Query Evaluation & Optimization" }
    ]
  },
  {
    id: "sub-coa",
    code: "20CS3303",
    name: "Computer Organization & Architecture",
    shortName: "COA",
    department: "Computer Science & Engineering",
    regulation: "PVP20",
    semester: "II B.Tech I Sem",
    credits: 3,
    color: "emerald",
    description: "Instruction set design, register transfer language, computer arithmetic, microprogrammed control unit, memory hierarchy, cache coherence, and I/O interfacing.",
    units: [
      { unit: "Unit 1", title: "Instruction Set Architecture: Basic Functional Blocks, Von Neumann vs Harvard Architecture, Addressing Modes, Instruction Formats" },
      { unit: "Unit 2", title: "Computer Arithmetic: Fixed Point, Floating Point Representation (IEEE 754), Booth's Multiplication Algorithm, Restoring and Non-restoring Division" },
      { unit: "Unit 3", title: "CPU Control Design: Hardwired Control Unit vs Microprogrammed Control Unit, Control Word, Microinstruction Sequencing, Execution of Complete Instruction" },
      { unit: "Unit 4", title: "Memory Hierarchy: Cache Memory Principles, Mapping Functions (Direct, Associative, Set-Associative), Replacement Algorithms, Cache Coherence" },
      { unit: "Unit 5", title: "Input/Output Organization: Programmed I/O, Interrupt-Driven I/O, Direct Memory Access (DMA), Bus Arbitration, Peripheral Interfaces" }
    ]
  },
  {
    id: "sub-os",
    code: "20CS3404",
    name: "Operating Systems",
    shortName: "OS",
    department: "Computer Science & Engineering",
    regulation: "PVP20",
    semester: "II B.Tech II Sem",
    credits: 3,
    color: "purple",
    description: "Operating system principles, process scheduling, synchronization, classic IPC problems, deadlock prevention, virtual memory, paging, and disk management.",
    units: [
      { unit: "Unit 1", title: "OS Structures & Process Management: System Calls, Process States, Process Control Block (PCB), Context Switching, Inter-Process Communication" },
      { unit: "Unit 2", title: "CPU Scheduling & Synchronization: FCFS, SJF, Round Robin, Priority Scheduling, Critical Section Problem, Semaphores, Peterson's Algorithm, Monitors" },
      { unit: "Unit 3", title: "Deadlocks: Deadlock Characterization, Resource Allocation Graphs, Prevention, Avoidance (Banker's Algorithm), Detection and Recovery" },
      { unit: "Unit 4", title: "Memory Management & Virtual Memory: Contiguous Allocation, Paging, Segmentation, Page Faults, Page Replacement Algorithms (FIFO, LRU, Optimal), Thrashing" },
      { unit: "Unit 5", title: "Storage & File Systems: File Allocation Methods (Contiguous, Linked, Indexed), Free Space Management, Disk Scheduling (FCFS, SSTF, SCAN, C-SCAN)" }
    ]
  }
];

export const SEED_DOCUMENTS = [
  {
    id: "doc-dsa-unit2",
    title: "DSA Unit 2: Balanced Search Trees & AVL Rotations",
    department: "Computer Science & Engineering",
    subjectCode: "20CS3301",
    subjectName: "Data Structures & Algorithms",
    regulation: "PVP20",
    academicYear: "2024-25",
    unitNumber: "Unit 2",
    category: "Lecture Notes",
    filename: "PVPSIT_DSA_Unit2_Trees_and_AVL.pdf",
    filePath: "uploads/PVPSIT_DSA_Unit2_Trees_and_AVL.pdf",
    fileSize: 482100,
    pageCount: 14,
    uploadedBy: "Prof. K. Satyanarayana (Dept of CSE, PVPSIT)",
    createdAt: "2025-01-10T10:30:00.000Z",
    summary: "Complete lecture notes covering Binary Search Tree operations, balance factor definition, and all four AVL tree rotation cases (LL, RR, LR, RL) with step-by-step rebalancing diagrams."
  },
  {
    id: "doc-dbms-unit3",
    title: "DBMS Unit 3: Functional Dependencies & Normal Forms (1NF to BCNF)",
    department: "Computer Science & Engineering",
    subjectCode: "20CS3402",
    subjectName: "Database Management Systems",
    regulation: "PVP20",
    academicYear: "2024-25",
    unitNumber: "Unit 3",
    category: "Lecture Notes",
    filename: "PVPSIT_DBMS_Unit3_Normalization.pdf",
    filePath: "uploads/PVPSIT_DBMS_Unit3_Normalization.pdf",
    fileSize: 624500,
    pageCount: 18,
    uploadedBy: "Dr. B. V. Subba Rao (Head of Dept, PVPSIT)",
    createdAt: "2025-01-15T14:15:00.000Z",
    summary: "Detailed reference notes on Armstrong's axioms, canonical cover, closure of attribute sets, testing for 2NF, 3NF, BCNF, and dependency preserving lossless-join decompositions."
  },
  {
    id: "doc-coa-unit1",
    title: "COA Unit 1: Instruction Formats & Addressing Modes",
    department: "Computer Science & Engineering",
    subjectCode: "20CS3303",
    subjectName: "Computer Organization & Architecture",
    regulation: "PVP20",
    academicYear: "2024-25",
    unitNumber: "Unit 1",
    category: "Lecture Notes",
    filename: "PVPSIT_COA_Unit1_Instruction_Formats.pdf",
    filePath: "uploads/PVPSIT_COA_Unit1_Instruction_Formats.pdf",
    fileSize: 395000,
    pageCount: 12,
    uploadedBy: "Assoc. Prof. V. Siva Parvathi (PVPSIT)",
    createdAt: "2025-01-20T09:45:00.000Z",
    summary: "Covers computer components, bus interconnects, register transfer language, instruction cycle (Fetch, Decode, Execute), zero, one, two, and three-address instruction formats, and 8 primary addressing modes."
  },
  {
    id: "doc-os-unit4",
    title: "OS Unit 4: Virtual Memory, Demand Paging & Page Replacement",
    department: "Computer Science & Engineering",
    subjectCode: "20CS3404",
    subjectName: "Operating Systems",
    regulation: "PVP20",
    academicYear: "2024-25",
    unitNumber: "Unit 4",
    category: "Lecture Notes",
    filename: "PVPSIT_OS_Unit4_Virtual_Memory_Paging.pdf",
    filePath: "uploads/PVPSIT_OS_Unit4_Virtual_Memory_Paging.pdf",
    fileSize: 552000,
    pageCount: 16,
    uploadedBy: "Prof. S. Madhavi (Dept of CSE, PVPSIT)",
    createdAt: "2025-02-01T11:20:00.000Z",
    summary: "Covers virtual memory fundamentals, page fault handling service routine, effective memory access time calculation, Belady's anomaly, FIFO, LRU, Optimal page replacement algorithms, and thrashing causes."
  },
  {
    id: "doc-dsa-qp-2024",
    title: "DSA Previous Semester Question Paper (PVP20 End Exam)",
    department: "Computer Science & Engineering",
    subjectCode: "20CS3301",
    subjectName: "Data Structures & Algorithms",
    regulation: "PVP20",
    academicYear: "2023-24",
    unitNumber: "Unit 1",
    category: "Previous Question Papers",
    filename: "PVPSIT_DSA_Semester_End_Exam_2023_24.pdf",
    filePath: "uploads/PVPSIT_DSA_Semester_End_Exam_2023_24.pdf",
    fileSize: 215000,
    pageCount: 4,
    uploadedBy: "Examination Cell (PVPSIT)",
    createdAt: "2025-02-05T16:00:00.000Z",
    summary: "Official end-semester examination question paper featuring short 2-mark questions and 14-mark essay questions across Units 1 to 5 for academic revision."
  },
  {
    id: "doc-dbms-syllabus",
    title: "DBMS Course Handout & Unit-wise Syllabus Blueprint",
    department: "Computer Science & Engineering",
    subjectCode: "20CS3402",
    subjectName: "Database Management Systems",
    regulation: "PVP20",
    academicYear: "2024-25",
    unitNumber: "Unit 1",
    category: "Syllabus",
    filename: "PVPSIT_DBMS_PVP20_Syllabus_Handout.pdf",
    filePath: "uploads/PVPSIT_DBMS_PVP20_Syllabus_Handout.pdf",
    fileSize: 180000,
    pageCount: 6,
    uploadedBy: "Academic Section (PVPSIT)",
    createdAt: "2025-02-08T08:30:00.000Z",
    summary: "Official course outcome mapping (CO1-CO5), textbook recommendations (Elmasri & Navathe, Korth), and unit-wise weightage distribution for internal and external examinations."
  }
];

export const SEED_CHUNKS = [
  // DSA Chunks
  {
    id: "chunk-dsa-1",
    documentId: "doc-dsa-unit2",
    subjectCode: "20CS3301",
    unitNumber: "Unit 2",
    chunkIndex: 0,
    pageNumber: 3,
    content: "AVL Tree Definition and Balance Factor:\nAn AVL tree is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees cannot be more than one for all nodes. The balance factor of a node is defined as: Balance Factor = Height(Left Subtree) - Height(Right Subtree). In an AVL tree, the balance factor of every node must be either -1, 0, or +1. If at any point after insertion or deletion the balance factor becomes less than -1 or greater than +1, the tree becomes unbalanced and requires rotations to restore its height balance. The height of an AVL tree with n nodes is strictly bounded by O(log n), ensuring that search, insertion, and deletion operations all take O(log n) worst-case time."
  },
  {
    id: "chunk-dsa-2",
    documentId: "doc-dsa-unit2",
    subjectCode: "20CS3301",
    unitNumber: "Unit 2",
    chunkIndex: 1,
    pageNumber: 5,
    content: "AVL Rotations (LL, RR, LR, RL):\nThere are four distinct rotation cases to rebalance an AVL tree after insertion:\n1. Left-Left (LL) Rotation: Occurs when a new node is inserted into the left subtree of the left child of an unbalanced node (Balance Factor = +2). Resolved by performing a single Right Rotation around the unbalanced node.\n2. Right-Right (RR) Rotation: Occurs when a new node is inserted into the right subtree of the right child (Balance Factor = -2). Resolved by a single Left Rotation around the unbalanced node.\n3. Left-Right (LR) Rotation: Occurs when a node is inserted into the right subtree of the left child (Balance Factor = +2, left child has BF = -1). Resolved via a double rotation: first a Left Rotation on the left child, followed by a Right Rotation on the unbalanced node.\n4. Right-Left (RL) Rotation: Occurs when a node is inserted into the left subtree of the right child (Balance Factor = -2, right child has BF = +1). Resolved via a double rotation: first a Right Rotation on the right child, followed by a Left Rotation on the unbalanced node."
  },
  {
    id: "chunk-dsa-3",
    documentId: "doc-dsa-unit2",
    subjectCode: "20CS3301",
    unitNumber: "Unit 2",
    chunkIndex: 2,
    pageNumber: 8,
    content: "Binary Search Tree (BST) Properties and Deletion:\nIn a Binary Search Tree, for every node X: all keys in the left subtree are strictly less than key(X), and all keys in the right subtree are strictly greater than key(X). Inorder traversal of a BST always yields keys in non-decreasing sorted order.\nDeletion in BST involves three cases:\nCase 1: Node to be deleted is a leaf node (0 children). Simply remove the node and update its parent pointer to NULL.\nCase 2: Node has exactly one child. Replace the node with its only child and link parent directly to that child.\nCase 3: Node has two children. Find the Inorder Successor (smallest node in the right subtree) or Inorder Predecessor (largest node in the left subtree), copy its value to the current node, and recursively delete that successor/predecessor node."
  },

  // DBMS Chunks
  {
    id: "chunk-dbms-1",
    documentId: "doc-dbms-unit3",
    subjectCode: "20CS3402",
    unitNumber: "Unit 3",
    chunkIndex: 0,
    pageNumber: 4,
    content: "Functional Dependencies and Normal Forms (1NF, 2NF, 3NF):\nA functional dependency X -> Y specifies that the value of X uniquely determines the value of Y in relation R.\n- First Normal Form (1NF): A relation is in 1NF if and only if all attribute values are atomic (no repeating groups, multi-valued attributes, or composite fields).\n- Second Normal Form (2NF): A relation is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key. In other words, full functional dependency is required for all non-prime attributes on the entire primary key.\n- Third Normal Form (3NF): A relation is in 3NF if it is in 2NF and there is no transitive dependency of non-prime attributes on candidate keys. Formally, for every non-trivial functional dependency X -> A, either X is a superkey OR A is a prime attribute."
  },
  {
    id: "chunk-dbms-2",
    documentId: "doc-dbms-unit3",
    subjectCode: "20CS3402",
    unitNumber: "Unit 3",
    chunkIndex: 1,
    pageNumber: 7,
    content: "Boyce-Codd Normal Form (BCNF) vs 3NF:\nA relation schema R is in BCNF if for every non-trivial functional dependency X -> A in R, X is a superkey of R. BCNF is strictly stronger than 3NF because it eliminates the relaxation where A could be a prime attribute when X is not a superkey. Every relation in BCNF is guaranteed to be in 3NF, but the converse is not always true.\nDecomposition into BCNF is always lossless-join, but it might not always preserve functional dependencies. 3NF decomposition can always achieve both lossless-join and dependency preservation simultaneously."
  },
  {
    id: "chunk-dbms-3",
    documentId: "doc-dbms-unit3",
    subjectCode: "20CS3402",
    unitNumber: "Unit 3",
    chunkIndex: 2,
    pageNumber: 11,
    content: "ACID Properties of Transactions in DBMS:\nA transaction is a logical unit of database processing that includes one or more database access operations. To maintain data integrity, transactions must satisfy four ACID properties:\n1. Atomicity: The 'all-or-nothing' property. Either all operations of the transaction complete successfully and are committed, or none of them are reflected in the database. Managed by the Transaction Manager and Recovery Manager (Undo logging).\n2. Consistency: Execution of a transaction in isolation preserves database integrity constraints (e.g. sum of account balances remains invariant). Maintained jointly by application programs and DBMS constraint checkers.\n3. Isolation: Even if multiple transactions execute concurrently, the outcome must appear as if each transaction ran sequentially without interference. Implemented by Concurrency Control Manager using locking protocols (2PL) or timestamp ordering.\n4. Durability: Once a transaction commits, its updates persist permanently in storage, even across sudden power failures or system crashes. Implemented by write-ahead logging (WAL) and redo logging."
  },

  // COA Chunks
  {
    id: "chunk-coa-1",
    documentId: "doc-coa-unit1",
    subjectCode: "20CS3303",
    unitNumber: "Unit 1",
    chunkIndex: 0,
    pageNumber: 2,
    content: "Computer Addressing Modes:\nAddressing modes specify the rule for interpreting or modifying the address field of an instruction before the operand is actually executed.\n1. Immediate Addressing: The operand is specified directly inside the instruction itself (e.g., ADD R1, #5). Fastest execution because no memory reference is needed for operand fetch.\n2. Direct Addressing: The instruction contains the exact effective memory address where the operand resides (e.g., LOAD R1, 1000). Requires one memory access.\n3. Indirect Addressing: The instruction points to a memory location that contains the effective address of the operand. Requires two memory access cycles.\n4. Register Addressing: The operand is stored in a CPU register specified by the instruction (e.g., ADD R1, R2). Extremely fast.\n5. Register Indirect Addressing: The instruction specifies a CPU register that holds the effective memory address of the operand.\n6. Indexed Addressing: Effective Address = Base Register + Index Register / Offset. Widely used for array data structures.\n7. Relative Addressing: Effective Address = Program Counter (PC) + Address Field. Heavily used in branch/jump instructions."
  },
  {
    id: "chunk-coa-2",
    documentId: "doc-coa-unit1",
    subjectCode: "20CS3303",
    unitNumber: "Unit 1",
    chunkIndex: 1,
    pageNumber: 6,
    content: "Instruction Formats and Instruction Cycle:\nAn instruction format specifies the layout of opcode and operand address fields within a machine word. Computer architectures categorize instructions by the number of operand addresses:\n- Three-Address Instructions: OP Destination, Source1, Source2 (e.g., ADD R1, R2, R3). Programs have fewer instructions but require longer instruction words.\n- Two-Address Instructions: OP Destination/Source1, Source2 (e.g., MOV R1, R2; ADD R1, R3). Most common in modern RISC/CISC.\n- One-Address Instructions: Accumulator architecture. The accumulator register (AC) is implicitly assumed as one of the operands (e.g., LOAD B, ADD C, STORE X).\n- Zero-Address Instructions: Stack architecture. Operands are implicitly popped from the top of the evaluation stack (e.g., PUSH A, PUSH B, ADD, POP C).\nThe basic instruction cycle consists of: Fetch (read instruction from PC into IR), Decode (interpret opcode), Operand Read (fetch effective address operands), Execute (perform ALU operation), and Store (write back result)."
  },

  // OS Chunks
  {
    id: "chunk-os-1",
    documentId: "doc-os-unit4",
    subjectCode: "20CS3404",
    unitNumber: "Unit 4",
    chunkIndex: 0,
    pageNumber: 3,
    content: "Virtual Memory and Demand Paging:\nVirtual memory is a memory management technique that separates user logical memory from physical physical memory, allowing the execution of processes that may not be completely in physical RAM. Demand paging loads pages into physical memory only when they are referenced during process execution.\nWhen a process accesses a logical address whose page table entry has the valid/invalid bit set to 'invalid', a hardware trap occurs called a Page Fault.\nPage Fault Handling Sequence:\n1. CPU checks internal table (PCB) to verify if the memory reference was valid.\n2. If invalid, terminate process; if valid but page not in memory, OS initiates page fetch from secondary swap disk.\n3. OS finds a free physical frame (or selects a victim frame via page replacement if memory is full).\n4. Disk I/O is scheduled to read the desired page into the allocated frame.\n5. When I/O finishes, internal page table is updated: page marked valid, frame number recorded.\n6. The CPU instruction that triggered the page fault is restarted seamlessly."
  },
  {
    id: "chunk-os-2",
    documentId: "doc-os-unit4",
    subjectCode: "20CS3404",
    unitNumber: "Unit 4",
    chunkIndex: 1,
    pageNumber: 8,
    content: "Page Replacement Algorithms and Belady's Anomaly:\nWhen no physical frame is free during a page fault, a page replacement algorithm chooses which existing frame to evict.\n1. First-In-First-Out (FIFO): Replaces the oldest page in memory. Simple to implement with a FIFO queue. Suffers from Belady's Anomaly: for certain page reference strings, increasing the number of allocated physical page frames paradoxically results in MORE page faults rather than fewer.\n2. Optimal Page Replacement (OPT / MIN): Replaces the page that will not be used for the longest period in the future. Guarantees the lowest possible page fault rate; used as an unattainable theoretical benchmark because future memory access patterns cannot be predicted in advance.\n3. Least Recently Used (LRU): Replaces the page that has not been referenced for the longest period in the past. Approximates OPT by leveraging the principle of temporal locality. Does NOT suffer from Belady's anomaly (stack algorithm). Can be implemented using counters or a doubly-linked stack."
  },
  {
    id: "chunk-os-3",
    documentId: "doc-os-unit4",
    subjectCode: "20CS3404",
    unitNumber: "Unit 4",
    chunkIndex: 2,
    pageNumber: 13,
    content: "Thrashing and Working Set Model in OS:\nThrashing is a state in which a computer spends significantly more time swapping pages into and out of memory than actually executing useful instructions. Thrashing occurs when the sum of the locality working sets across all active processes exceeds the total capacity of physical memory.\nCauses of Thrashing:\nIf the degree of multiprogramming is too high, each process receives fewer page frames than its current locality requires, triggering constant page faults. The CPU scheduler sees low CPU utilization (because processes are waiting on disk I/O) and mistakenly increases multiprogramming, exacerbating the problem.\nSolutions to Thrashing:\n1. Working Set Model (Peter Denning): Monitors the set of pages referenced by a process during the most recent working-set window delta. If total working set demands exceed physical memory, suspend selected processes.\n2. Page Fault Frequency (PFF) Strategy: Establishes upper and lower bounds for acceptable page fault rates. If rate exceeds upper bound, allocate more frames; if below lower bound, reclaim frames."
  }
];

export const SEED_QUIZZES = [
  {
    id: "quiz-dsa-avl",
    subjectCode: "20CS3301",
    subjectName: "Data Structures & Algorithms",
    unitNumber: "Unit 2",
    title: "AVL Trees & Balanced Search Trees Assessment",
    description: "Test your mastery of AVL balance factor calculation, rotation cases, and BST worst-case time complexities.",
    questions: [
      {
        id: "q-dsa-1",
        question: "What is the acceptable balance factor range for every node in an AVL tree?",
        options: [
          "-1, 0, or +1",
          "-2, -1, 0, +1, or +2",
          "0 or +1 only",
          "Strictly 0 (perfect balance)"
        ],
        correctIndex: 0,
        explanation: "By definition, an AVL tree is height-balanced such that the balance factor (Height(Left) - Height(Right)) of every node must be either -1, 0, or +1. If it deviates to +2 or -2, a rotation must be triggered immediately.",
        referenceUnit: "Unit 2 (Balanced Trees)"
      },
      {
        id: "q-dsa-2",
        question: "Which rotation is required when a node is inserted into the right subtree of the left child of an unbalanced node?",
        options: [
          "Single Left (RR) Rotation",
          "Double Left-Right (LR) Rotation",
          "Single Right (LL) Rotation",
          "Double Right-Left (RL) Rotation"
        ],
        correctIndex: 1,
        explanation: "When a node is inserted into the right subtree of the left child, the parent node has Balance Factor = +2 and its left child has Balance Factor = -1. This represents the LR case, resolved by a Left rotation on the left child followed by a Right rotation on the parent.",
        referenceUnit: "Unit 2 (AVL Rotations)"
      },
      {
        id: "q-dsa-3",
        question: "What is the worst-case time complexity of searching an element in an AVL tree containing n nodes?",
        options: [
          "O(n)",
          "O(n log n)",
          "O(log n)",
          "O(1)"
        ],
        correctIndex: 2,
        explanation: "Because an AVL tree guarantees a strictly bounded height of h <= 1.44 log2(n), all basic operations including search, insert, and delete have a guaranteed worst-case time complexity of O(log n).",
        referenceUnit: "Unit 2 (Tree Complexity)"
      },
      {
        id: "q-dsa-4",
        question: "In a standard Binary Search Tree (BST), what traversal sequence produces the keys in ascending sorted order?",
        options: [
          "Preorder Traversal",
          "Postorder Traversal",
          "Inorder Traversal",
          "Level-order Traversal"
        ],
        correctIndex: 2,
        explanation: "Inorder traversal visits (Left Subtree -> Root -> Right Subtree). Due to BST properties where left keys < root < right keys, inorder traversal always prints BST elements in non-decreasing sorted order.",
        referenceUnit: "Unit 2 (BST Traversals)"
      },
      {
        id: "q-dsa-5",
        question: "When deleting a node with two children in a BST, which replacement node preserves the binary search tree property?",
        options: [
          "The root of the tree",
          "The Inorder Successor or Inorder Predecessor",
          "The immediate parent node",
          "The leftmost leaf of the entire tree"
        ],
        correctIndex: 1,
        explanation: "Deleting a node with two children requires replacing its value with either its Inorder Successor (minimum element in the right subtree) or Inorder Predecessor (maximum element in the left subtree), then removing that replacement leaf/single-child node.",
        referenceUnit: "Unit 2 (BST Deletion)"
      }
    ]
  },
  {
    id: "quiz-dbms-normalization",
    subjectCode: "20CS3402",
    subjectName: "Database Management Systems",
    unitNumber: "Unit 3",
    title: "Relational Normalization & Functional Dependencies",
    description: "Verify your understanding of 1NF, 2NF, 3NF, BCNF, and relational database integrity properties.",
    questions: [
      {
        id: "q-dbms-1",
        question: "A relation is in Second Normal Form (2NF) if it is in 1NF and contains no:",
        options: [
          "Transitive dependencies",
          "Partial dependencies on any candidate key",
          "Multi-valued dependencies",
          "Primary keys"
        ],
        correctIndex: 1,
        explanation: "2NF requires that every non-prime attribute is fully functionally dependent on every candidate key, eliminating partial dependencies where an attribute depends on only a proper subset of a composite candidate key.",
        referenceUnit: "Unit 3 (Normal Forms)"
      },
      {
        id: "q-dbms-2",
        question: "For a relation to be in Boyce-Codd Normal Form (BCNF), for every non-trivial functional dependency X -> Y, what must X be?",
        options: [
          "A prime attribute",
          "A foreign key",
          "A superkey of the relation",
          "An atomic attribute"
        ],
        correctIndex: 2,
        explanation: "BCNF is strictly stronger than 3NF: for every non-trivial dependency X -> Y, the determinant X must strictly be a superkey of the relation schema.",
        referenceUnit: "Unit 3 (BCNF)"
      },
      {
        id: "q-dbms-3",
        question: "Which ACID property guarantees that all operations of a transaction execute completely, or none at all?",
        options: [
          "Consistency",
          "Isolation",
          "Durability",
          "Atomicity"
        ],
        correctIndex: 3,
        explanation: "Atomicity is the all-or-nothing property managed by the transaction manager and recovery subsystem, ensuring that aborted transactions leave no partial modifications in the database.",
        referenceUnit: "Unit 3 (ACID Transactions)"
      },
      {
        id: "q-dbms-4",
        question: "Which decomposition property is strictly guaranteed when decomposing a relation schema into 3NF?",
        options: [
          "Lossless-join and Dependency preservation",
          "Only Lossless-join, but never dependency preservation",
          "Only Dependency preservation, but may lose join information",
          "Neither lossless-join nor dependency preservation"
        ],
        correctIndex: 0,
        explanation: "A major theoretical strength of 3NF is that any relation can be decomposed into a collection of 3NF relations that is guaranteed to be both lossless-join and dependency-preserving simultaneously.",
        referenceUnit: "Unit 3 (Decomposition)"
      },
      {
        id: "q-dbms-5",
        question: "What type of dependency is eliminated when converting a relation from 2NF to 3NF?",
        options: [
          "Partial functional dependency",
          "Transitive functional dependency of non-prime attributes",
          "Cyclic dependency",
          "Trivial functional dependency"
        ],
        correctIndex: 1,
        explanation: "3NF explicitly removes transitive dependencies (where a non-prime attribute X determines another non-prime attribute Y via a candidate key Z).",
        referenceUnit: "Unit 3 (3NF Normalization)"
      }
    ]
  },
  {
    id: "quiz-coa-addressing",
    subjectCode: "20CS3303",
    subjectName: "Computer Organization & Architecture",
    unitNumber: "Unit 1",
    title: "Addressing Modes & Instruction Execution Assessment",
    description: "Test your knowledge of CPU instruction formats, effective address calculations, and addressing mechanisms.",
    questions: [
      {
        id: "q-coa-1",
        question: "Which addressing mode requires ZERO memory accesses to fetch the operand during instruction execution?",
        options: [
          "Direct Addressing",
          "Indirect Addressing",
          "Immediate Addressing",
          "Indexed Addressing"
        ],
        correctIndex: 2,
        explanation: "In Immediate Addressing, the operand value is encoded directly inside the instruction word itself, so no memory cycle is needed to fetch the operand.",
        referenceUnit: "Unit 1 (Addressing Modes)"
      },
      {
        id: "q-coa-2",
        question: "In Relative Addressing mode, the effective memory address is computed relative to which CPU register?",
        options: [
          "Stack Pointer (SP)",
          "Program Counter (PC)",
          "Instruction Register (IR)",
          "Memory Buffer Register (MBR)"
        ],
        correctIndex: 1,
        explanation: "In Relative Addressing mode, Effective Address = Program Counter (PC) + Address Offset field, widely used for position-independent branching and jumping.",
        referenceUnit: "Unit 1 (Relative Addressing)"
      },
      {
        id: "q-coa-3",
        question: "In a Zero-Address instruction architecture, where are operands implicitly retrieved from?",
        options: [
          "General Purpose Registers",
          "The Evaluation Stack (Top of Stack)",
          "Direct Memory Address 0000H",
          "The Accumulator Register"
        ],
        correctIndex: 1,
        explanation: "Zero-Address architectures use a stack-based organization where arithmetic instructions (like ADD or MUL) implicitly pop the top two operands from the stack and push the result back.",
        referenceUnit: "Unit 1 (Stack Architectures)"
      },
      {
        id: "q-coa-4",
        question: "How many memory access cycles are needed to fetch the operand in Indirect Addressing mode?",
        options: [
          "0",
          "1",
          "2",
          "3"
        ],
        correctIndex: 2,
        explanation: "Indirect Addressing requires two memory references: the first memory access reads the pointer that holds the effective address, and the second memory access retrieves the actual operand.",
        referenceUnit: "Unit 1 (Indirect Addressing)"
      },
      {
        id: "q-coa-5",
        question: "Which addressing mode is most advantageous for efficiently accessing elements of a contiguous array?",
        options: [
          "Indexed / Base-Register Addressing",
          "Immediate Addressing",
          "Direct Addressing",
          "Implicit Addressing"
        ],
        correctIndex: 0,
        explanation: "Indexed Addressing computes Effective Address = Base Address + Index Register, allowing an algorithm to iterate through contiguous array elements simply by incrementing the index register.",
        referenceUnit: "Unit 1 (Array Addressing)"
      }
    ]
  },
  {
    id: "quiz-os-virtual-memory",
    subjectCode: "20CS3404",
    subjectName: "Operating Systems",
    unitNumber: "Unit 4",
    title: "Virtual Memory, Paging & Thrashing Assessment",
    description: "Evaluate your understanding of page fault handling, page replacement policies, and memory thrashing.",
    questions: [
      {
        id: "q-os-1",
        question: "What condition defines Belady's Anomaly in page replacement algorithms?",
        options: [
          "A process page fault rate is proportional to CPU clock speed",
          "Allocating more page frames unexpectedly increases the number of page faults",
          "A page is swapped out while it is actively being executed",
          "Virtual memory exceeds the total secondary disk capacity"
        ],
        correctIndex: 1,
        explanation: "Belady's Anomaly is a counter-intuitive phenomenon observed in FIFO page replacement where giving a process more physical page frames causes the total page fault count to increase rather than decrease.",
        referenceUnit: "Unit 4 (Belady's Anomaly)"
      },
      {
        id: "q-os-2",
        question: "Which page replacement algorithm is immune to Belady's Anomaly?",
        options: [
          "First-In-First-Out (FIFO)",
          "Least Recently Used (LRU)",
          "Random Replacement",
          "Second-Chance FIFO"
        ],
        correctIndex: 1,
        explanation: "LRU is a 'stack algorithm', meaning the set of pages in memory for n frames is always a subset of the pages that would be in memory for n+1 frames. Therefore, LRU can never suffer from Belady's Anomaly.",
        referenceUnit: "Unit 4 (LRU Page Replacement)"
      },
      {
        id: "q-os-3",
        question: "What is the primary cause of Thrashing in an operating system?",
        options: [
          "A hardware fault in the Level 1 CPU cache",
          "The degree of multiprogramming is too high, causing processes to spend more time paging than executing",
          "File system corruption on the secondary storage drive",
          "Processes executing too many arithmetic instructions"
        ],
        correctIndex: 1,
        explanation: "Thrashing occurs when the total memory locality demands across all active processes exceed available physical memory. The operating system spends almost all its time swapping pages in and out of swap disk rather than executing instructions.",
        referenceUnit: "Unit 4 (Thrashing)"
      },
      {
        id: "q-os-4",
        question: "What hardware mechanism alerts the OS kernel that a referenced page is not currently in physical RAM?",
        options: [
          "Arithmetic overflow interrupt",
          "Page Fault trap",
          "System call 0x80",
          "DMA bus grant signal"
        ],
        correctIndex: 1,
        explanation: "When an instruction accesses an address whose page table entry has the valid/invalid bit set to 'invalid', the MMU raises a Page Fault interrupt/trap to the OS kernel.",
        referenceUnit: "Unit 4 (Page Faults)"
      },
      {
        id: "q-os-5",
        question: "Which theoretical page replacement algorithm yields the absolute minimum number of page faults?",
        options: [
          "Optimal (OPT / MIN) Replacement",
          "Least Recently Used (LRU)",
          "Clock Algorithm",
          "Most Recently Used (MRU)"
        ],
        correctIndex: 0,
        explanation: "The Optimal page replacement algorithm replaces the page that will not be used for the longest period in the future, proving the theoretical lowest bound on page faults for any reference string.",
        referenceUnit: "Unit 4 (Optimal Replacement)"
      }
    ]
  }
];
