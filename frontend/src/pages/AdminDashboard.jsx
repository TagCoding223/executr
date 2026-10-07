import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, CheckCircle2, XCircle, Search, Eye, Loader2 } from 'lucide-react';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, proposalsRes] = await Promise.all([
        fetch(BACKEND_BASE_URL + 'api/admin/stats', { headers }),
        fetch(BACKEND_BASE_URL + 'api/admin/proposals/pending', { headers })
      ]);

      if (statsRes.ok && proposalsRes.ok) {
        setStats(await statsRes.json());
        setProposals(await proposalsRes.json());
      }
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openReview = (proposal) => {
    navigate(`/admin/proposal/${proposal.id}`);
  };

  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <ShieldCheck size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold">Admin Workspace</h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-3xl font-bold">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-lg"><Clock size={24} /></div>
          </div>
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg"><CheckCircle2 size={24} /></div>
          </div>
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg"><XCircle size={24} /></div>
          </div>
        </div>

        {/* Proposal Queue */}
        <div className="bg-white dark:bg-[#12141C] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Submission Queue</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search proposals..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-gray-700 rounded-md outline-none"
              />
            </div>
          </div>
          
          {filteredProposals.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No pending proposals found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-[#1A1D24] text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Difficulty</th>
                  <th className="px-6 py-3 font-medium">Submitter IP</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredProposals.map(prop => (
                  <tr key={prop.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1D24]/50">
                    <td className="px-6 py-4 font-medium">{prop.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800">
                        {prop.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-500">{prop.submitterIp}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => openReview(prop)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md hover:bg-blue-100 font-medium"
                      >
                        <Eye size={14} /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;