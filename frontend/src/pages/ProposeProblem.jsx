import Editor from '@monaco-editor/react';
import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import {
  Plus, AlertCircle, CheckCircle2, Loader2, Lock, Play, Timer, ChevronDown, ChevronRight, ChevronLeft,
  ChevronUp, Trash2, LayoutTemplate
} from 'lucide-react';

const ProposeProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'EASY',
    constraints: '',
    descriptionMarkdown: '',
    solutionLanguage: 'java',
    solutionCode: '',
    testCases: [{ input: '', expectedOutput: '' }]
  });

  // Instant Theme Detection
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
    };
  }, []);

  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  // Track temporary local files mapped to blob URLs
  const [imageFilesMap, setImageFilesMap] = useState(new Map());

  const [testCases, setTestCases] = useState([
    { inputData: '', expectedOutput: '', isSample: true }
  ]);

  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation Execution State
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null); // { success: boolean, message: string }
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const response = await fetch(BACKEND_BASE_URL + 'api/problems/public/propose', {
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

  // Local Image Interceptor (No server requests yet)
  const handleLocalImageInsert = (file) => {
    const blobUrl = URL.createObjectURL(file);

    setImageFilesMap(prev => new Map(prev).set(blobUrl, file));

    const markdownImage = `\n![Diagram](${blobUrl})\n`;
    setFormData(prev => ({
      ...prev,
      descriptionMarkdown: prev.descriptionMarkdown + markdownImage
    }));
  };

  // Handles Ctrl+V / Cmd+V
  const handlePaste = (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) handleLocalImageInsert(file);
      }
    }
  };

  // Handles drag-and-drop
  const handleDrop = (event) => {
    const files = event.dataTransfer?.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        event.preventDefault();
        handleLocalImageInsert(files[i]);
      }
    }
  };

  // 1. Send code + test cases to execution engine
  const handleRunValidation = async () => {
    setIsValidating(true);
    setValidationResult(null);

    try {
      const response = await fetch(BACKEND_BASE_URL + 'api/problems/public/validate-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: formData.solutionLanguage,
          code: formData.solutionCode,
          testCases: formData.testCases
        })
      });

      const data = await response.json();

      if (data.allPassed) {
        setValidationResult({ success: true, message: 'All test cases passed! Proposal unlocked.' });
      } else {
        setValidationResult({ success: false, message: `Failed at test case ${data.failedIndex + 1}: ${data.errorMessage}` });
      }
    } catch (err) {
      setValidationResult({ success: false, message: 'Execution server error. Try again.' });
    } finally {
      setIsValidating(false);
    }
  };

  // 2. Extract valid images, upload to Cloudinary, submit proposal
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      let updatedMarkdown = formData.descriptionMarkdown;

      // Extract only blob URLs remaining in active markdown text
      for (const [blobUrl, file] of imageFilesMap.entries()) {
        if (updatedMarkdown.includes(blobUrl)) {
          // Upload active image to Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(file);
          // Swap blob URL with Cloudinary CDN URL
          updatedMarkdown = updatedMarkdown.replaceAll(blobUrl, cloudinaryUrl);
        }
        // Free browser memory for deleted or processed blobs
        URL.revokeObjectURL(blobUrl);
      }

      // Final POST to Spring Boot backend
      const payload = { ...formData, descriptionMarkdown: updatedMarkdown };
      await fetch(BACKEND_BASE_URL + 'api/problems/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      alert('Proposal submitted successfully!');
    } catch (err) {
      alert('Failed to submit proposal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cloudinary direct upload helper
  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'YOUR_CLOUDINARY_PRESET'); // Replace with your preset

    const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    return json.secure_url;
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-[#0B0D14] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                  placeholder="Arrays, Hash Table, Math"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Markdown Editor */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <label className="block text-sm font-medium">Problem Description & Constraints *</label>

            {/* 
              We use two wrappers with Tailwind's hidden/block classes 
              to ensure the editor perfectly respects your Dark/Light mode toggle.
            */}

            {/* Light Mode Editor */}
            <div data-color-mode="light" className="dark:hidden">
              <MDEditor
                value={formData.descriptionMarkdown}
                onChange={(val) => setFormData({ ...formData, descriptionMarkdown: val || '' })}
                height={400}
                preview="live"
                className="border-gray-300!"
                textareaProps={{
                  onPaste: handlePaste,
                  onDrop: handleDrop,
                  onDragOver: (e) => e.preventDefault()
                }}
              />
            </div>

            {/* Dark Mode Editor */}
            <div data-color-mode="dark" className="hidden dark:block">
              <MDEditor
                value={formData.descriptionMarkdown}
                onChange={(val) => setFormData({ ...formData, descriptionMarkdown: val || '' })}
                height={400}
                preview="live"
                style={{ backgroundColor: '#1A1D24' }}
                textareaProps={{
                  onPaste: handlePaste,
                  onDrop: handleDrop,
                  onDragOver: (e) => e.preventDefault()
                }}
              />
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

          {/* Section 4: Constraints Input */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-2">
            <label className="block text-sm font-medium">Constraints *</label>

            <textarea
              rows={3}
              value={formData.constraints}
              onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
              placeholder={`1 <= N <= 10^5\n1 <= A[i] <= 10^9`}
              className="w-full p-3 bg-gray-50 dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Section 5: Reference Solution Editor */}
          <div className="bg-white dark:bg-[#12141C] p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Reference Solution (With Main Method)</h3>
                <p className="text-xs text-gray-500">Provide a complete solution capable of parsing input and validating output.</p>
              </div>

              {/* Language Selector */}
              <select
                value={formData.solutionLanguage}
                onChange={(e) => {
                  setFormData({ ...formData, solutionLanguage: e.target.value });
                  setValidationResult(null); // Reset gate on change
                }}
                className="p-2 bg-gray-50 dark:bg-[#1A1D24] border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium"
              >
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>

            <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
              <Editor
                height="320px"
                language={formData.solutionLanguage === 'cpp' ? 'cpp' : formData.solutionLanguage}
                value={formData.solutionCode}
                onChange={(val) => {
                  setFormData({ ...formData, solutionCode: val || '' });
                  setValidationResult(null); // Reset validation gate on edit
                }}
                theme={isDark ? 'vs-dark' : 'light'}
                options={{ minimap: { enabled: false }, fontSize: 14 }}
              />
            </div>

            {/* Test & Validation Gate Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleRunValidation}
                disabled={isValidating || !formData.solutionCode.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                Validate Solution Against Test Cases
              </button>

              {/* Status Indicator */}
              {validationResult && (
                <div className={`flex items-center gap-2 text-sm font-medium ${validationResult.success ? 'text-green-500' : 'text-red-500'}`}>
                  {validationResult.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <span>{validationResult.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Final Submit Proposal Button */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={!validationResult?.success || isSubmitting}
              className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-base font-semibold shadow-lg transition-all"
            >
              {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
              Submit Proposal
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