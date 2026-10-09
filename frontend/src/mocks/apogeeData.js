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
    text: 'Which SQL clause filters grouped rows after aggregation?',
    options: ['A. WHERE', 'B. ORDER BY', 'C. HAVING', 'D. DISTINCT'],
    correctIndex: 2,
    topic: 'Aggregation',
    explanation: 'HAVING filters grouped aggregates produced by GROUP BY, while WHERE filters individual rows before grouping.',
  },
  {
    id: 2,
    text: 'What is the worst-case time complexity of lookup in a balanced Binary Search Tree (AVL / Red-Black)?',
    options: ['A. O(1)', 'B. O(log n)', 'C. O(n)', 'D. O(n log n)'],
    correctIndex: 1,
    topic: 'DSA',
    explanation: 'In a balanced BST, height is guaranteed to be O(log n), so search is always O(log n).',
  },
  {
    id: 3,
    text: 'In relational algebra, which JOIN returns all rows from the left table and matched rows from the right table?',
    options: ['A. INNER JOIN', 'B. LEFT OUTER JOIN', 'C. CROSS JOIN', 'D. FULL OUTER JOIN'],
    correctIndex: 1,
    topic: 'Joins',
    explanation: 'LEFT OUTER JOIN preserves every record from the left table, padding missing right attributes with NULL.',
  },
  {
    id: 4,
    text: 'Which HTTP status code is most appropriate when a requested resource requires client authentication that was not provided?',
    options: ['A. 400 Bad Request', 'B. 401 Unauthorized', 'C. 403 Forbidden', 'D. 404 Not Found'],
    correctIndex: 1,
    topic: 'REST API',
    explanation: '401 Unauthorized signifies that the request requires user authentication credentials.',
  },
  {
    id: 5,
    text: 'What does the ACID property "Isolation" ensure in database transactions?',
    options: [
      'A. Transactions survive server crashes',
      'B. Concurrent transactions do not interfere with each other',
      'C. Constraints are always verified',
      'D. Data is replicated across disks',
    ],
    correctIndex: 1,
    topic: 'SQL Basics',
    explanation: 'Isolation ensures that concurrent executions leave the database in the same state as serial executions.',
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
