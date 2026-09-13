import React, { useState } from 'react';
import { ShieldCheck, Clock, CheckCircle2, XCircle, Search, Eye } from 'lucide-react';

// Mock Data for Phase 1 Design
const PENDING_PROPOSALS = [
  { id: 1, title: 'Find the Minimum Window Substring', difficulty: 'Hard', ip: '192.168.1.1', date: '2 hours ago' },
  { id: 2, title: 'Validate IP Address', difficulty: 'Medium', ip: '10.0.0.5', date: '5 hours ago' },
];

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const openReview = (proposal) => {
    setSelectedProposal(proposal);
    setReviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4">
          <ShieldCheck size={32} className="text-blue-600" />
          <h1 className="text-3xl font-bold">Admin Workspace</h1>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Review</p>
              <p className="text-3xl font-bold">{PENDING_PROPOSALS.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-lg"><Clock size={24} /></div>
          </div>
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Approved Today</p>
              <p className="text-3xl font-bold text-green-600">4</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg"><CheckCircle2 size={24} /></div>
          </div>
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Rejected Today</p>
              <p className="text-3xl font-bold text-red-600">1</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg"><XCircle size={24} /></div>
          </div>
        </div>

        {/* Proposal Queue */}
        <div className="bg-white dark:bg-[#12141C] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#0B0D14]">
            <h2 className="text-lg font-semibold">Submission Queue</h2>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 text-sm bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-[#1A1D24] text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Difficulty</th>
                <th className="px-6 py-3 font-medium">Submitter IP</th>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {PENDING_PROPOSALS.map(prop => (
                <tr key={prop.id} className="hover:bg-gray-50 dark:hover:bg-[#1A1D24]/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{prop.title}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      prop.difficulty === 'Hard' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {prop.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-gray-500">{prop.ip}</td>
                  <td className="px-6 py-4 text-gray-500">{prop.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openReview(prop)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors font-medium"
                    >
                      <Eye size={14} /> Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Review Modal Skeleton */}
      {reviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12141C] w-full max-w-4xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Review: {selectedProposal?.title}</h2>
              <button onClick={() => setReviewModalOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white"><XCircle size={24} /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <p className="text-gray-500 text-sm">Markdown Preview and Test Cases will render here...</p>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14] flex justify-end gap-3 rounded-b-xl">
              <button className="px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-md font-medium">Reject</button>
              <button className="px-4 py-2 text-white bg-green-600 rounded-md font-medium">Approve & Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;