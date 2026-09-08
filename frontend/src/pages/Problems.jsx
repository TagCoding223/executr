import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle,
  Building2
} from 'lucide-react';

// Dummy Data Generation
const generateDummyProblems = () => {
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const companies = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Netflix', 'Uber'];
  const problems = [];
  
  for (let i = 1; i <= 45; i++) {
    // Randomize some data for visual variety
    const diff = difficulties[Math.floor(Math.random() * difficulties.length)];
    const numCompanies = Math.floor(Math.random() * 3) + 1;
    const comps = [...companies].sort(() => 0.5 - Math.random()).slice(0, numCompanies);
    const isSolved = Math.random() > 0.7;

    problems.push({
      id: i,
      title: `Algorithm Challenge ${i}: ${['Two Sum', 'Reverse List', 'Merge Intervals', 'Graph Traversal', 'Dynamic Knapsack'][Math.floor(Math.random() * 5)]}`,
      difficulty: diff,
      companies: comps,
      status: isSolved ? 'solved' : 'unsolved',
      acceptance: (Math.random() * 40 + 30).toFixed(1) + '%'
    });
  }
  return problems;
};

const DUMMY_PROBLEMS = generateDummyProblems();
const ITEMS_PER_PAGE = 10;

const Problems = () => {
  const navigate = useNavigate();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination Logic
  const totalPages = Math.ceil(DUMMY_PROBLEMS.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProblems = DUMMY_PROBLEMS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Helper for difficulty colors
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const handleRowClick = (id) => {
    // This will route to the EditorWorkspace we just built!
    navigate(`/problem/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Problem Directory</h1>
          <p className="text-gray-600 dark:text-gray-400">Master algorithms from top tech companies and prepare for your next interview.</p>
        </div>

        {/* Toolbar (Search & Filter) */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search problems..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-shadow shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1A1D24] transition-colors text-sm font-medium shadow-sm w-full sm:w-auto">
            <Filter size={16} />
            Filters
          </button>
        </div>

        {/* Problems Table Container */}
        <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1A1D24] border-b border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-4 w-12 text-center">Status</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4 w-28 text-center">Difficulty</th>
                  <th className="px-4 py-4 hidden md:table-cell">Companies</th>
                  <th className="px-4 py-4 w-24 text-right hidden sm:table-cell">Acceptance</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {currentProblems.map((problem) => (
                  <tr 
                    key={problem.id}
                    onClick={() => handleRowClick(problem.id)}
                    className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1A1D24] transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-4 text-center">
                      {problem.status === 'solved' ? (
                        <CheckCircle2 size={18} className="text-green-500 mx-auto" />
                      ) : (
                        <Circle size={18} className="text-gray-300 dark:text-gray-600 mx-auto group-hover:text-gray-400 transition-colors" />
                      )}
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {problem.id}. {problem.title}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-2">
                        {problem.companies.map((company, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded text-xs font-medium border border-gray-200 dark:border-gray-700">
                            <Building2 size={12} className="opacity-70" />
                            {company}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      {problem.acceptance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 shadow-sm">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{startIndex + 1}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(startIndex + ITEMS_PER_PAGE, DUMMY_PROBLEMS.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{DUMMY_PROBLEMS.length}</span> problems
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium px-2 text-gray-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Problems;