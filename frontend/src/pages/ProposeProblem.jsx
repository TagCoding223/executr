import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Plus, Trash2, Edit2, Eye, AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';

const ProposeProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'EASY',
    tags: '',
    descriptionMarkdown: '',
  });
  
  const [testCases, setTestCases] = useState([
    { inputData: '', expectedOutput: '', isSample: true }
  ]);

  const [activeTab, setActiveTab] = useState('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Rate Limiting State
  const [isLocked, setIsLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Check LocalStorage for rate limiting on mount
  useEffect(() => {
    const checkRateLimit = () => {
      const lastSubmit = localStorage.getItem('executr_last_proposal');
      if (lastSubmit) {
        const submitTime = new Date(lastSubmit).getTime();
        const now = new Date().getTime();
        const hoursPassed = (now - submitTime) / (1000 * 60 * 60);

        if (hoursPassed < 24) {
          setIsLocked(true);
          const hoursLeft = Math.ceil(24 - hoursPassed);
          setTimeRemaining(`${hoursLeft} hour${hoursLeft > 1 ? 's' : ''}`);
        } else {
          setIsLocked(false);
          localStorage.removeItem('executr_last_proposal');
        }
      }
    };
    checkRateLimit();
  }, []);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { inputData: '', expectedOutput: '', isSample: false }]);
  };

  const handleRemoveTestCase = (index) => {
    if (testCases.length > 1) {
      setTestCases(testCases.filter((_, i) => i !== index));
    }
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLocked) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8080/api/problems/public/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          testCases
        }),
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded: You can only submit 3 proposals per 24 hours.');
      }
      if (!response.ok) {
        throw new Error('Failed to submit proposal. Please try again.');
      }

      // Lock client for 24h to prevent spamming
      localStorage.setItem('executr_last_proposal', new Date().toISOString());
      setShowSuccessModal(true);
      setIsLocked(true);
      setTimeRemaining('24 hours');

    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Contribute a Problem</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Submit your algorithm challenge to be featured on Executr.</p>
        </div>

        {isLocked && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-4 flex items-start gap-3 text-yellow-700 dark:text-yellow-500">
            <Lock className="shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold">Submission Limit Reached</h3>
              <p className="text-sm mt-1">You have reached the daily limit for problem proposals. You can submit another problem in approximately {timeRemaining}.</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl p-4 flex items-center gap-3 text-red-600 dark:text-red-400">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Info */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Problem Title *</label>
              <input
                required
                disabled={isLocked || isSubmitting}
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                placeholder="e.g., Two Sum"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Difficulty *</label>
                <select
                  disabled={isLocked || isSubmitting}
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tags (comma separated)</label>
                <input
                  disabled={isLocked || isSubmitting}
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  placeholder="Arrays, Hash Table, Math"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Markdown Editor */}
          <div className="bg-white dark:bg-[#12141C] rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14] px-4 pt-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'write' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Edit2 size={16} /> Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'preview' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Eye size={16} /> Preview
              </button>
            </div>
            
            <div className="p-4">
              {activeTab === 'write' ? (
                <textarea
                  required
                  disabled={isLocked || isSubmitting}
                  value={formData.descriptionMarkdown}
                  onChange={(e) => setFormData({...formData, descriptionMarkdown: e.target.value})}
                  rows="10"
                  className="w-full p-4 bg-gray-50 dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm resize-y disabled:opacity-50"
                  placeholder="Describe the problem, input format, and constraints using Markdown..."
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none min-h-62.5 p-4 bg-gray-50 dark:bg-[#1A1D24] rounded-lg border border-gray-300 dark:border-gray-700">
                  {formData.descriptionMarkdown ? (
                    <ReactMarkdown>{formData.descriptionMarkdown}</ReactMarkdown>
                  ) : (
                    <span className="text-gray-500 italic">Nothing to preview.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Test Cases */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Test Cases</h3>
              <button
                type="button"
                disabled={isLocked || isSubmitting}
                onClick={handleAddTestCase}
                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                <Plus size={16} /> Add Test Case
              </button>
            </div>

            {testCases.map((tc, index) => (
              <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#0B0D14] space-y-3 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-500">Test Case {index + 1}</span>
                  {testCases.length > 1 && (
                    <button
                      type="button"
                      disabled={isLocked || isSubmitting}
                      onClick={() => handleRemoveTestCase(index)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1">Input Data</label>
                    <textarea
                      required
                      disabled={isLocked || isSubmitting}
                      value={tc.inputData}
                      onChange={(e) => handleTestCaseChange(index, 'inputData', e.target.value)}
                      className="w-full p-2 text-sm font-mono bg-white dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Expected Output</label>
                    <textarea
                      required
                      disabled={isLocked || isSubmitting}
                      value={tc.expectedOutput}
                      onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                      className="w-full p-2 text-sm font-mono bg-white dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded focus:ring-1 focus:ring-blue-500 outline-none disabled:opacity-50"
                      rows="3"
                    />
                  </div>
                </div>
                
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    disabled={isLocked || isSubmitting}
                    checked={tc.isSample}
                    onChange={(e) => handleTestCaseChange(index, 'isSample', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300">Mark as Sample (Visible to users)</span>
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLocked || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin"/> Submitting...</> : 'Submit Proposal'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl shadow-2xl max-w-md w-full text-center space-y-4">
            <CheckCircle2 size={48} className="text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold">Submission Received!</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Your problem has been queued for review. Our admin team will evaluate it shortly. Thank you for contributing to Executr!
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '/problems'; // Redirect to directory
              }}
              className="mt-4 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Return to Problems
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposeProblem;