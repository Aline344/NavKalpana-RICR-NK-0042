import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Split from 'react-split';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { Play, Send, ChevronLeft, CheckCircle, XCircle, Loader, TerminalSquare, AlertCircle } from 'lucide-react';

const CodeChallenge = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // State
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [activeTab, setActiveTab] = useState('description'); // description, solution, submissions

    // Execution State
    const [isExecuting, setIsExecuting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [executionResult, setExecutionResult] = useState(null);
    const [consoleHeight, setConsoleHeight] = useState('30%'); // initial bottom pane size

    useEffect(() => {
        fetchAssignment();
    }, [id]);

    const fetchAssignment = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/assignments/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (res.ok) {
                setAssignment(data);
                // Set initial code based on map or fallback
                if (data.startingCode && data.startingCode[language]) {
                    setCode(data.startingCode[language]);
                } else {
                    setCode('// Start writing your code here...');
                }
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("Failed to load assignment", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        // Load starter code for new lang if available
        if (assignment?.startingCode && assignment.startingCode[newLang]) {
            setCode(assignment.startingCode[newLang]);
        }
    };

    const handleRunCode = async () => {
        setIsExecuting(true);
        setExecutionResult(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/assignments/run`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId: id, language, code })
            });

            const data = await res.json();
            setExecutionResult(data);
        } catch (error) {
            setExecutionResult({ success: false, errorType: 'Network Error', error: error.message });
        } finally {
            setIsExecuting(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setExecutionResult(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/assignments/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ assignmentId: id, language, code })
            });

            const data = await res.json();
            setExecutionResult(data.executionResults);

            // Switch to submissions tab
            setActiveTab('submissions');
            // Update local state to show it was evaluated
            setAssignment(data.assignment);
        } catch (error) {
            setExecutionResult({ success: false, errorType: 'Network Error', error: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-background"><Loader className="animate-spin text-primary-500 w-8 h-8" /></div>;
    if (!assignment) return <div className="h-screen flex items-center justify-center text-red-500">Failed to load challenge.</div>;

    // Determine Monaco language identifier
    const monacoLang = language === 'cpp' ? 'cpp' : (language === 'python' ? 'python' : (language === 'java' ? 'java' : 'javascript'));

    return (
        <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden font-sans">

            {/* Top Navbar */}
            <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/practice')} className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2 items-center">
                        <h1 className="font-bold text-gray-900 line-clamp-1">{assignment.title}</h1>
                        <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold ${assignment.difficulty <= 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                                assignment.difficulty === 3 ? 'bg-amber-50 border-amber-200 text-amber-600' :
                                    'bg-red-50 border-red-200 text-red-600'
                            }`}>
                            {assignment.difficulty <= 2 ? 'Easy' : assignment.difficulty === 3 ? 'Medium' : 'Hard'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRunCode}
                        disabled={isExecuting || isSubmitting}
                        className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        {isExecuting ? <Loader size={14} className="animate-spin" /> : <Play size={14} />}
                        Run
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isExecuting || isSubmitting}
                        className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Split Layout */}
            <Split
                sizes={[40, 60]}
                minSize={300}
                gutterSize={6}
                className="flex-1 flex overflow-hidden"
                gutterAlign="center"
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
            >
                {/* Left Panel: Description / Tabs */}
                <div className="flex flex-col h-full bg-white border-r border-gray-200 overflow-hidden">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">
                        {['description', 'solution', 'submissions'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                                        ? 'border-primary-500 text-primary-600 bg-white'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 p-6 overflow-y-auto prose prose-sm max-w-none">
                        {activeTab === 'description' && (
                            <div>
                                {assignment.problemStatement ? (
                                    <ReactMarkdown>{assignment.problemStatement}</ReactMarkdown>
                                ) : (
                                    // Fallback for old textual assignments
                                    <>
                                        <h2>Problem Description</h2>
                                        <p>{assignment.description}</p>
                                        <h3>Requirements:</h3>
                                        <ul>{assignment.requirements?.map((r, i) => <li key={i}>{r}</li>)}</ul>
                                    </>
                                )}
                            </div>
                        )}

                        {activeTab === 'solution' && (
                            <div>
                                <h2>Optimal Approach</h2>
                                {assignment.solution ? (
                                    <ReactMarkdown>{assignment.solution}</ReactMarkdown>
                                ) : (
                                    <p className="text-gray-500 italic">No solution provided for this problem.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'submissions' && (
                            <div>
                                <h2>Submission History</h2>
                                {assignment.status === 'evaluated' && assignment.evaluation ? (
                                    <div className="bg-white border text-center border-gray-200 rounded-xl p-6 shadow-sm mb-6">
                                        <div className="flex justify-center items-center gap-2 mb-2">
                                            {assignment.evaluation.score === 100 ?
                                                <CheckCircle className="text-emerald-500 w-8 h-8" /> :
                                                <AlertCircle className="text-amber-500 w-8 h-8" />
                                            }
                                            <h3 className={`text-2xl font-bold m-0 ${assignment.evaluation.score === 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {assignment.evaluation.score === 100 ? 'Accepted' : 'Partial / Failed'}
                                            </h3>
                                        </div>
                                        <p className="text-gray-500 text-sm">Score: {assignment.evaluation.score}%</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic">You haven't submitted a solution yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Editor & Console Split */}
                <Split
                    sizes={[70, 30]}
                    minSize={100}
                    gutterSize={6}
                    direction="vertical"
                    className="flex flex-col h-full overflow-hidden bg-gray-50"
                >
                    {/* Top: Editor */}
                    <div className="flex flex-col h-full w-full overflow-hidden bg-white rounded-tl-lg shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)] border-l border-t border-gray-200 relative">
                        {/* Editor Header */}
                        <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 shrink-0">
                            <select
                                value={language}
                                onChange={(e) => handleLanguageChange(e.target.value)}
                                className="bg-white border border-gray-300 text-gray-700 text-xs rounded px-2 py-1 outline-none focus:ring-1 focus:ring-primary-500 font-medium cursor-pointer"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python 3</option>
                                <option value="cpp">C++</option>
                                <option value="java">Java</option>
                            </select>
                        </div>

                        {/* Monaco Editor */}
                        <div className="flex-1 w-full relative">
                            <Editor
                                height="100%"
                                language={monacoLang}
                                theme="light"
                                value={code}
                                onChange={(value) => setCode(value)}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineHeight: 22,
                                    padding: { top: 16 },
                                    scrollBeyondLastLine: false,
                                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                                    smoothScrolling: true,
                                    cursorBlinking: "smooth",
                                    renderLineHighlight: "all"
                                }}
                            />
                        </div>
                    </div>

                    {/* Bottom: Console / Test Results */}
                    <div className="flex flex-col h-full bg-white border-l border-t border-gray-200 overflow-hidden relative">
                        <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4 shrink-0 gap-2">
                            <TerminalSquare size={16} className="text-gray-500" />
                            <span className="text-xs font-bold text-gray-700 tracking-wide uppercase">Test Results</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-[#fcfcfc]">
                            {!executionResult && !isExecuting && !isSubmitting && (
                                <div className="text-gray-400 text-sm flex items-center justify-center h-full">
                                    Click Run to execute against visible test cases.
                                </div>
                            )}

                            {(isExecuting || isSubmitting) && (
                                <div className="text-primary-600 text-sm flex items-center justify-center h-full gap-2">
                                    <Loader className="animate-spin" size={16} />
                                    <span>Compiling and running code...</span>
                                </div>
                            )}

                            {executionResult && !executionResult.success && (
                                <div className="text-red-600 text-sm font-mono whitespace-pre-wrap bg-red-50 p-4 rounded-lg border border-red-100">
                                    <strong>{executionResult.errorType || 'Execution Error'}:</strong><br />
                                    {executionResult.error}
                                </div>
                            )}

                            {executionResult && executionResult.success && (
                                <div className="space-y-4">
                                    <h3 className={`text-lg font-bold ${executionResult.allPassed ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {executionResult.allPassed ? 'Accepted' : 'Wrong Answer'}
                                        <span className="text-sm font-normal text-gray-500 ml-2">
                                            ({executionResult.passedCases}/{executionResult.totalCases} cases passed)
                                        </span>
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {executionResult.results.map((res, i) => (
                                            <div key={i} className={`p-3 rounded-lg border text-sm font-mono w-full ${res.passed ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                                                <div className="font-bold mb-1 flex items-center gap-1">
                                                    {res.passed ? <CheckCircle size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-red-500" />}
                                                    Test Case {i + 1}
                                                </div>
                                                <div className="text-gray-500 text-xs mb-0.5">Input:</div>
                                                <div className="bg-white/60 p-1.5 rounded mb-2 text-gray-800">{res.input}</div>

                                                <div className="text-gray-500 text-xs mb-0.5">Expected:</div>
                                                <div className="bg-white/60 p-1.5 rounded mb-2 text-gray-800">{res.expectedOutput}</div>

                                                <div className="text-gray-500 text-xs mb-0.5">Output:</div>
                                                <div className={`p-1.5 rounded ${res.passed ? 'bg-white/60 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {res.actualOutput || <span className="text-gray-400 italic">null</span>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Split>
            </Split>

            <style>{`
                /* Split.js specific styles */
                .gutter {
                    background-color: #f3f4f6;
                    background-repeat: no-repeat;
                    background-position: 50%;
                }
                .gutter:hover {
                    background-color: #e5e7eb;
                }
                .gutter.gutter-horizontal {
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
                    cursor: col-resize;
                }
                .gutter.gutter-vertical {
                    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyCB2iAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFBgIDAL29wR/xYAAAAASUVORK5CYII=');
                    cursor: row-resize;
                }
            `}</style>
        </div>
    );
};

export default CodeChallenge;
