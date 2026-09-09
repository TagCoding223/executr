import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
// Updated to exactly match v4 exports
import { Group, Panel, Separator } from 'react-resizable-panels';
import { 
  Play, Timer, ChevronDown, ChevronRight, ChevronLeft, 
  ChevronUp, Plus, Trash2, LayoutTemplate 
} from 'lucide-react';

const EditorWorkspace = ({ mode = 'problem', problemName = 'Two Sum' }) => {
  // UI State
  const [leftPanelOpen, setLeftPanelOpen] = useState(mode === 'problem');
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [activeIoTab, setActiveIoTab] = useState('input');
  
  // Responsive State for Panel Direction
  const [isMobile, setIsMobile] = useState(false);
  
  // Editor State
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}');
  
  // Timer State
  const [time, setTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  // Test Cases State
  const [testCases, setTestCases] = useState([
    { id: 1, name: 'Case 1', input: '[2,7,11,15]\n9', output: '[0,1]' },
    { id: 2, name: 'Case 2', input: '[3,2,4]\n6', output: '[1,2]' }
  ]);
  const [activeCaseId, setActiveCaseId] = useState(1);
  const activeTestCase = testCases.find(tc => tc.id === activeCaseId) || testCases[0];

  // Instant Theme Detection
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile(); 
    window.addEventListener('resize', checkMobile);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Timer Effect
  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleAddTestCase = () => {
    const newId = testCases.length ? Math.max(...testCases.map(t => t.id)) + 1 : 1;
    setTestCases([...testCases, { id: newId, name: `Case ${newId}`, input: '', output: '' }]);
    setActiveCaseId(newId);
  };

  const handleDeleteTestCase = (e, id) => {
    e.stopPropagation(); 
    const filtered = testCases.filter(tc => tc.id !== id);
    setTestCases(filtered);
    if (activeCaseId === id && filtered.length > 0) setActiveCaseId(filtered[0].id);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 dark:bg-[#0B0D14] text-gray-900 dark:text-gray-100 font-sans overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-14 flex items-center justify-between px-2 sm:px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#12141C] shrink-0">
        <div className="hidden sm:flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-200 truncate">
          <LayoutTemplate size={18} className="text-blue-500 shrink-0" />
          <span className="truncate">{mode === 'problem' ? problemName : 'Playground Sandbox'}</span>
        </div>

        <div className="flex flex-1 sm:flex-none justify-start sm:justify-center items-center gap-2 sm:gap-4 ml-2 sm:ml-0">
          <div className="flex items-center bg-gray-100 dark:bg-[#1A1D24] px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700 relative">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent appearance-none outline-none cursor-pointer pr-6 font-medium text-sm z-10 w-full"
            >
              <option value="java" className="dark:bg-gray-800">Java</option>
              <option value="python" className="dark:bg-gray-800">Python</option>
              <option value="cpp" className="dark:bg-gray-800">C++</option>
              <option value="javascript" className="dark:bg-gray-800">JavaScript</option>
            </select>
            <ChevronDown size={14} className="text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button className="flex items-center gap-1 sm:gap-2 px-4 sm:px-5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors shadow-sm text-sm sm:text-base">
            <Play size={16} fill="currentColor" />
            Run
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="font-mono text-sm sm:text-lg w-12 sm:w-16 text-right">
            {formatTime(time)}
          </div>
          <button 
            onClick={() => setTimerRunning(!timerRunning)}
            className={`p-1.5 sm:p-2 rounded-md transition-colors ${timerRunning ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}
          >
            <Timer size={16} className="sm:w-4.5 sm:h-4.5" />
          </button>
          <button 
            onClick={() => { setTime(0); setTimerRunning(false); }}
            className="hidden sm:block text-sm text-gray-500 hover:text-gray-800 dark:hover:text-white"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Main Workspace with v4 Resizable Panels */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Collapsed Left Panel Stub */}
        {mode === 'problem' && !leftPanelOpen && (
          <div 
            className="w-full h-10 lg:w-10 lg:h-full shrink-0 flex flex-row lg:flex-col items-center justify-center lg:justify-start lg:py-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1A1D24]" 
            onClick={() => setLeftPanelOpen(true)}
          >
            {/* Mobile View: Horizontal Chevron and Text */}
            <ChevronDown size={16} className="block lg:hidden text-gray-500 mr-2" />
            <span className="block lg:hidden text-sm font-medium text-gray-600 dark:text-gray-300">Show Description</span>
            
            {/* Desktop View: Vertical Chevron and Text */}
            <ChevronRight size={16} className="hidden lg:block text-gray-500 mb-4" />
            <span className="hidden lg:block writing-vertical text-sm text-gray-500 tracking-widest font-medium" style={{ writingMode: 'vertical-rl' }}>Description</span>
          </div>
        )}

        {/* Updated to 'Group' and 'orientation' */}
        <Group orientation={isMobile ? 'vertical' : 'horizontal'} className="flex-1">
          
          {/* Left Panel - Problem Description */}
          {mode === 'problem' && leftPanelOpen && (
            <>
              <Panel defaultSize="50%" minSize={20}>
                <div className="h-full flex flex-col bg-white dark:bg-[#12141C]">
                  <div className="h-10 shrink-0 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14]">
                    <span className="font-medium text-sm">Description</span>
                    <button onClick={() => setLeftPanelOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
                      <ChevronLeft size={16} className="hidden lg:block" />
                      <ChevronUp size={16} className="block lg:hidden" />
                    </button>
                  </div>
                  <div className="flex-1 p-4 sm:p-6 overflow-y-auto prose dark:prose-invert min-h-0">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">{problemName}</h2>
                    <p className="text-sm sm:text-base">Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to target.</p>
                  </div>
                </div>
              </Panel>
              
              {/* Updated to 'Separator' */}
              <Separator className={`bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors flex items-center justify-center z-10 ${isMobile ? 'h-2 cursor-row-resize' : 'w-2 cursor-col-resize'}`}>
                <div className={`bg-gray-400 dark:bg-gray-600 rounded-full ${isMobile ? 'w-8 h-1' : 'h-8 w-1'}`} />
              </Separator>
            </>
          )}

          {/* Right Area (Editor + I/O) */}
          <Panel minSize={30}>
            {/* Updated to 'Group' and 'orientation' */}
            <Group orientation="vertical">
              
              {/* Editor Panel */}
              <Panel defaultSize={bottomPanelOpen ? 60 : 100} minSize={20}>
                <div className="h-full flex flex-col bg-white dark:bg-[#12141C] relative">
                  <div className="h-10 shrink-0 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14]">
                    <span className="font-medium text-sm text-gray-600 dark:text-gray-300">Code Editor</span>
                  </div>
                  <div className="flex-1 relative min-h-0">
                    <Editor
                      height="100%"
                      language={language}
                      theme={isDark ? 'vs-dark' : 'light'}
                      value={code}
                      onChange={setCode}
                      options={{ minimap: { enabled: false }, fontSize: isMobile ? 12 : 14 }}
                    />
                  </div>
                </div>
              </Panel>

              {/* Updated to 'Separator' */}
              {bottomPanelOpen && (
                <Separator className="h-2 bg-gray-200 dark:bg-gray-800 hover:bg-blue-500 dark:hover:bg-blue-500 transition-colors flex items-center justify-center cursor-row-resize z-10">
                  <div className="w-8 h-1 bg-gray-400 dark:bg-gray-600 rounded-full" />
                </Separator>
              )}

              {/* I/O Bottom Panel */}
              {bottomPanelOpen ? (
                <Panel defaultSize={40} minSize={15}>
                  <div className="h-full flex flex-col bg-white dark:bg-[#12141C]">
                    <div className="h-10 shrink-0 flex items-center justify-between px-2 sm:px-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14]">
                      <div className="flex gap-2 sm:gap-4 h-full">
                        <button 
                          onClick={() => setActiveIoTab('input')}
                          className={`h-full px-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${activeIoTab === 'input' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                        >
                          Test Cases
                        </button>
                        <button 
                          onClick={() => setActiveIoTab('output')}
                          className={`h-full px-2 text-xs sm:text-sm font-medium border-b-2 transition-colors ${activeIoTab === 'output' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'}`}
                        >
                          Execution Output
                        </button>
                      </div>
                      <button onClick={() => setBottomPanelOpen(false)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2">
                        <ChevronDown size={16} />
                      </button>
                    </div>

                    <div className="flex-1 flex overflow-hidden min-h-0">
                      {activeIoTab === 'input' ? (
                        <div className="flex-1 flex flex-col p-2 sm:p-4 min-w-0">
                          <div className="flex gap-2 mb-2 sm:mb-4 overflow-x-auto pb-2 shrink-0">
                            {testCases.map((tc) => (
                              <div 
                                key={tc.id}
                                onClick={() => setActiveCaseId(tc.id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors shrink-0 ${activeCaseId === tc.id ? 'bg-gray-200 text-gray-900 dark:bg-[#1A1D24] dark:text-white' : 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
                              >
                                {tc.name}
                                {testCases.length > 1 && (
                                  <Trash2 size={14} className="opacity-50 hover:opacity-100 text-red-500" onClick={(e) => handleDeleteTestCase(e, tc.id)} />
                                )}
                              </div>
                            ))}
                            <button onClick={handleAddTestCase} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 text-sm font-medium transition-colors shrink-0">
                              <Plus size={14} /> New Case
                            </button>
                          </div>
                          
                          <div className="flex-1 flex flex-col min-h-0">
                            <p className="text-xs text-gray-500 mb-1 sm:mb-2 shrink-0">Standard Input</p>
                            <textarea 
                              className="w-full flex-1 p-2 sm:p-3 resize-none rounded-md bg-gray-50 dark:bg-[#0B0D14] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-sm text-gray-800 dark:text-gray-300"
                              value={activeTestCase?.input || ''}
                              onChange={(e) => {
                                const updated = testCases.map(t => t.id === activeCaseId ? { ...t, input: e.target.value } : t);
                                setTestCases(updated);
                              }}
                              placeholder="Enter test case inputs here..."
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1 p-4 font-mono text-sm text-gray-600 dark:text-gray-400 overflow-y-auto">
                          <p className="mb-2">Ready to run.</p>
                          <p className="text-xs opacity-50">Click 'Run' to execute your code against the active test cases.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Panel>
              ) : (
                <div className="h-10 shrink-0 flex items-center justify-between px-2 sm:px-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0B0D14]">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Terminal</span>
                  <button onClick={() => setBottomPanelOpen(true)} className="text-gray-500 hover:text-gray-800 dark:hover:text-white p-2">
                    <ChevronUp size={16} />
                  </button>
                </div>
              )}

            </Group>
          </Panel>
        </Group>
      </div>
    </div>
  );
};

export default EditorWorkspace;