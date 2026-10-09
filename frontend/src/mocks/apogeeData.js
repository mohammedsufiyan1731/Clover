// Apogee Analog Mission Control Master Mock Data
// Aligned with docs/FRONTEND_DESIGN.md specifications

export const currentUserStudent = {
  id: 'usr_001',
  name: 'Aarav Sharma',
  callsign: 'CADET SHARMA',
  email: 'aarav.sharma@apogee.dev',
  role: 'student',
  batchId: 'CSE-A 2027',
  readinessScore: 54,
  streakCount: 3,
  points: 240,
  level: 'CADET',
  rank: 8,
  batchTotal: 12,
  areasIncluded: '2 of 4 areas evaluated',
  nextAction: 'Resume Lab: compare your resume with the Backend Intern role at NovaPay.',
};

export const currentUserTrainer = {
  id: 'usr_002',
  name: 'Ms. Priya Nair',
  callsign: 'FLIGHT CONTROLLER NAIR',
  email: 'priya.nair@apogee.dev',
  role: 'trainer',
  batchId: 'CSE-A 2027',
  assignedBatches: ['CSE-A 2027', 'CSE-B 2027', 'ECE-A 2027'],
};

export const assignedTests = [
  {
    id: 'test_sql_01',
    title: 'SQL Fundamentals Check',
    topic: 'SQL',
    durationMinutes: 20,
    questionCount: 12,
    status: 'DUE',
    assignedBatch: 'CSE-A 2027',
    dueDate: '2026-10-12',
  },
  {
    id: 'test_dsa_01',
    title: 'Data Structures Sprint',
    topic: 'DSA',
    durationMinutes: 15,
    questionCount: 10,
    status: 'COMPLETED',
    score: 72,
    assignedBatch: 'CSE-A 2027',
    submittedAt: 'Yesterday 18:40',
  },
  {
    id: 'test_backend_01',
    title: 'Backend Architecture Drill',
    topic: 'Backend',
    durationMinutes: 25,
    questionCount: 15,
    status: 'DUE',
    assignedBatch: 'CSE-A 2027',
    dueDate: '2026-10-15',
  },
];

export const sampleTestQuestions = [
  {
    id: 1,
    refCode: 'Q-01 // AGGREGATION FILTERS',
    sysCode: '88-SQL-AGG',
    text: 'Which SQL clause filters grouped rows after aggregation?',
    promptDescription:
      'Select the canonical SQL clause intended for evaluating post-aggregation conditions applied to aggregate functions like SUM, COUNT, or AVG.',
    options: ['A. WHERE', 'B. ORDER BY', 'C. HAVING', 'D. DISTINCT'],
    optionLabels: [
      'FILTERS ROWS PRIOR',
      'SORTS RESULT SET',
      'EVALUATES AFTER GROUP BY AGGREGATION',
      'ELIMINATES DUPLICATES',
    ],
    correctIndex: 2,
    topic: 'Aggregation',
    points: 1.0,
    explanation:
      'HAVING filters grouped rows resulting from GROUP BY operations, while WHERE filters individual rows before grouping occurs.',
  },
  {
    id: 2,
    refCode: 'Q-02 // RELATIONAL JOIN SEMANTICS',
    sysCode: '89-SQL-JOIN',
    text: 'Which JOIN type guarantees that all rows from the primary left table appear in the result set, even without matching right table keys?',
    promptDescription:
      'Analyze relational outer join mechanics when joining table A to table B on foreign key columns.',
    options: ['A. INNER JOIN', 'B. LEFT OUTER JOIN', 'C. CROSS JOIN', 'D. RIGHT JOIN'],
    optionLabels: [
      'MATCHING ROWS ONLY',
      'ALL LEFT ROWS PRESERVED',
      'CARTESIAN PRODUCT',
      'ALL RIGHT ROWS PRESERVED',
    ],
    correctIndex: 1,
    topic: 'Joins',
    points: 1.0,
    explanation:
      'LEFT OUTER JOIN preserves every record from the left table, padding missing right attributes with NULL.',
  },
  {
    id: 3,
    refCode: 'Q-03 // ACID ISOLATION GUARANTEES',
    sysCode: '90-SQL-TXN',
    text: 'What does the ACID property "Isolation" specifically guarantee in high-concurrency database systems?',
    promptDescription:
      'Evaluate concurrency control invariants across interleaved database transactions.',
    options: [
      'A. Transactions survive immediate power failure',
      'B. Concurrent transactions execute without mutual interference',
      'C. Schema integrity constraints are always enforced',
      'D. Data writes replicate synchronously across disk clusters',
    ],
    optionLabels: [
      'DURABILITY INVARIANT',
      'SERIALIZABLE ISOLATION',
      'CONSISTENCY INVARIANT',
      'REPLICATION TOPOLOGY',
    ],
    correctIndex: 1,
    topic: 'SQL Basics',
    points: 1.0,
    explanation:
      'Isolation guarantees that concurrent execution of transactions leaves the database in the same state as serial execution.',
  },
  {
    id: 4,
    refCode: 'Q-04 // B-TREE INDEX UTILITY',
    sysCode: '91-SQL-INDX',
    text: 'Which query operator benefits least from a standard B-Tree index on a single column `user_email`?',
    promptDescription:
      'Determine index seek feasibility for pattern matching versus range and equality filters.',
    options: [
      'A. WHERE user_email = ?',
      'B. WHERE user_email LIKE "alex%"',
      'C. WHERE user_email LIKE "%@domain.com"',
      'D. WHERE user_email BETWEEN "a" AND "c"',
    ],
    optionLabels: [
      'EXACT MATCH SEEK',
      'PREFIX RANGE SEEK',
      'LEADING WILDCARD FULL SCAN',
      'BOUNDED RANGE SCAN',
    ],
    correctIndex: 2,
    topic: 'Indexes & Query Plans',
    points: 1.0,
    explanation:
      'A leading wildcard (%...) prevents the query optimizer from performing a B-Tree index seek, forcing a full scan.',
  },
  {
    id: 5,
    refCode: 'Q-05 // PRIMARY VS UNIQUE CONSTRAINTS',
    sysCode: '92-SQL-CONS',
    text: 'What is the key functional distinction between a PRIMARY KEY and a UNIQUE constraint in ANSI SQL standard databases?',
    promptDescription:
      'Examine NULL value cardinality and table-level constraint allowances.',
    options: [
      'A. UNIQUE columns cannot be indexed',
      'B. A table can have multiple UNIQUE constraints, but only one PRIMARY KEY (which rejects NULLs)',
      'C. PRIMARY KEY allows duplicate values if autoincrement is enabled',
      'D. UNIQUE constraints cannot be referenced by FOREIGN KEYs',
    ],
    optionLabels: [
      'INDEXING CAPABILITY',
      'CARDINALITY & NULL PERMISSION',
      'DUPLICATION RULE',
      'FOREIGN KEY REFERENCE',
    ],
    correctIndex: 1,
    topic: 'SQL Basics',
    points: 1.0,
    explanation:
      'A table can only define one PRIMARY KEY (which forbids NULL values), whereas it can define multiple UNIQUE constraints.',
  },
  {
    id: 6,
    refCode: 'Q-06 // AGGREGATE FUNCTION NULL HANDLING',
    sysCode: '93-SQL-NULL',
    text: 'How does standard SQL `COUNT(column_name)` handle rows where `column_name` is NULL?',
    promptDescription:
      'Contrast `COUNT(*)` versus targeted column aggregation behavior.',
    options: [
      'A. It raises a SQL runtime exception',
      'B. It counts NULL rows as integer 0',
      'C. It ignores and excludes NULL rows from the count',
      'D. It treats NULL as boolean FALSE',
    ],
    optionLabels: [
      'RUNTIME EXCEPTION',
      'ZERO CONVERSION',
      'NULL ELIMINATION',
      'BOOLEAN COERCION',
    ],
    correctIndex: 2,
    topic: 'Aggregation',
    points: 1.0,
    explanation:
      'COUNT(column_name) ignores NULL values in the specified column, whereas COUNT(*) tallies all rows regardless of NULL values.',
  },
  {
    id: 7,
    refCode: 'Q-07 // UNION VS UNION ALL',
    sysCode: '94-SQL-SET',
    text: 'Why is `UNION ALL` computationally faster than `UNION` when combining result sets of identical schemas?',
    promptDescription:
      'Consider set operation sort and duplicate elimination costs.',
    options: [
      'A. UNION ALL performs an implicit hash sort',
      'B. UNION ALL bypasses duplicate elimination and sorting overhead',
      'C. UNION ALL executes concurrently across multiple CPUs',
      'D. UNION ALL caches the temporary table to memory',
    ],
    optionLabels: [
      'HASH SORT OVERHEAD',
      'NO DEDUPLICATION COST',
      'PARALLEL CPU THREADING',
      'IN-MEMORY BUFFER',
    ],
    correctIndex: 1,
    topic: 'SQL Basics',
    points: 1.0,
    explanation:
      'UNION performs an expensive sort or hash to eliminate duplicates; UNION ALL simply concatenates result sets without deduplication.',
  },
  {
    id: 8,
    refCode: 'Q-08 // WINDOW FUNCTIONS EXECUTION ORDER',
    sysCode: '95-SQL-WNDW',
    text: 'In standard SQL query processing phases, when are window functions (e.g., `ROW_NUMBER() OVER (...)`) computed?',
    promptDescription:
      'Determine evaluation order relative to WHERE, GROUP BY, and HAVING.',
    options: [
      'A. Before the WHERE clause filters rows',
      'B. Simultaneously with JOIN operations',
      'C. After WHERE, GROUP BY, and HAVING, but before ORDER BY and LIMIT',
      'D. Immediately prior to index retrieval',
    ],
    optionLabels: [
      'PRE-FILTER PHASE',
      'JOIN COMPILATION',
      'POST-GROUPING SELECT PHASE',
      'STORAGE RETRIEVAL',
    ],
    correctIndex: 2,
    topic: 'SQL Basics',
    points: 1.0,
    explanation:
      'Window functions are evaluated during the SELECT projection step, after WHERE, GROUP BY, and HAVING clauses have completed.',
  },
  {
    id: 9,
    refCode: 'Q-09 // DATABASE NORMALIZATION FORMS',
    sysCode: '96-SQL-NORM',
    text: 'What is the defining condition for a relation to satisfy Third Normal Form (3NF)?',
    promptDescription:
      'Analyze functional dependencies and transitive attributes.',
    options: [
      'A. It is in 2NF and has no multi-valued dependencies',
      'B. It is in 2NF and contains no transitive dependencies among non-prime attributes',
      'C. Every determinant is a candidate key (BCNF)',
      'D. All attributes are composite atomic structures',
    ],
    optionLabels: [
      '4NF MULTI-VALUED',
      'NO TRANSITIVE DEPENDENCY',
      'BOYCE-CODD STANDARD',
      'COMPOSITE ATOM',
    ],
    correctIndex: 1,
    topic: 'Joins',
    points: 1.0,
    explanation:
      'A table is in 3NF if it is in 2NF and all non-key columns depend directly on the primary key, with no transitive dependencies.',
  },
  {
    id: 10,
    refCode: 'Q-10 // TRANSACTIONS & DEADLOCKS',
    sysCode: '97-SQL-LOCK',
    text: 'Which database mechanism automatically breaks a cyclic dependency where Transaction A waits for Transaction B and vice versa?',
    promptDescription:
      'Review concurrency lock resolution policies.',
    options: [
      'A. Two-Phase Commit protocol',
      'B. Deadlock Detector using a Wait-For Graph cycle check',
      'C. Checkpoint Write Log flush',
      'D. Write-Ahead Logging (WAL)',
    ],
    optionLabels: [
      '2PC PROTOCOL',
      'WAIT-FOR GRAPH CYCLE KILL',
      'CHECKPOINT ENGINE',
      'WAL APPEND LOG',
    ],
    correctIndex: 1,
    topic: 'Indexes & Query Plans',
    points: 1.0,
    explanation:
      'Database deadlock detection algorithms periodically inspect the wait-for graph, find cycles, and abort/rollback one transaction (the victim).',
  },
  {
    id: 11,
    refCode: 'Q-11 // CORRELATED SUBQUERIES',
    sysCode: '98-SQL-SUBQ',
    text: 'What distinguishes a correlated subquery from an uncorrelated (independent) subquery?',
    promptDescription:
      'Assess row-by-row dependency on outer query attributes.',
    options: [
      'A. A correlated subquery runs once and caches its result',
      'B. A correlated subquery references columns from the outer query and evaluates per outer row',
      'C. A correlated subquery must always return multiple columns',
      'D. A correlated subquery cannot be replaced with a JOIN',
    ],
    optionLabels: [
      'SINGLE PASS CACHE',
      'OUTER ROW DEPENDENCY',
      'MULTI-COLUMN TUPLE',
      'JOIN PROHIBITION',
    ],
    correctIndex: 1,
    topic: 'Joins',
    points: 1.0,
    explanation:
      'Correlated subqueries refer to column values in the outer query, meaning they are evaluated once for every qualifying outer candidate row.',
  },
  {
    id: 12,
    refCode: 'Q-12 // QUERY PLAN EXPLAIN',
    sysCode: '99-SQL-PLAN',
    text: 'In database performance tuning, what does `EXPLAIN ANALYZE` do that standard `EXPLAIN` does not?',
    promptDescription:
      'Distinguish query optimizer cost estimation from actual query engine execution.',
    options: [
      'A. Generates an index automatically',
      'B. Actually executes the query and reports real runtimes and row counts alongside estimates',
      'C. Converts SQL into compiled C++ byte code',
      'D. Locks the target tables for exclusive analysis',
    ],
    optionLabels: [
      'AUTO-INDEX DDL',
      'REAL RUNTIME & ROW COUNT TELEMETRY',
      'COMPILER JIT EMIT',
      'EXCLUSIVE DDL LOCK',
    ],
    correctIndex: 1,
    topic: 'Indexes & Query Plans',
    points: 1.0,
    explanation:
      'Standard EXPLAIN only displays the optimizer plan estimate; EXPLAIN ANALYZE actually executes the statement and captures real execution times and exact row counts.',
  },
];


export const mockDebriefData = {
  testTitle: 'SQL Fundamentals Check',
  submittedAt: 'Today // 14:12 UTC',
  score: 72,
  accuracyRatio: '9 / 12',
  batchAverage: 68,
  status: 'DEBRIEF COMPLETE',
  topicAccuracies: [
    { topic: 'SQL Basics', accuracy: 83, batchAverage: 75 },
    { topic: 'Joins', accuracy: 50, batchAverage: 62 },
    { topic: 'Aggregation', accuracy: 67, batchAverage: 65 },
    { topic: 'Indexes & Query Plans', accuracy: 75, batchAverage: 60 },
  ],
  timeNote: 'Question 04 took 01:42 — slower than your median of 00:38.',
  recommendation: 'Review SQL joins and foreign-key constraints, then retry a short practice set before the next placement gate.',
};

export const mockResumeAnalysis = {
  jobTarget: 'Backend Intern at NovaPay',
  atsScore: 61,
  basicMode: false,
  missingKeywords: ['REST API', 'Docker', 'SQL joins', 'Redis Caching'],
  matchedKeywords: ['Python', 'Git', 'Data Structures', 'PostgreSQL', 'FastAPI'],
  sectionFeedback: [
    { section: 'Education', status: 'NOMINAL', note: 'Clear degree, institution, and expected graduation date (2027).' },
    { section: 'Skills', status: 'ATTENTION', note: 'Add role-specific backend tools: Docker, containerization, and API testing.' },
    { section: 'Projects', status: 'ATTENTION', note: 'Describe concrete results and throughput, not just the technology used.' },
    { section: 'Experience', status: 'IN REVIEW', note: 'Add measurable impact metrics where accurate (e.g. latency cut, test coverage).' },
  ],
  lineSuggestions: [
    {
      original: 'Worked on backend APIs for college project.',
      suggested: 'Built and tested 12 REST API endpoints using FastAPI and PostgreSQL; added integration tests with Pytest achieving 85% coverage.',
      reason: 'Replaces passive wording with quantified scope, concrete framework, and testing verification.',
    },
    {
      original: 'Used Docker to run applications.',
      suggested: 'Containerized multi-service web backend using Docker and Docker Compose, reducing local onboarding time from 30m to 3m.',
      reason: 'Clarifies exact container usage and specifies operational impact.',
    },
  ],
};

export const mockInterviewRounds = [
  { id: 'technical', name: 'Technical', duration: '15 min', questionsCount: 5, desc: 'Deep dive into architecture, algorithms, and SQL.' },
  { id: 'hr', name: 'HR Screening', duration: '10 min', questionsCount: 4, desc: 'Background, cultural alignment, and career aspirations.' },
  { id: 'behavioral', name: 'Behavioral (STAR)', duration: '12 min', questionsCount: 4, desc: 'Conflict resolution, team delivery, and crisis handling.' },
];

export const mockCrewRoster = [
  { id: 'stu_1', name: 'Aarav Sharma', batch: 'CSE-A 2027', score: 61, weakTopics: 'Docker, SQL Joins', lastActive: 'Today' },
  { id: 'stu_2', name: 'Diya Patel', batch: 'CSE-A 2027', score: 78, weakTopics: 'Redis, System Design', lastActive: 'Today' },
  { id: 'stu_3', name: 'Rohan Verma', batch: 'CSE-A 2027', score: 48, weakTopics: 'SQL Joins, DSA Trees', lastActive: 'Yesterday' },
  { id: 'stu_4', name: 'Ananya Iyer', batch: 'CSE-A 2027', score: 85, weakTopics: 'Kubernetes', lastActive: 'Today' },
  { id: 'stu_5', name: 'Kabir Mehta', batch: 'CSE-A 2027', score: 42, weakTopics: 'REST API, Docker', lastActive: '2 days ago' },
  { id: 'stu_6', name: 'Sneha Rao', batch: 'CSE-A 2027', score: 69, weakTopics: 'Concurrency, Mutex', lastActive: 'Today' },
  { id: 'stu_7', name: 'Vikram Joshi', batch: 'CSE-A 2027', score: 55, weakTopics: 'Docker, SQL Joins', lastActive: 'Yesterday' },
  { id: 'stu_8', name: 'Pooja Reddy', batch: 'CSE-A 2027', score: 72, weakTopics: 'Indexing, Explain Plans', lastActive: 'Today' },
  { id: 'stu_9', name: 'Arjun Nair', batch: 'CSE-A 2027', score: 38, weakTopics: 'Data Structures, Memory', lastActive: '3 days ago' },
  { id: 'stu_10', name: 'Meera Sen', batch: 'CSE-A 2027', score: 64, weakTopics: 'REST API Design', lastActive: 'Today' },
  { id: 'stu_11', name: 'Karan Kapoor', batch: 'CSE-A 2027', score: 59, weakTopics: 'Docker, WebSockets', lastActive: 'Yesterday' },
  { id: 'stu_12', name: 'Tara Deshmukh', batch: 'CSE-A 2027', score: 70, weakTopics: 'SQL Aggregations', lastActive: 'Today' },
];

export const mockBatchWeakTopics = [
  { topic: 'Docker / Containers', studentCount: 7, percentage: 58 },
  { topic: 'SQL Joins & Relational Algebra', studentCount: 6, percentage: 50 },
  { topic: 'REST API Design & Error Contracts', studentCount: 4, percentage: 33 },
  { topic: 'Binary Trees & Graph Traversal', studentCount: 3, percentage: 25 },
];

export const mockCodingProblems = [
  {
    id: 'prob_01',
    title: 'Two Sum',
    difficulty: 'EASY',
    topic: 'Hash Map',
    statement: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    starterCode: {
      python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n',
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n',
    },
    testCases: [
      { id: 'TEST 01', input: '[2, 7, 11, 15], 9', expected: '[0, 1]', passed: true, runtime: '12ms' },
      { id: 'TEST 02', input: '[3, 2, 4], 6', expected: '[1, 2]', passed: true, runtime: '15ms' },
      { id: 'TEST 03', input: '[3, 3], 6', expected: '[0, 1]', passed: true, runtime: '9ms' },
      { id: 'TEST 04', input: '[1, 5, 8, 12, 19], 27', expected: '[2, 4]', passed: true, runtime: '18ms' },
      { id: 'TEST 05', input: '[-1, -2, -3, -4, -5], -8', expected: '[2, 4]', passed: true, runtime: '14ms' },
    ],
  },
  {
    id: 'prob_02',
    title: 'Valid Palindrome',
    difficulty: 'EASY',
    topic: 'Two Pointers',
    statement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    sampleInput: 's = "A man, a plan, a canal: Panama"',
    sampleOutput: 'true',
    starterCode: {
      python: 'def isPalindrome(s: str) -> bool:\n    clean = "".join(c.lower() for c in s if c.isalnum())\n    return clean == clean[::-1]\n',
      javascript: 'function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}\n',
    },
    testCases: [
      { id: 'TEST 01', input: '"A man, a plan, a canal: Panama"', expected: 'true', passed: true, runtime: '11ms' },
      { id: 'TEST 02', input: '"race a car"', expected: 'false', passed: true, runtime: '8ms' },
      { id: 'TEST 03', input: '" "', expected: 'true', passed: true, runtime: '6ms' },
    ],
  },
];
