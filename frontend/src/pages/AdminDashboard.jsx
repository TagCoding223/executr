import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ShieldCheck, Clock, CheckCircle2, XCircle, Search, Eye, Loader2 } from 'lucide-react';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const AdminDashboard = () => {

  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, proposalsRes] = await Promise.all([
        fetch(BACKEND_BASE_URL+'api/admin/stats', { headers }),
        fetch(BACKEND_BASE_URL+'api/admin/proposals/pending', { headers })
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
    setSelectedProposal(proposal);
    setReviewModalOpen(true);
  };

  const handleAction = async (action) => {
    setIsProcessing(true);
    const token = localStorage.getItem('token');
    
    try {
      const url = BACKEND_BASE_URL+`api/admin/proposals/${selectedProposal.id}/${action}`;
      const options = {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: action === 'reject' ? JSON.stringify({ feedback: "Does not meet platform guidelines." }) : null
      };

      const response = await fetch(url, options);
      
      if (response.ok) {
        setReviewModalOpen(false);
        fetchDashboardData(); // Refresh queue and stats
      } else {
        alert(`Failed to ${action} proposal.`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
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

      {/* Review Modal */}
      {reviewModalOpen && selectedProposal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12141C] w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Review: {selectedProposal.title}</h2>
              <button onClick={() => setReviewModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><XCircle size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{selectedProposal.descriptionMarkdown}</ReactMarkdown>
              </div>
              
              <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
                <h3 className="font-bold mb-4">Test Cases ({selectedProposal.testCases?.length || 0})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProposal.testCases?.map((tc, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-[#1A1D24] rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-xs font-bold text-gray-500 mb-2">TC {idx + 1} {tc.sample ? '(Sample)' : '(Hidden)'}</div>
                      <div className="mb-2"><strong>Input:</strong><pre className="text-xs mt-1 p-2 bg-white dark:bg-[#0B0D14] rounded">{tc.inputData}</pre></div>
                      <div><strong>Expected:</strong><pre className="text-xs mt-1 p-2 bg-white dark:bg-[#0B0D14] rounded">{tc.expectedOutput}</pre></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14] flex justify-end gap-3 rounded-b-xl">
              <button 
                disabled={isProcessing}
                onClick={() => handleAction('reject')}
                className="px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-md font-medium disabled:opacity-50"
              >
                Reject
              </button>
              <button 
                disabled={isProcessing}
                onClick={() => handleAction('approve')}
                className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-md font-medium disabled:opacity-50"
              >
                {isProcessing && <Loader2 size={16} className="animate-spin" />}
                Approve & Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;