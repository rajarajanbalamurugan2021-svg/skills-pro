import bcrypt from 'bcryptjs';
import {
  UserProfile,
  Course,
  CourseEnrollment,
  AptitudeQuestion,
  CodeProblem,
  CodeSubmission,
  JobSimulation,
  JobItem,
  JobApplication,
  InterviewQuestion,
  SkillMetric,
  Certificate,
  Note,
  NotificationItem,
  StaffBatch,
  StudentProgressReport,
  AdminStats,
} from '../types';

export const DEFAULT_PASSWORD_HASH = bcrypt.hashSync('Password123!', 10);

export const initialUsers: UserProfile[] = [
  {
    id: 'usr_student_1',
    name: 'Rajarajan B.',
    email: 'student@skillforge.ai',
    role: 'student',
    status: 'active',
    passwordHash: DEFAULT_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'PSG College of Technology',
    department: 'Computer Science and Engineering',
    degree: 'B.E. Computer Science',
    graduationYear: 2025,
    phone: '+91 98765 43210',
    targetRole: 'Full Stack & AI Engineer',
    bio: 'Aspiring software engineer passionate about scalable backend systems, cloud architectures, and machine learning solutions.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'DSA', 'System Design'],
    streakDays: 14,
    points: 2450,
    rank: 4,
    completedAssessments: 28,
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    id: 'usr_student_2',
    name: 'Rajarajan Balamurugan',
    email: 'rajarajanbalamurugan2021@gmail.com',
    role: 'student',
    status: 'active',
    passwordHash: DEFAULT_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    college: 'PSG College of Technology',
    department: 'Computer Science and Engineering',
    degree: 'B.E. Computer Science',
    graduationYear: 2025,
    phone: '+91 98765 43210',
    targetRole: 'Full Stack & AI Engineer',
    bio: 'Passionate student engineer preparing for tier-1 tech placements.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'DSA'],
    streakDays: 14,
    points: 2450,
    rank: 4,
    completedAssessments: 28,
    createdAt: '2025-01-15T08:00:00.000Z',
  },
  {
    id: 'usr_staff_1',
    name: 'Dr. Sarah Jenkins',
    email: 'staff@skillforge.ai',
    role: 'staff',
    status: 'active',
    passwordHash: DEFAULT_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    college: 'Campus Training & Placement Cell',
    department: 'Placement Training & Skill Development',
    bio: 'Lead Placement Coordinator & Head of Technical Training with 12+ years mentoring tier-1 tech recruits.',
    skills: ['Placement Training', 'DSA Curriculum', 'Mock Interviews', 'Student Mentoring'],
    streakDays: 45,
    points: 5800,
    completedAssessments: 140,
    createdAt: '2024-11-01T08:00:00.000Z',
  },
  {
    id: 'usr_admin_1',
    name: 'Director Marcus Vance',
    email: 'admin@skillforge.ai',
    role: 'admin',
    status: 'active',
    passwordHash: DEFAULT_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    college: 'SkillsPro Executive Board',
    department: 'Platform Administration & Corporate Relations',
    bio: 'Enterprise Dean and administrator connecting 400+ hiring partners with 5,000+ top engineering candidates.',
    skills: ['Corporate Relations', 'Analytics', 'Accreditation', 'Curriculum Governance'],
    streakDays: 110,
    points: 9200,
    completedAssessments: 320,
    createdAt: '2024-09-01T08:00:00.000Z',
  },
];

export const initialCourses: Course[] = [
  {
    id: 'crs_dsa_101',
    title: 'Data Structures & Algorithms Mastery for Product Companies',
    description: 'Master time/space complexity, arrays, two-pointers, sliding window, trees, dynamic programming, and graphs for FAANG & tier-1 interviews.',
    category: 'Data Structures & Algorithms',
    level: 'Intermediate',
    duration: '42 Hours • 12 Modules',
    instructor: {
      name: 'Alex Chen',
      role: 'Staff Software Engineer @ Ex-Meta',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1516116211227-bbc141e97c9b?w=600&auto=format&fit=crop&q=80',
    progressPercentage: 65,
    enrolled: true,
    rating: 4.9,
    reviewCount: 1840,
    tags: ['DSA', 'LeetCode', 'Algorithms', 'FAANG'],
    modules: [
      {
        id: 'mod_dsa_1',
        title: 'Module 1: Time & Space Complexity Analysis',
        lessons: [
          { id: 'les_dsa_1_1', title: 'Big-O, Big-Theta, Big-Omega notation', duration: '24 min', type: 'video', completed: true },
          { id: 'les_dsa_1_2', title: 'Amortized time analysis & memory hierarchies', duration: '18 min', type: 'article', completed: true },
          { id: 'les_dsa_1_3', title: 'Quiz: Complexity Benchmarking', duration: '15 min', type: 'quiz', completed: true },
        ],
      },
      {
        id: 'mod_dsa_2',
        title: 'Module 2: Arrays, Two Pointers & Sliding Window',
        lessons: [
          { id: 'les_dsa_2_1', title: 'Prefix Sums and Difference Arrays', duration: '32 min', type: 'video', completed: true },
          { id: 'les_dsa_2_2', title: 'Optimal Two-Pointer Traversal Patterns', duration: '28 min', type: 'code', completed: true },
          { id: 'les_dsa_2_3', title: 'Variable-sized vs Fixed Sliding Windows', duration: '35 min', type: 'code', completed: false },
        ],
      },
      {
        id: 'mod_dsa_3',
        title: 'Module 3: Binary Trees, BSTs & Trie Implementations',
        lessons: [
          { id: 'les_dsa_3_1', title: 'Tree traversals: Recursive vs Morris In-Order', duration: '40 min', type: 'video', completed: false },
          { id: 'les_dsa_3_2', title: 'Lowest Common Ancestor and Diameter of Binary Tree', duration: '30 min', type: 'code', completed: false },
        ],
      },
    ],
  },
  {
    id: 'crs_fullstack_201',
    title: 'Full Stack Modern Web: React 19, TypeScript & Microservices',
    description: 'Build enterprise-grade SaaS web applications with modern state management, high performance, REST/GraphQL APIs, and database migrations.',
    category: 'Full Stack',
    level: 'Intermediate',
    duration: '38 Hours • 10 Modules',
    instructor: {
      name: 'Elena Rostova',
      role: 'Principal Architect @ Stripe',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    progressPercentage: 40,
    enrolled: true,
    rating: 4.8,
    reviewCount: 920,
    tags: ['React', 'TypeScript', 'Node.js', 'System Design'],
    modules: [
      {
        id: 'mod_fs_1',
        title: 'Module 1: Advanced TypeScript Patterns',
        lessons: [
          { id: 'les_fs_1_1', title: 'Generics, Conditional Types, and Discriminated Unions', duration: '30 min', type: 'video', completed: true },
          { id: 'les_fs_1_2', title: 'Type-safe API contract generation', duration: '25 min', type: 'code', completed: true },
        ],
      },
      {
        id: 'mod_fs_2',
        title: 'Module 2: Resilient Backend Architecture',
        lessons: [
          { id: 'les_fs_2_1', title: 'Express & Fastify middleware pipelines', duration: '35 min', type: 'article', completed: false },
          { id: 'les_fs_2_2', title: 'Database connection pooling & transactional consistency', duration: '45 min', type: 'code', completed: false },
        ],
      },
    ],
  },
  {
    id: 'crs_sysdesign_301',
    title: 'High-Scale System Design: From Monolith to Distributed Systems',
    description: 'Design WhatsApp, Netflix CDN, Uber Geospatial dispatch, and Stripe billing engine. Learn caching, sharding, message queues, and consensus.',
    category: 'System Design',
    level: 'Advanced',
    duration: '28 Hours • 8 Modules',
    instructor: {
      name: 'Vikram Sethi',
      role: 'Senior Staff Engineer @ Google Cloud',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    progressPercentage: 15,
    enrolled: true,
    rating: 4.95,
    reviewCount: 1420,
    tags: ['Distributed Systems', 'Architecture', 'Kafka', 'Redis'],
    modules: [
      {
        id: 'mod_sd_1',
        title: 'Module 1: Fundamental Building Blocks',
        lessons: [
          { id: 'les_sd_1_1', title: 'Load Balancing & Consistent Hashing', duration: '32 min', type: 'video', completed: true },
          { id: 'les_sd_1_2', title: 'Caching Strategies: Write-Through, Write-Behind, Cache-Aside', duration: '28 min', type: 'article', completed: false },
        ],
      },
    ],
  },
  {
    id: 'crs_aptitude_401',
    title: 'Campus Aptitude, Logical Reasoning & Speed Math Accelerator',
    description: 'Shortcut speed-math techniques, probability, permutations, syllogisms, data interpretation, and verbal reasoning for TCS, Infosys, CTS, Amazon.',
    category: 'Aptitude & Soft Skills',
    level: 'Beginner',
    duration: '30 Hours • 15 Modules',
    instructor: {
      name: 'Pooja Subramanian',
      role: 'National Aptitude Trainer & CAT 99.8%ile',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    },
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80',
    progressPercentage: 80,
    enrolled: true,
    rating: 4.75,
    reviewCount: 2200,
    tags: ['Aptitude', 'Placement Tests', 'Logical Reasoning', 'Speed Math'],
    modules: [
      {
        id: 'mod_apt_1',
        title: 'Module 1: Time, Speed & Distance Hacks',
        lessons: [
          { id: 'les_apt_1_1', title: 'Relative Speed, Trains & Circular Tracks', duration: '25 min', type: 'video', completed: true },
          { id: 'les_apt_1_2', title: 'Practice Set: Speed Drill', duration: '20 min', type: 'quiz', completed: true },
        ],
      },
    ],
  },
];

export const initialAptitudeQuestions: AptitudeQuestion[] = [
  {
    id: 'apt_q_1',
    category: 'Quantitative',
    question: 'A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m in length?',
    options: ['65 seconds', '89 seconds', '100 seconds', '72 seconds'],
    correctAnswer: 1, // 89 seconds
    explanation: 'Speed of the train = Distance / Time = 240 / 24 = 10 m/s. Total distance to cross platform = Train length + Platform length = 240 + 650 = 890 m. Time taken = 890 / 10 = 89 seconds.',
    difficulty: 'Easy',
    formulaOrTip: 'Speed = Length / Time. When crossing a platform, Total Distance = Length of Train + Length of Platform.',
  },
  {
    id: 'apt_q_2',
    category: 'Quantitative',
    question: 'A pipe can fill a cistern in 9 hours. Due to a leak in its bottom, it is filled in 10 hours. If the cistern is full, in how much time will it be emptied by the leak?',
    options: ['80 hours', '90 hours', '100 hours', '75 hours'],
    correctAnswer: 1, // 90 hours
    explanation: 'Work done by pipe in 1 hr = 1/9. Work done by pipe + leak in 1 hr = 1/10. Work done by leak in 1 hr = 1/9 - 1/10 = 1/90. Therefore, the leak alone empties the cistern in 90 hours.',
    difficulty: 'Medium',
    formulaOrTip: 'Leak rate = (Rate without leak) - (Rate with leak) = 1/A - 1/B.',
  },
  {
    id: 'apt_q_3',
    category: 'Logical Reasoning',
    question: 'Pointing to a photograph, a woman says: "He is the son of the only daughter of the father of my brother." How is the man related to the woman?',
    options: ['Brother', 'Nephew', 'Son', 'Father'],
    correctAnswer: 2, // Son
    explanation: 'Father of brother = Father. Only daughter of father = The woman herself. Son of the only daughter = Her son.',
    difficulty: 'Easy',
    formulaOrTip: 'Break down blood relationships backwards from the innermost relationship.',
  },
  {
    id: 'apt_q_4',
    category: 'Logical Reasoning',
    question: 'In a certain code, "PONDER" is written as "JONKLQ". How is "HELD" written in that code?',
    options: ['CDBK', 'BCHJ', 'DCBK', 'BDJK'],
    correctAnswer: 0, // CDBK
    explanation: 'Each letter is mapped with a backward shift of 5 or 6, or reverse letter pairs. In PONDER: P(-6)=J, O(same/reversed)... Specifically, H(8) -> C(3) [-5], E(5) -> D(4) [-1], etc.',
    difficulty: 'Medium',
  },
  {
    id: 'apt_q_5',
    category: 'Core CS',
    question: 'What is the worst-case time complexity of searching an element in a Balanced Binary Search Tree (AVL Tree) containing N nodes?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctAnswer: 1, // O(log N)
    explanation: 'AVL trees maintain a balance factor of {-1, 0, 1} for every node, ensuring maximum height strictly bounded by 1.44 log2(N). Therefore, search is guaranteed O(log N) in worst case.',
    difficulty: 'Easy',
    formulaOrTip: 'Standard BST worst case is O(N) when skewed, but self-balancing BSTs (AVL, Red-Black) guarantee O(log N).',
  },
  {
    id: 'apt_q_6',
    category: 'Core CS',
    question: 'In relational databases, which Normal Form guarantees that every non-prime attribute is non-transitively dependent on every candidate key?',
    options: ['1NF', '2NF', '3NF', 'BCNF'],
    correctAnswer: 2, // 3NF
    explanation: '3NF removes transitive dependencies: X -> Y where Y is non-prime attribute and X is a superkey, or Y is a prime attribute.',
    difficulty: 'Medium',
  },
  {
    id: 'apt_q_7',
    category: 'Verbal Ability',
    question: 'Select the synonym for "EPHEMERAL":',
    options: ['Eternal', 'Transient', 'Monumental', 'Obscure'],
    correctAnswer: 1, // Transient
    explanation: 'Ephemeral means lasting for a very short time; transient, fleeting, or brief.',
    difficulty: 'Easy',
  },
  {
    id: 'apt_q_8',
    category: 'Verbal Ability',
    question: 'Identify the sentence with correct subject-verb agreement:',
    options: [
      'Neither the professor nor the students was present in the auditorium.',
      'Neither the professor nor the students were present in the auditorium.',
      'Either the engineers or the manager are responsible for the outage.',
      'The group of developers have decided to refactor the database.',
    ],
    correctAnswer: 1,
    explanation: 'When subjects are joined by "neither... nor", the verb agrees with the closer subject ("the students", plural -> "were").',
    difficulty: 'Medium',
  },
];

export const initialCodeProblems: CodeProblem[] = [
  {
    id: 'prob_two_sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Strings',
    acceptanceRate: '49.8%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your code here
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      python: `def twoSum(nums, target):
    # Write your solution here
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); i++) {
        int diff = target - nums[i];
        if (seen.count(diff)) {
            return {seen[diff], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}`,
      java: `import java.util.HashMap;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[]{};
    }
}`,
    },
    testCases: [
      { input: '[2, 7, 11, 15], 9', expectedOutput: '[0, 1]' },
      { input: '[3, 2, 4], 6', expectedOutput: '[1, 2]' },
      { input: '[3, 3], 6', expectedOutput: '[0, 1]' },
      { input: '[1, 5, 8, 12, 19], 27', expectedOutput: '[2, 4]', hidden: true },
    ],
    hints: [
      'Can you solve this faster than brute force O(N^2)?',
      'Use a hash table / hash map to store each number and its index as you iterate.',
    ],
  },
  {
    id: 'prob_valid_parens',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack & Queue',
    acceptanceRate: '40.5%',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only ()[]{}.'],
    starterCode: {
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.pop() !== map[char]) return false;
    }
  }
  return stack.length === 0;
}`,
      python: `def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in '({[':
            stack.append(char)
        elif not stack or stack.pop() != pairs[char]:
            return False
    return len(stack) == 0`,
      cpp: `#include <string>
#include <stack>
using namespace std;

bool isValid(string s) {
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '{' || c == '[') st.push(c);
        else {
            if (st.empty()) return false;
            char top = st.top();
            st.pop();
            if (c == ')' && top != '(') return false;
            if (c == '}' && top != '{') return false;
            if (c == ']' && top != '[') return false;
        }
    }
    return st.empty();
}`,
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
      { input: '"{[()()]}"', expectedOutput: 'true', hidden: true },
    ],
  },
  {
    id: 'prob_merge_intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Sorting & Searching',
    acceptanceRate: '46.2%',
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
        explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].',
      },
      {
        input: 'intervals = [[1,4],[4,5]]',
        output: '[[1,5]]',
        explanation: 'Intervals [1,4] and [4,5] are considered overlapping.',
      },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    starterCode: {
      javascript: `function merge(intervals) {
  if (!intervals.length) return [];
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const last = result[result.length - 1];
    if (current[0] <= last[1]) {
      last[1] = Math.max(last[1], current[1]);
    } else {
      result.push(current);
    }
  }
  return result;
}`,
      python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

vector<vector<int>> merge(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged = {intervals[0]};
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= merged.back()[1]) {
            merged.back()[1] = max(merged.back()[1], intervals[i][1]);
        } else {
            merged.push_back(intervals[i]);
        }
    }
    return merged;
}`,
      java: `import java.util.*;

class Solution {
    public int[][] merge(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        int[] current = intervals[0];
        merged.add(current);
        for (int[] interval : intervals) {
            if (interval[0] <= current[1]) {
                current[1] = Math.max(current[1], interval[1]);
            } else {
                current = interval;
                merged.add(current);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`,
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      { input: '[[1,4],[0,2],[3,5]]', expectedOutput: '[[0,5]]', hidden: true },
    ],
  },
];

export const initialJobSimulations: JobSimulation[] = [
  {
    id: 'sim_fintech_1',
    title: 'Fintech Payment Gateway Idempotency & Concurrency Bug',
    company: 'Stripe-Style Global Payments',
    role: 'Backend Software Engineer (L4)',
    department: 'Core Transaction Infrastructure',
    duration: '2-3 Hours Simulation',
    difficulty: 'Mid-Level',
    badgeName: 'Certified Payment Systems Engineer',
    overview: 'Experience an authentic corporate sprint ticket. During flash sales, users clicking "Pay Now" twice triggered duplicate charge webhooks. Your team needs you to implement atomic idempotency keys using Redis and write a unit test suite.',
    objectives: [
      'Investigate production log traces indicating race conditions.',
      'Implement distributed locking or Redis SETNX idempotency validation.',
      'Refactor the `/api/v1/charge` handler with proper rollback and error semantics.',
      'Write clean PR descriptions complying with corporate engineering standards.',
    ],
    skillsGained: ['Distributed Locking', 'Redis', 'Atomic Transactions', 'Code Review Protocol'],
    tasks: [
      {
        id: 'task_1',
        title: 'Task 1: Diagnose Root Cause from Simulated Error Logs',
        type: 'incident',
        status: 'completed',
        priority: 'critical',
        description: 'Read the simulated Datadog telemetry trace and identify why two concurrent requests both bypassed the `hasAlreadyProcessed(id)` check.',
        scenario: 'Timestamp 14:02:11.450: Thread A reads DB state: UNPROCESSED. Timestamp 14:02:11.452: Thread B reads DB state: UNPROCESSED. Both proceed to charge customer card twice.',
        hints: [
          'The database check is not transactional or lacks SELECT FOR UPDATE.',
          'A distributed lock or Redis SETNX before DB queries prevents dual execution.',
        ],
        acceptanceCriteria: [
          'Identify the exact non-atomic check-then-act vulnerability in the report.',
          'Provide architectural recommendation (Redis key expiry + status polling).',
        ],
        userSubmission: 'Root cause identified: Classic Check-Then-Act race condition. Thread A and B executed concurrent reads before Thread A committed the status row.',
        mentorFeedback: 'Outstanding root cause diagnosis. Exactly matches the senior staff post-mortem findings.',
      },
      {
        id: 'task_2',
        title: 'Task 2: Implement Redis Idempotency Guard Middleware',
        type: 'bugfix',
        status: 'in_progress',
        priority: 'high',
        description: 'Write the Express/TypeScript middleware that validates `Idempotency-Key` header, caches response payload with 120s TTL, and returns HTTP 409 or cached payload if in flight.',
        scenario: 'Incoming HTTP POST `/api/v1/charges` with headers `{ "Idempotency-Key": "req_881920" }`.',
        initialCode: `export async function idempotencyMiddleware(req, res, next) {
  const key = req.headers['idempotency-key'];
  if (!key) return res.status(400).json({ error: 'Missing Idempotency-Key' });

  // TODO: Check Redis cache
  // If status is 'IN_PROGRESS', return res.status(409).json({ error: 'Concurrent request in flight' });
  // If status is 'RESOLVED', return res.status(200).json(cachedResponse);
  // Otherwise set key to 'IN_PROGRESS' with 60s TTL and proceed

  next();
}`,
        hints: [
          'Use redis.set(key, "IN_PROGRESS", "EX", 60, "NX") to guarantee single winner.',
          'Remember to intercept res.send or res.json to save final payload upon completion.',
        ],
        acceptanceCriteria: [
          'Guarantees mutual exclusion across distributed servers.',
          'Caches response for replay without re-calling Stripe gateway.',
        ],
      },
      {
        id: 'task_3',
        title: 'Task 3: Submit Pull Request & Documentation',
        type: 'code_review',
        status: 'todo',
        priority: 'medium',
        description: 'Draft the pull request description with testing results, backward compatibility analysis, and rollback strategy.',
        scenario: 'Ready for peer review before staging deployment.',
        hints: ['Follow the PR template: Context, Changes, Test Evidence, Rollback Plan.'],
        acceptanceCriteria: ['Clear explanation of load testing under 500 RPS concurrent bursts.'],
      },
    ],
  },
  {
    id: 'sim_cloud_2',
    title: 'Streaming Platform CDN Rate Limiter & Edge Throttling',
    company: 'StreamMax (Netflix-Style Architecture)',
    role: 'Cloud Infrastructure / SRE Associate',
    department: 'Edge Traffic & CDN Routing',
    duration: '2 Hours Simulation',
    difficulty: 'Junior',
    badgeName: 'Certified Edge Systems SRE',
    overview: 'Protect video origin servers from scraper bot spikes. Build a Token Bucket algorithm in Lua / Redis and configure NGINX edge caching rules.',
    objectives: [
      'Understand Leaky Bucket vs Token Bucket rate limiting algorithms.',
      'Configure rate limiting thresholds based on API tiering.',
      'Measure 99th percentile latency reduction during traffic surges.',
    ],
    skillsGained: ['Rate Limiting', 'NGINX', 'Cloud Edge Computing', 'SRE Best Practices'],
    tasks: [
      {
        id: 'task_c1',
        title: 'Task 1: Algorithm Selection & Capacity Math',
        type: 'feature',
        status: 'todo',
        priority: 'high',
        description: 'Calculate token refill rates for free tier (60 req/min) vs premium tier (1200 req/min) without high memory overhead.',
        scenario: '100,000 active concurrent streaming clients.',
        hints: ['Token bucket allows controlled bursts while maintaining average throughput.'],
        acceptanceCriteria: ['Document refill formula: tokens = min(capacity, current + elapsed * rate).'],
      },
    ],
  },
];

export const initialInterviewQuestions: InterviewQuestion[] = [
  {
    id: 'iq_tech_1',
    category: 'Distributed Systems & Databases',
    question: 'How do you design a database schema and indexing strategy for a social network feed where users have millions of followers?',
    sampleAnswer: 'For celebrity users with millions of followers, a pure Fan-Out-On-Write (push model) overwhelms the system. The industry standard is a hybrid architecture: regular users use push model into Redis timeline lists, while high-follower accounts use Fan-Out-On-Read (pull model) merged dynamically at query time.',
    keyPointsToCover: [
      'Fan-out on write vs fan-out on read tradeoff',
      'Hybrid approach for mega-influencers',
      'Redis Sorted Sets (ZSET) for chronology and ranking',
      'Database indexing on (user_id, created_at DESC)',
    ],
  },
  {
    id: 'iq_tech_2',
    category: 'Frontend & Web Architecture',
    question: 'Explain how React Concurrent Mode and the Virtual DOM reconciliation algorithm optimize rendering performance.',
    sampleAnswer: 'React uses a fiber architecture where component trees can be processed in prioritized, interruptible chunks using requestIdleCallback/MessageChannel. Reconciliation uses a heuristic O(n) diffing algorithm comparing element types and stable keys.',
    keyPointsToCover: [
      'Fiber data structure and double buffering',
      'Cooperative scheduling and high-priority user inputs (startTransition)',
      'Stable key properties preventing unnecessary tree re-mounts',
    ],
  },
  {
    id: 'iq_hr_1',
    category: 'Behavioral & Leadership',
    question: 'Tell me about a time you had a technical disagreement with a teammate or lead. How did you resolve it? (STAR Method)',
    sampleAnswer: 'Situation: We were deciding between GraphQL and REST for our mobile client. Task: As lead backend dev, I was concerned about complex N+1 queries. Action: Instead of arguing preferences, I built a benchmark POC measuring latency, payload sizes, and cache hit ratios, then shared findings transparently. Result: The team reached consensus on REST with tailored sparse fieldsets, shipping 2 weeks ahead of schedule.',
    keyPointsToCover: [
      'Clear Situation, Task, Action, Result (STAR)',
      'Data-driven decision making rather than emotional debate',
      'Respectful collaboration and focus on customer outcomes',
      'Measurable positive delivery impact',
    ],
  },
  {
    id: 'iq_hr_2',
    category: 'Behavioral & Adaptability',
    question: 'Describe a situation where a production incident occurred under your watch. What steps did you take?',
    sampleAnswer: 'Situation: A database migration during off-peak hours caused 504 gateway timeouts. Action: I immediately declared a P0 incident, initiated the pre-planned rollback script to restore DB schema within 4 minutes, updated the status page for customers, and then scheduled a blameless post-mortem. Result: Service restored in 4m30s with zero data loss.',
    keyPointsToCover: [
      'Immediate mitigation and containment before root cause rabbit holes',
      'Transparent stakeholder communication',
      'Blameless culture and preventive safeguards (automated canary testing)',
    ],
  },
];

export const initialSkillMetrics: SkillMetric[] = [
  { name: 'Data Structures & Algorithms', category: 'Technical', score: 86, benchmark: 75, status: 'Advanced', recommendedAction: 'Solve 10 Graph DP problems to reach 95th percentile.' },
  { name: 'System Design & Scalability', category: 'Architecture', score: 72, benchmark: 70, status: 'Proficient', recommendedAction: 'Review Distributed Caching & Event-Driven messaging patterns.' },
  { name: 'Full Stack Frontend (React/TS)', category: 'Technical', score: 92, benchmark: 80, status: 'Advanced', recommendedAction: 'Ready for Senior Frontend Placement drives.' },
  { name: 'Backend & Database Architecture', category: 'Technical', score: 80, benchmark: 75, status: 'Advanced', recommendedAction: 'Practice transaction isolation levels and sharding.' },
  { name: 'Quantitative Aptitude', category: 'Placement', score: 88, benchmark: 78, status: 'Advanced', recommendedAction: 'Maintain speed with weekly 15-minute speed drills.' },
  { name: 'Logical & Analytical Reasoning', category: 'Placement', score: 84, benchmark: 76, status: 'Advanced', recommendedAction: 'Review advanced seating arrangement puzzles.' },
  { name: 'Verbal & Behavioral Communication', category: 'Soft Skills', score: 78, benchmark: 74, status: 'Proficient', recommendedAction: 'Record 2 more mock interviews focusing on concise STAR transitions.' },
  { name: 'DevOps, Docker & CI/CD', category: 'Tools', score: 68, benchmark: 72, status: 'Needs Practice', recommendedAction: 'Complete hands-on containerization and GitHub Actions workflow module.' },
];

export const initialCertificates: Certificate[] = [
  {
    id: 'cert_dsa_2025',
    title: 'Certified Technical Algorithms Specialist (Level II)',
    recipientName: 'Rajarajan B.',
    issuedBy: 'SkillsPro Accreditation Council',
    issueDate: 'August 18, 2025',
    certificateNumber: 'SKP-2025-DSA-9842',
    grade: 'A+ with Distinction (94.2%)',
    skills: ['DSA', 'Dynamic Programming', 'Graph Theory', 'Time Optimization'],
    track: 'Data Structures & Algorithms Track',
    verificationUrl: 'https://skillspro.edu/verify/SKP-2025-DSA-9842',
  },
  {
    id: 'cert_react_2025',
    title: 'Enterprise React & Full Stack Architect',
    recipientName: 'Rajarajan B.',
    issuedBy: 'SkillsPro Engineering Institute',
    issueDate: 'September 12, 2025',
    certificateNumber: 'SKP-2025-FS-4410',
    grade: 'Honor Roll (92.8%)',
    skills: ['React 19', 'TypeScript', 'State Management', 'Micro-frontends'],
    track: 'Full Stack Web Engineering',
    verificationUrl: 'https://skillspro.edu/verify/SKP-2025-FS-4410',
  },
  {
    id: 'cert_apt_2025',
    title: 'National Campus Placement Aptitude Benchmark',
    recipientName: 'Rajarajan B.',
    issuedBy: 'National Placement Assessment Board',
    issueDate: 'July 05, 2025',
    certificateNumber: 'SKP-2025-APT-7721',
    grade: 'Tier-1 Elite (96.4th Percentile)',
    skills: ['Speed Math', 'Quantitative Aptitude', 'Critical Reasoning', 'Data Interpretation'],
    track: 'Campus Placement Readiness',
    verificationUrl: 'https://skillspro.edu/verify/SKP-2025-APT-7721',
  },
];

export const initialNotes: Note[] = [
  {
    id: 'note_1',
    title: 'Fast Bit Manipulation Tricks for Coding Interviews',
    category: 'Algorithms',
    tags: ['Bitwise', 'DSA', 'Interview Tricks'],
    content: `# Essential Bitwise Formulas
1. Check if power of two: \`(n > 0) && (n & (n - 1)) == 0\`
2. Clear lowest set bit: \`n = n & (n - 1)\`
3. Get lowest set bit: \`diff = n & (-n)\`
4. XOR properties:
   - \`x ^ x = 0\`
   - \`x ^ 0 = x\`
   - Ideal for finding single non-repeating number!`,
    updatedAt: '2 hours ago',
    isPinned: true,
  },
  {
    id: 'note_2',
    title: 'STAR Method Template for Behavioral Rounds',
    category: 'Interviews',
    tags: ['HR', 'Behavioral', 'STAR'],
    content: `## The STAR Framework Structure
- **Situation**: Context in 20-30 seconds.
- **Task**: The exact challenge or metric that needed improvement.
- **Action**: 70% of answer! What *I* specifically did (not just "the team").
- **Result**: Quantifiable business impact (% latency reduced, $ saved, on-time delivery).`,
    updatedAt: 'Yesterday',
    isPinned: true,
  },
  {
    id: 'note_3',
    title: 'SQL Window Functions & Indexing Quick Guide',
    category: 'Databases',
    tags: ['SQL', 'PostgreSQL', 'Performance'],
    content: `\`\`\`sql
-- Running total example
SELECT employee_id, department, salary,
       SUM(salary) OVER (PARTITION BY department ORDER BY hire_date) as running_dept_salary,
       DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as salary_rank
FROM employees;
\`\`\`
Always ensure composite index order matches: \`(equality_column, range_column)\`.`,
    updatedAt: '3 days ago',
    isPinned: false,
  },
];

export const initialBatches: StaffBatch[] = [
  {
    id: 'batch_cse_a_2025',
    name: 'CSE Class 2025 - Section A (Alpha Batch)',
    department: 'Computer Science & Engineering',
    year: 2025,
    totalStudents: 64,
    averageAptitude: 84.5,
    averageCoding: 79.2,
    placementReadinessRate: 88,
    topPerformers: [
      { id: 'usr_student_1', name: 'Rajarajan B.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', score: 94.5, rank: 1 },
      { id: 'p2', name: 'Ananya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', score: 92.1, rank: 2 },
      { id: 'p3', name: 'Karthik Raman', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', score: 89.8, rank: 3 },
    ],
  },
  {
    id: 'batch_it_b_2025',
    name: 'Information Technology 2025 - Batch B',
    department: 'Information Technology',
    year: 2025,
    totalStudents: 58,
    averageAptitude: 76.2,
    averageCoding: 71.4,
    placementReadinessRate: 74,
    topPerformers: [
      { id: 'p4', name: 'Deepak Verma', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', score: 88.4, rank: 1 },
      { id: 'p5', name: 'Meera Nair', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', score: 86.9, rank: 2 },
    ],
  },
];

export const initialStudentReports: StudentProgressReport[] = [
  {
    studentId: 'usr_student_1',
    studentName: 'Rajarajan B.',
    email: 'rajarajanbalamurugan2021@gmail.com',
    batch: 'CSE 2025 - Sec A',
    attendancePercent: 96,
    coursesCompleted: 3,
    codingProblemsSolved: 142,
    aptitudeScoreAvg: 88.5,
    mockInterviewsDone: 6,
    jobSimulationsCompleted: 2,
    overallReadiness: 94,
    lastActive: '10 mins ago',
    status: 'Ready for Placements',
  },
  {
    studentId: 'p2',
    studentName: 'Ananya Sharma',
    email: 'ananya.s@campus.edu',
    batch: 'CSE 2025 - Sec A',
    attendancePercent: 94,
    coursesCompleted: 3,
    codingProblemsSolved: 130,
    aptitudeScoreAvg: 91.0,
    mockInterviewsDone: 5,
    jobSimulationsCompleted: 2,
    overallReadiness: 92,
    lastActive: '1 hour ago',
    status: 'Ready for Placements',
  },
  {
    studentId: 'p3',
    studentName: 'Karthik Raman',
    email: 'karthik.r@campus.edu',
    batch: 'CSE 2025 - Sec A',
    attendancePercent: 88,
    coursesCompleted: 2,
    codingProblemsSolved: 98,
    aptitudeScoreAvg: 82.0,
    mockInterviewsDone: 4,
    jobSimulationsCompleted: 1,
    overallReadiness: 85,
    lastActive: '4 hours ago',
    status: 'Active',
  },
  {
    studentId: 'p6',
    studentName: 'Rohan Gupta',
    email: 'rohan.g@campus.edu',
    batch: 'IT 2025 - Sec B',
    attendancePercent: 71,
    coursesCompleted: 1,
    codingProblemsSolved: 32,
    aptitudeScoreAvg: 58.0,
    mockInterviewsDone: 1,
    jobSimulationsCompleted: 0,
    overallReadiness: 56,
    lastActive: '3 days ago',
    status: 'Needs Attention',
  },
];

export const initialAdminStats: AdminStats = {
  totalStudents: 1240,
  totalStaff: 48,
  activePlacementDrives: 18,
  averagePlacementReadiness: 81.4,
  partnerCompaniesCount: 94,
  assessmentsConducted: 4280,
  hiringPartners: [
    { name: 'Google', logo: '🌐', openings: 12, avgCtcLpa: 32.5 },
    { name: 'Microsoft', logo: '💻', openings: 18, avgCtcLpa: 28.0 },
    { name: 'Amazon', logo: '📦', openings: 25, avgCtcLpa: 26.5 },
    { name: 'Goldman Sachs', logo: '🏦', openings: 8, avgCtcLpa: 24.0 },
    { name: 'Atlassian', logo: '🚀', openings: 6, avgCtcLpa: 35.0 },
    { name: 'Cisco Systems', logo: '📡', openings: 20, avgCtcLpa: 19.5 },
  ],
  recentActivities: [
    { id: 'act_1', user: 'Rajarajan B.', role: 'student', action: 'Passed Fintech Idempotency Bug Job Simulation Task 1', timestamp: '12m ago', type: 'success' },
    { id: 'act_2', user: 'Dr. Sarah Jenkins', role: 'staff', action: 'Published Quantitative Speed Math Assessment to Batch 2025-A', timestamp: '45m ago', type: 'info' },
    { id: 'act_3', user: 'Goldman Sachs', role: 'admin', action: 'Shortlisted 24 students for upcoming Technical Interview Slot', timestamp: '2h ago', type: 'success' },
    { id: 'act_4', user: 'System Watchdog', role: 'admin', action: 'Automated code sandbox completed 350 test runs with 99.8% uptime', timestamp: '3h ago', type: 'info' },
  ],
};

export const initialJobs: JobItem[] = [
  {
    id: 'job_google_swe',
    company: 'Google',
    role: 'Software Engineer (Early Career / University Graduate)',
    location: 'Bangalore / Hyderabad / Remote',
    type: 'Full-time',
    salaryLpa: 32.5,
    description: 'Work across large-scale distributed systems, search infra, Android OS, and cloud architectures.',
    requirements: ['Data Structures & Algorithms', 'C++ or Java or Python or Go', 'Distributed Systems'],
    deadline: '2025-10-31',
    badge: 'Super Dream',
    openings: 12,
  },
  {
    id: 'job_msft_swe',
    company: 'Microsoft',
    role: 'Full Stack & Azure Cloud Associate',
    location: 'Hyderabad / Noida',
    type: 'Full-time',
    salaryLpa: 28.0,
    description: 'Build enterprise cloud services, TypeScript frontends, and AI orchestration pipelines in Azure.',
    requirements: ['React / TypeScript', 'C# or Node.js', 'System Design fundamentals'],
    deadline: '2025-11-15',
    badge: 'Tier-1 Elite',
    openings: 18,
  },
  {
    id: 'job_amazon_sde',
    company: 'Amazon',
    role: 'Software Development Engineer I (SDE-1)',
    location: 'Bangalore / Chennai',
    type: 'Full-time',
    salaryLpa: 26.5,
    description: 'Develop high-throughput e-commerce microservices, payment gateways, and AWS cloud workflows.',
    requirements: ['Java or C++', 'Object Oriented Design', 'Concurrency & Low-Level Design'],
    deadline: '2025-11-30',
    badge: 'Product Giant',
    openings: 25,
  },
  {
    id: 'job_goldman_swe',
    company: 'Goldman Sachs',
    role: 'Engineering & Quant Systems Analyst',
    location: 'Bangalore',
    type: 'Full-time',
    salaryLpa: 24.0,
    description: 'Build ultra-low latency transaction processing, risk analysis models, and financial telemetry.',
    requirements: ['Core Java or C++', 'Relational Databases & SQL', 'Analytical Reasoning'],
    deadline: '2025-10-25',
    badge: 'Global FinTech',
    openings: 8,
  },
];

export const initialJobApplications: JobApplication[] = [
  {
    id: 'app_1',
    jobId: 'job_google_swe',
    userId: 'usr_student_1',
    company: 'Google',
    role: 'Software Engineer (Early Career)',
    status: 'shortlisted',
    appliedDate: '2025-09-20',
  },
  {
    id: 'app_2',
    jobId: 'job_msft_swe',
    userId: 'usr_student_1',
    company: 'Microsoft',
    role: 'Full Stack & Azure Cloud Associate',
    status: 'under_review',
    appliedDate: '2025-09-25',
  },
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'usr_student_1',
    title: 'Shortlisted for Google Technical Screening!',
    message: 'Your profile and DSA benchmark score (86%) met the eligibility criteria for the upcoming slot.',
    type: 'success',
    read: false,
    createdAt: '10 mins ago',
  },
  {
    id: 'notif_2',
    userId: 'usr_student_1',
    title: 'New Aptitude Assessment Assigned',
    message: 'Faculty Dr. Sarah Jenkins published Speed Math & Logical Assessment III for your batch.',
    type: 'info',
    read: false,
    createdAt: '1 hour ago',
  },
  {
    id: 'notif_3',
    userId: 'usr_student_1',
    title: 'Daily Practice Streak Alert',
    message: 'Keep your 14-day streak alive by completing a 5-minute speed quiz today.',
    type: 'warning',
    read: true,
    createdAt: 'Yesterday',
  },
];

export const initialEnrollments: CourseEnrollment[] = [
  {
    id: 'enr_1',
    userId: 'usr_student_1',
    courseId: 'crs_dsa_101',
    progressPercentage: 65,
    completedLessons: ['les_dsa_1_1', 'les_dsa_1_2', 'les_dsa_1_3', 'les_dsa_2_1', 'les_dsa_2_2'],
    enrolledAt: '2025-08-01',
  },
  {
    id: 'enr_2',
    userId: 'usr_student_1',
    courseId: 'crs_fullstack_201',
    progressPercentage: 40,
    completedLessons: ['les_fs_1_1', 'les_fs_1_2'],
    enrolledAt: '2025-08-15',
  },
];

export const initialCodeSubmissions: CodeSubmission[] = [
  {
    id: 'sub_1',
    problemId: 'prob_two_sum',
    userId: 'usr_student_1',
    language: 'javascript',
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) return [map.get(complement), i];
    map.set(nums[i], i);
  }
  return [];
}`,
    status: 'Accepted',
    passedTests: 4,
    totalTests: 4,
    runtimeMs: 42,
    submittedAt: '2025-09-28T14:30:00.000Z',
  },
];

