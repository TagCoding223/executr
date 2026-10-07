import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Save, CheckCircle2, XCircle, Loader2, Plus, Trash2 } from 'lucide-react';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const AdminProposalReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  
  const [proposal, setProposal] = useState({
    title: '',
    difficulty: 'EASY',
    descriptionMarkdown: '',
    constraints: '',
    solutionLanguage: 'java',
    solutionCode: '',
    testCases: []
  });

  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(document.documentElement.classList.contains('dark')));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProposal = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${BACKEND_BASE_URL}api/admin/proposals/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          // Ensure arrays/nulls are handled safely
          setProposal({
            ...data,
            constraints: data.constraints || '',
            solutionLanguage: data.solutionLanguage || 'java',
            solutionCode: data.solutionCode || '',
            testCases: data.testCases || []
          });
        } else {
          alert('Failed to load proposal details.');
          navigate('/admin');
        }
      } catch (error) {
        console.error("Error fetching proposal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProposal();
  }, [id, navigate]);

  const handleUpdateDB = async () => {
    setIsProcessing(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BACKEND_BASE_URL}api/admin/proposals/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(proposal)
      });
      if (response.ok) alert("Proposal updated in database successfully!");
      else alert("Failed to update proposal.");
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAction = async (action) => {
    setIsProcessing(true);
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BACKEND_BASE_URL}api/admin/proposals/${id}/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: action === 'reject' ? JSON.stringify({ feedback: "Does not meet platform guidelines." }) : null
      });
      if (response.ok) {
        navigate('/admin');
      } else {
        alert(`Failed to ${action} proposal.`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...proposal.testCases];
    updatedTestCases[index][field] = value;
    setProposal({ ...proposal, testCases: updatedTestCases });
  };

  if (isLoading) {
    return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-3xl font-bold">Review Proposal</h1>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleUpdateDB}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
            >
              <Save size={18} /> Update & Save
            </button>
          </div>
        </div>

        {/* Editable Fields Form */}
        <div className="space-y-6">
          
          {/* Title & Difficulty */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Problem Title</label>
                <input
                  type="text"
                  value={proposal.title}
                  onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Difficulty</label>
                <select
                  value={proposal.difficulty}
                  onChange={(e) => setProposal({ ...proposal, difficulty: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg outline-none"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Markdown */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <label className="block text-sm font-medium">Description</label>
            <div data-color-mode="light" className="dark:hidden">
              <MDEditor value={proposal.descriptionMarkdown} onChange={(val) => setProposal({ ...proposal, descriptionMarkdown: val || '' })} height={300} />
            </div>
            <div data-color-mode="dark" className="hidden dark:block">
              <MDEditor value={proposal.descriptionMarkdown} onChange={(val) => setProposal({ ...proposal, descriptionMarkdown: val || '' })} height={300} style={{ backgroundColor: '#1A1D24' }} />
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <label className="block text-sm font-medium">Constraints</label>
            <textarea
              rows={3}
              value={proposal.constraints}
              onChange={(e) => setProposal({ ...proposal, constraints: e.target.value })}
              className="w-full p-3 bg-gray-50 dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg font-mono text-sm outline-none"
            />
          </div>

          {/* Solution Editor */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Sample/Reference Solution</label>
              <select
                value={proposal.solutionLanguage}
                onChange={(e) => setProposal({ ...proposal, solutionLanguage: e.target.value })}
                className="p-2 bg-gray-50 dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              >
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <Editor
                height="300px"
                language={proposal.solutionLanguage === 'cpp' ? 'cpp' : proposal.solutionLanguage}
                value={proposal.solutionCode}
                onChange={(val) => setProposal({ ...proposal, solutionCode: val || '' })}
                theme={isDark ? 'vs-dark' : 'light'}
                options={{ minimap: { enabled: false } }}
              />
            </div>
          </div>

          {/* Test Cases */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Test Cases</h3>
              <button
                onClick={() => setProposal({ ...proposal, testCases: [...proposal.testCases, { inputData: '', expectedOutput: '', sample: false }] })}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <Plus size={16} /> Add Test Case
              </button>
            </div>
            
            {proposal.testCases.map((tc, idx) => (
              <div key={idx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1A1D24] relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-gray-500">Test Case {idx + 1}</span>
                  <button
                    onClick={() => setProposal({ ...proposal, testCases: proposal.testCases.filter((_, i) => i !== idx) })}
                    className="text-red-500 hover:text-red-700"
                  ><Trash2 size={16} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Input</label>
                    <textarea
                      value={tc.inputData}
                      onChange={(e) => handleTestCaseChange(idx, 'inputData', e.target.value)}
                      className="w-full p-2 text-sm font-mono bg-white dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded outline-none"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Expected Output</label>
                    <textarea
                      value={tc.expectedOutput}
                      onChange={(e) => handleTestCaseChange(idx, 'expectedOutput', e.target.value)}
                      className="w-full p-2 text-sm font-mono bg-white dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded outline-none"
                      rows="3"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    checked={tc.sample}
                    onChange={(e) => handleTestCaseChange(idx, 'sample', e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="text-sm">Mark as Sample</span>
                </label>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-4 pt-4 pb-12">
            <button 
              disabled={isProcessing}
              onClick={() => handleAction('reject')}
              className="flex items-center gap-2 px-6 py-3 text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 rounded-xl font-bold transition-colors"
            >
              <XCircle size={20} /> Reject Proposal
            </button>
            <button 
              disabled={isProcessing}
              onClick={() => handleAction('approve')}
              className="flex items-center gap-2 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors shadow-lg"
            >
              {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
              Approve & Publish to Problems
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProposalReview;