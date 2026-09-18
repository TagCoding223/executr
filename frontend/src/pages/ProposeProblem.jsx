import { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2, Lock } from 'lucide-react';

const ProposeProblem = () => {
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'EASY',
    tags: '',
    descriptionMarkdown: '',
  });

  const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

  const [testCases, setTestCases] = useState([
    { inputData: '', expectedOutput: '', isSample: true }
  ]);

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

  // Handles Ctrl+V / Cmd+V
  const handlePaste = async (event) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      // Check if the pasted item is an image
      if (item.type.indexOf('image') === 0) {
        event.preventDefault(); // Stop the default Base64 string from pasting
        const file = item.getAsFile();
        if (file) await uploadImage(file);
      }
    }
  };

  // Handles drag-and-drop
  const handleDrop = async (event) => {
    const files = event.dataTransfer?.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.indexOf('image') === 0) {
        event.preventDefault(); // Stop the browser from opening the image in a new tab
        await uploadImage(file);
      }
    }
  };

  // The actual upload logic
  const uploadImage = async (file) => {
    try {
      // Temporarily append a loading message so the user knows it's working
      const placeholder = `\n![Uploading image...]()\n`;
      setFormData(prev => ({
        ...prev,
        descriptionMarkdown: prev.descriptionMarkdown + placeholder
      }));

      const payload = new FormData();
      payload.append('image', file);

      // POST to your Spring Boot AWS S3 endpoint (we will build this next)
      const response = await fetch(BACKEND_BASE_URL + 'api/problems/public/upload-image', {
        method: 'POST',
        body: payload
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();

      // Replace the placeholder with the real AWS S3 URL
      setFormData(prev => ({
        ...prev,
        descriptionMarkdown: prev.descriptionMarkdown.replace(placeholder, `\n![Problem Diagram](${data.imageUrl})\n`)
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      // Remove placeholder on failure
      setFormData(prev => ({
        ...prev,
        descriptionMarkdown: prev.descriptionMarkdown.replace(`\n![Uploading image...]()\n`, '')
      }));
      alert("Failed to upload image.");
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

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLocked || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Submit Proposal'}
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