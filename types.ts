import React from 'react';

export type Subject = {
  name: string;
  // Fix: Replaced JSX.Element with React.ReactElement to resolve "Cannot find namespace 'JSX'" error.
  icon: React.ReactElement;
};

// Exported for use in offline types
export type ContentType = 'summary' | 'practice' | 'paper' | 'mindmap' | 'resources';

export enum QuestionType {
  MCQ = 'mcq',
  SHORT = 'short',
  LONG = 'long',
}

export interface MCQ {
  type: QuestionType.MCQ;
  question: string;
  options: string[];
  answer: string;
}

export interface ShortAnswerQuestion {
  type: QuestionType.SHORT;
  question: string;
  answer: string;
}

export interface LongAnswerQuestion {
  type: QuestionType.LONG;
  question: string;
  answer: string;
}

export type PracticeQuestion = MCQ | ShortAnswerQuestion | LongAnswerQuestion;

export interface YoutubeSuggestion {
  title: string;
  query: string;
}

export interface LearningResources {
  importantQuestions: string[];
  youtubeSuggestions: YoutubeSuggestion[];
}

// New type for offline data
export interface SavedContent {
  id?: number;
  className: number;
  subjectName: string;
  topicName: string | null; // A paper doesn't have a topic
  contentType: ContentType;
  content: string | PracticeQuestion[] | LearningResources;
  savedAt: Date;
}
