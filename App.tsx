
import React, { useState, useCallback, useEffect } from 'react';
import { getSubjectsForClass } from './constants';
import { Subject, PracticeQuestion, LearningResources, ContentType, SavedContent } from './types';
import { getTopicsForSubject, getTopicSummary, generatePracticeQuestions, generateMindMap, findLearningResources, generateFullPaper } from './services/geminiService';
import { initDB, saveContent } from './services/dbService';
import LoadingSpinner from './components/LoadingSpinner';
import PracticeScreen from './components/PracticeScreen';
import OfflineScreen from './components/OfflineScreen';

type AppStep = 'class' | 'subject' | 'topic' | 'mode' | 'content';
type Theme = 'light' | 'dark' | 'system';

const App: React.FC = () => {
    const [step, setStep] = useState<AppStep>('class');
    const [selectedClass, setSelectedClass] = useState<number | null>(null);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [topics, setTopics] = useState<string[]>([]);
    const [content, setContent] = useState<string | PracticeQuestion[] | LearningResources | null>(null);
    const [contentType, setContentType] = useState<ContentType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'system');
    const [isOfflineView, setIsOfflineView] = useState(false);

    useEffect(() => {
        initDB(); // Initialize IndexedDB on app load
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        const isDark =
          theme === 'dark' ||
          (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        root.classList.toggle('dark', isDark);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const handleBack = () => {
        setError(null);
        setContent(null);
        if (isOfflineView) {
            setIsOfflineView(false);
            return;
        }
        if (step === 'content') {
            if (contentType === 'paper') {
                setStep('topic');
            } else {
                setStep('mode');
            }
            setContentType(null);
        } else if (step === 'mode') {
            setSelectedTopic(null);
            setStep('topic');
        } else if (step === 'topic') {
            setSelectedSubject(null);
            setTopics([]);
            setStep('subject');
        } else if (step === 'subject') {
            setSelectedClass(null);
            setStep('class');
        }
    };
    
    const resetToHome = () => {
        setStep('class');
        setSelectedClass(null);
        setSelectedSubject(null);
        setSelectedTopic(null);
        setTopics([]);
        setContent(null);
        setContentType(null);
        setError(null);
        setIsOfflineView(false);
    };

    const handleClassSelect = (classNum: number) => {
        setSelectedClass(classNum);
        setStep('subject');
    };

    const handleSubjectSelect = useCallback(async (subject: Subject) => {
        if (!selectedClass) return;
        setSelectedSubject(subject);
        setIsLoading(true);
        setLoadingMessage(`Fetching topics for ${subject.name}...`);
        setError(null);
        try {
            const fetchedTopics = await getTopicsForSubject(selectedClass, subject.name);
            setTopics(fetchedTopics);
            setStep('topic');
        } catch (e) {
            setError((e as Error).message);
            setStep('subject'); 
        } finally {
            setIsLoading(false);
        }
    }, [selectedClass]);

    const handleTopicSelect = (topic: string) => {
        setSelectedTopic(topic);
        setStep('mode');
    };

    const handleModeSelect = useCallback(async (mode: ContentType) => {
        if (!selectedClass || !selectedSubject) return;
        
        setIsLoading(true);
        setError(null);
        setContentType(mode);

        try {
            switch (mode) {
                case 'summary':
                    if (!selectedTopic) return;
                    setLoadingMessage(`Generating summary for ${selectedTopic}...`);
                    const summary = await getTopicSummary(selectedClass, selectedSubject.name, selectedTopic);
                    setContent(summary);
                    break;
                case 'practice':
                    if (!selectedTopic) return;
                    setLoadingMessage(`Generating questions for ${selectedTopic}...`);
                    const questions = await generatePracticeQuestions(selectedClass, selectedSubject.name, selectedTopic);
                    setContent(questions);
                    break;
                case 'mindmap':
                    if (!selectedTopic) return;
                    setLoadingMessage(`Creating mind map for ${selectedTopic}...`);
                    const mindMap = await generateMindMap(selectedClass, selectedSubject.name, selectedTopic);
                    setContent(mindMap);
                    break;
                case 'resources':
                    if (!selectedTopic) return;
                    setLoadingMessage(`Finding resources for ${selectedTopic}...`);
                    const resources = await findLearningResources(selectedClass, selectedSubject.name, selectedTopic);
                    setContent(resources);
                    break;
                case 'paper':
                    setLoadingMessage(`Generating 80 Marks Paper for ${selectedSubject.name}...`);
                    const paper = await generateFullPaper(selectedClass, selectedSubject.name);
                    setContent(paper);
                    break;
            }
            setStep('content');
        } catch (e) {
            setError((e as Error).message);
            setStep(selectedTopic ? 'mode' : 'topic');
        } finally {
            setIsLoading(false);
        }
    }, [selectedClass, selectedSubject, selectedTopic]);
    
    const handleSaveOffline = async () => {
        if (!selectedClass || !selectedSubject || !contentType || !content) return;
        const dataToSave: SavedContent = {
            className: selectedClass,
            subjectName: selectedSubject.name,
            topicName: contentType === 'paper' ? null : selectedTopic,
            contentType,
            content,
            savedAt: new Date()
        };
        try {
            await saveContent(dataToSave);
            alert('Content saved successfully for offline access!');
        } catch (error) {
            console.error('Failed to save content:', error);
            alert('Could not save content. Please try again.');
        }
    };

    const getPath = (): string[] => {
        if (!selectedClass) return [];
        const path = [`Class ${selectedClass}`];
        if (!selectedSubject || step === 'subject') return path;
        path.push(selectedSubject.name);
        if (!selectedTopic || step === 'topic' || contentType === 'paper') return path;
        path.push(selectedTopic);
        return path;
    };

    const ThemeToggleButton = () => (
        <div className="flex items-center space-x-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                {theme === 'dark' ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                }
            </button>
        </div>
    );

    const renderHeader = () => {
        const path = getPath();
        return (
            <header className="bg-white dark:bg-gray-800 shadow-md p-4 sticky top-0 z-10">
                <div className="flex items-center justify-between">
                    <div onClick={resetToHome} className="flex items-center space-x-3 cursor-pointer">
                        <div className="bg-blue-600 p-2 rounded-lg">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">ICSE Prep AI</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsOfflineView(true)} className="hidden sm:flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            <span>Offline Content</span>
                        </button>
                        <ThemeToggleButton />
                        {(step !== 'class' || isOfflineView) && (
                             <button onClick={handleBack} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                <span>Back</span>
                            </button>
                        )}
                    </div>
                </div>
                 {path.length > 0 && !isOfflineView && (
                    <nav className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
                        <ol className="list-none p-0 inline-flex items-center space-x-1">
                            {path.map((item, index) => (
                                <li key={index} className="flex items-center">
                                    <span className="truncate max-w-[150px] md:max-w-none">{item}</span>
                                    {index < path.length - 1 && (
                                        <svg className="h-5 w-5 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                                    )}
                                </li>
                            ))}
                        </ol>
                    </nav>
                )}
            </header>
        );
    };

    const renderContent = () => {
        if (isOfflineView) {
            return <OfflineScreen onBack={() => setIsOfflineView(false)} />;
        }

        if (error) {
            return <div className="text-center p-8 text-red-500 bg-red-100 dark:bg-red-900/20 rounded-lg max-w-2xl mx-auto mt-8">{error}</div>;
        }

        switch (step) {
            case 'class':
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">Welcome to Your AI Study Partner</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">Select your class to begin.</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-4xl mx-auto">
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(classNum => (
                                <button key={classNum} onClick={() => handleClassSelect(classNum)} className="aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col items-center justify-center text-blue-600 dark:text-blue-400 hover:shadow-2xl hover:-translate-y-2 transform transition-all duration-300">
                                    <span className="text-5xl font-bold">{classNum}</span>
                                    <span className="text-lg font-semibold mt-1 text-gray-700 dark:text-gray-200">Class</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'subject':
                if (!selectedClass) return null;
                const subjectsForClass = getSubjectsForClass(selectedClass);
                return (
                    <div>
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-8">Select a Subject for Class {selectedClass}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                            {subjectsForClass.map(subject => (
                                <button key={subject.name} onClick={() => handleSubjectSelect(subject)} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 flex flex-col items-center justify-center space-y-3 text-blue-600 dark:text-blue-400">
                                    {subject.icon}
                                    <span className="text-center font-semibold text-gray-700 dark:text-gray-200">{subject.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'topic':
                 return (
                    <div className="max-w-3xl mx-auto">
                         {(selectedClass === 9 || selectedClass === 10) && (
                            <div className="mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Subject Level Tools</h3>
                                <button onClick={() => handleModeSelect('paper')} className="w-full flex items-center justify-center p-3 font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Generate 80 Marks Paper
                                </button>
                            </div>
                        )}
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">Select a Topic</h2>
                         <p className="text-center text-gray-500 dark:text-gray-400 mb-8">from {selectedSubject?.name}</p>
                        <div className="space-y-3">
                            {topics.map(topic => (
                                <button key={topic} onClick={() => handleTopicSelect(topic)} className="w-full p-4 text-left bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                                    <span className="font-medium text-gray-800 dark:text-gray-100">{topic}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'mode':
                return (
                     <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">You selected: <span className="text-blue-600 dark:text-blue-400">{selectedTopic}</span></h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">What would you like to do?</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                            <button onClick={() => handleModeSelect('summary')} className="text-left p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-9-5.747h18" /></svg></div>
                                    <div>
                                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Learn Concepts</span>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get a detailed summary of the topic.</p>
                                    </div>
                                </div>
                            </button>
                             <button onClick={() => handleModeSelect('practice')} className="text-left p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg></div>
                                    <div>
                                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Practice Questions</span>
                                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Test your knowledge with quizzes.</p>
                                    </div>
                                </div>
                            </button>
                             <button onClick={() => handleModeSelect('mindmap')} className="text-left p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h11M3 6h11M3 14h7M17 20l4-4-4-4M3 18h7"></path></svg></div>
                                    <div>
                                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Create Mind Map</span>
                                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Visualize key concepts and connections.</p>
                                    </div>
                                </div>
                            </button>
                             <button onClick={() => handleModeSelect('resources')} className="text-left p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300">
                                <div className="flex items-center space-x-4">
                                    <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></div>
                                    <div>
                                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-200">Find Resources</span>
                                         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Get question lists and video links.</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                );
            case 'content':
                const baseContentLayout = (title: string, children: React.ReactNode) => (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
                                <button onClick={handleSaveOffline} className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    <span>Save for Offline</span>
                                </button>
                            </div>
                            {children}
                        </div>
                    </div>
                );
                
                switch(contentType) {
                    case 'summary':
                        return baseContentLayout(`${selectedTopic} - Summary`, <div className="prose prose-blue dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content as string }}></div>);
                    case 'practice':
                        return baseContentLayout(`${selectedTopic} - Practice Questions`, <PracticeScreen questions={content as PracticeQuestion[]} />);
                    case 'paper':
                         return baseContentLayout(`Class ${selectedClass} ${selectedSubject?.name} - Model Paper`, <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content as string }}></div>);
                    case 'mindmap':
                        return baseContentLayout(`${selectedTopic} - Mind Map`, <div className="mindmap" dangerouslySetInnerHTML={{ __html: content as string }}></div>);
                    case 'resources':
                        const resources = content as LearningResources;
                        return baseContentLayout(`${selectedTopic} - Learning Resources`, 
                            <div>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">Important Questions</h3>
                                <ul className="list-disc list-inside space-y-2 mb-6">
                                    {resources.importantQuestions.map((q, i) => <li key={i} className="text-gray-600 dark:text-gray-300">{q}</li>)}
                                </ul>
                                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3">YouTube Video Suggestions</h3>
                                <div className="space-y-3">
                                    {resources.youtubeSuggestions.map((s, i) => (
                                        <a key={i} href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s.query)}`} target="_blank" rel="noopener noreferrer" className="block p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
                                            <p className="font-semibold text-blue-600 dark:text-blue-400">{s.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Search for: "{s.query}"</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                }
                return null;
            default:
                return <div>Something went wrong.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            {isLoading && <LoadingSpinner message={loadingMessage} />}
            {renderHeader()}
            <main className="p-4 sm:p-6 md:p-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;
