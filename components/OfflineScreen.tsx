
import React, { useState, useEffect } from 'react';
import { SavedContent, LearningResources } from '../types';
import { getSavedContent, deleteContent as deleteContentFromDB } from '../services/dbService';
import PracticeScreen from './PracticeScreen';

interface OfflineScreenProps {
    onBack: () => void;
}

const OfflineScreen: React.FC<OfflineScreenProps> = ({ onBack }) => {
    const [savedItems, setSavedItems] = useState<SavedContent[]>([]);
    const [selectedItem, setSelectedItem] = useState<SavedContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadContent = async () => {
        setIsLoading(true);
        try {
            const items = await getSavedContent();
            setSavedItems(items.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()));
        } catch (error) {
            console.error("Failed to load offline content:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        loadContent();
    }, []);

    const handleDelete = async (id: number | undefined) => {
        if (id === undefined) return;
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await deleteContentFromDB(id);
                setSavedItems(prevItems => prevItems.filter(item => item.id !== id));
                if (selectedItem?.id === id) {
                    setSelectedItem(null);
                }
            } catch (error) {
                console.error("Failed to delete item:", error);
                alert("Could not delete the item. Please try again.");
            }
        }
    };
    
    const getContentTypeDisplayName = (contentType: SavedContent['contentType']): string => {
        const names = {
            summary: "Summary",
            practice: "Practice Questions",
            mindmap: "Mind Map",
            resources: "Resources",
            paper: "Exam Paper"
        };
        return names[contentType] || "Content";
    };

    const renderSelectedItemContent = () => {
        if (!selectedItem) return null;

        switch (selectedItem.contentType) {
            case 'practice':
                return <PracticeScreen questions={selectedItem.content as any[]} />;

            case 'resources':
                const resources = selectedItem.content as LearningResources;
                return (
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

            case 'mindmap':
                return <div className="mindmap" dangerouslySetInnerHTML={{ __html: selectedItem.content as string }}></div>;

            case 'summary':
            case 'paper':
                return <div className="prose prose-blue dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: selectedItem.content as string }}></div>;

            default:
                return <p>Cannot display this content type.</p>;
        }
    };

    if (selectedItem) {
        const title = selectedItem.contentType === 'paper' ? 
            `Class ${selectedItem.className} ${selectedItem.subjectName} - Model Paper` :
            `${selectedItem.topicName} - ${getContentTypeDisplayName(selectedItem.contentType)}`;

        return (
            <div className="max-w-4xl mx-auto">
                <button onClick={() => setSelectedItem(null)} className="mb-4 flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    <span>Back to Offline List</span>
                </button>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{title}</h2>
                     {renderSelectedItemContent()}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Offline Content</h2>
                <button onClick={onBack} className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                    Close
                </button>
            </div>
            {isLoading ? <p>Loading saved items...</p> : 
             savedItems.length === 0 ? <p className="text-center text-gray-500 dark:text-gray-400 mt-8">You haven't saved any content yet.</p> :
             (
                <div className="space-y-4">
                    {savedItems.map(item => (
                        <div key={item.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-between">
                           <div className="flex-1 cursor-pointer" onClick={() => setSelectedItem(item)}>
                                <p className="font-bold text-lg text-blue-600 dark:text-blue-400">{item.topicName || item.subjectName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Class {item.className} &bull; {item.subjectName} &bull; {getContentTypeDisplayName(item.contentType)}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    Saved on: {new Date(item.savedAt).toLocaleString()}
                                </p>
                           </div>
                           <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                           </button>
                        </div>
                    ))}
                </div>
             )
            }
        </div>
    );
};

export default OfflineScreen;
