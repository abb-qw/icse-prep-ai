
import React, { useState } from 'react';
import { PracticeQuestion, QuestionType, MCQ } from '../types';

interface PracticeScreenProps {
    questions: PracticeQuestion[];
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ questions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const isMCQ = currentQuestion.type === QuestionType.MCQ;

    const handleOptionSelect = (option: string) => {
        if (showAnswer) return;
        setSelectedOption(option);
    };

    const handleCheckAnswer = () => {
        setShowAnswer(true);
    };

    const handleNextQuestion = () => {
        setShowAnswer(false);
        setSelectedOption(null);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const getOptionBgColor = (option: string) => {
        if (!showAnswer) {
            return selectedOption === option ? 'bg-blue-200 dark:bg-blue-800' : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600';
        }
        if (option === currentQuestion.answer) {
            return 'bg-green-200 dark:bg-green-800';
        }
        if (option === selectedOption && option !== currentQuestion.answer) {
            return 'bg-red-200 dark:bg-red-800';
        }
        return 'bg-white dark:bg-gray-700';
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
                <div className="mb-4">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-2">{currentQuestion.question}</h2>
                </div>

                {isMCQ && (
                    <div className="space-y-3 my-6">
                        {(currentQuestion as MCQ).options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionSelect(option)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${getOptionBgColor(option)}
                                 ${selectedOption === option ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'}
                                 ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                disabled={showAnswer}
                            >
                                <span className="font-semibold text-gray-700 dark:text-gray-200">{option}</span>
                            </button>
                        ))}
                    </div>
                )}

                {showAnswer && (
                     <div className="mt-6 p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Answer:</h3>
                        <p className="mt-2 text-gray-700 dark:text-gray-300">{currentQuestion.answer}</p>
                    </div>
                )}

                <div className="mt-8 flex justify-end space-x-4">
                    {!showAnswer ? (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={isMCQ && !selectedOption}
                            className="px-6 py-3 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Check Answer
                        </button>
                    ) : (
                         !isLastQuestion && <button
                            onClick={handleNextQuestion}
                            className="px-6 py-3 font-semibold text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                        >
                            Next Question
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticeScreen;

