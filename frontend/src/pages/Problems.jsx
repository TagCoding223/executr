import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Circle,
  Loader2
} from 'lucide-react';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;
const ITEMS_PER_PAGE = 10;

const Problems = () => {
  const navigate = useNavigate();
  
  // State
  const [problems, setProblems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search input to avoid excessive API requests on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new search query
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch paginated & searched problems from backend
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      try {
        let url = `${BACKEND_BASE_URL}api/problems?page=${currentPage}&size=${ITEMS_PER_PAGE}`;
        if (debouncedSearch.trim()) {
          url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
        }

        const response = await fetch(url, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });

        if (response.ok) {
          const data = await response.json();
          setProblems(data.content || []);
          setTotalPages(data.totalPages || 1);
          setTotalElements(data.totalElements || 0);
        } else {
          console.error("Failed to fetch problems");
        }
      } catch (error) {
        console.error("Error connecting to problems API", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [currentPage, debouncedSearch]);

  const getDifficultyColor = (difficulty) => {
    const diff = difficulty?.toUpperCase();
    switch (diff) {
      case 'EASY': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'HARD': return 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const handleRowClick = (id) => {
    navigate(`/problem/${id}`);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

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
              placeholder="Search problems by title..." 
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
        <div className="bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden mb-6 relative min-h-75">
          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-white/50 dark:bg-[#12141C]/50 backdrop-blur-xs z-10">
              <Loader2 className="animate-spin text-blue-600" size={36} />
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1A1D24] border-b border-gray-200 dark:border-gray-800 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  <th className="px-4 py-4 w-12 text-center">Status</th>
                  <th className="px-4 py-4">Title</th>
                  <th className="px-4 py-4 w-28 text-center">Difficulty</th>
                  <th className="px-4 py-4 hidden md:table-cell">Acceptance</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {problems.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-gray-500">No problems found matching your search.</td>
                  </tr>
                ) : (
                  problems.map((problem) => (
                    <tr 
                      key={problem.id}
                      onClick={() => handleRowClick(problem.id)}
                      className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-[#1A1D24] transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-4 text-center">
                        <Circle size={18} className="text-gray-300 dark:text-gray-600 mx-auto group-hover:text-gray-400 transition-colors" />
                      </td>
                      <td className="px-4 py-4 font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {problem.id}. {problem.title}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(problem.difficulty)}`}>
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        {problem.totalAttempts > 0 
                          ? `${((problem.successfulAttempts / problem.totalAttempts) * 100).toFixed(1)}%` 
                          : '0.0%'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between bg-white dark:bg-[#12141C] border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 shadow-sm">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-900 dark:text-white">{totalElements > 0 ? startIndex + 1 : 0}</span> to <span className="font-semibold text-gray-900 dark:text-white">{Math.min(startIndex + ITEMS_PER_PAGE, totalElements)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalElements}</span> problems
          </span>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-sm font-medium px-2 text-gray-900 dark:text-white">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || isLoading}
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