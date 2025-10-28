import { GoogleGenAI, Type } from "@google/genai";
import { PracticeQuestion, LearningResources } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getTopicsForSubject = async (className: number, subjectName: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a list of all chapter names for ICSE Class ${className} ${subjectName}. Return the response as a JSON array of strings. For example: ["Chapter 1: Matter", "Chapter 2: Atomic Structure"]`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING
                    }
                }
            }
        });
        const jsonString = response.text.trim();
        const topics = JSON.parse(jsonString);
        return topics;
    } catch (error) {
        console.error("Error fetching topics:", error);
        throw new Error("Failed to generate topics. Please try again.");
    }
};

export const getTopicSummary = async (className: number, subjectName: string, topicName: string): Promise<string> => {
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // FIX: Updated prompt to request HTML output for direct rendering, avoiding markdown parsing issues.
            contents: `Provide a detailed yet easy-to-understand summary of the key concepts for the topic "${topicName}" from the ICSE Class ${className} ${subjectName} syllabus. Use HTML formatting with headings (e.g. <h2>, <h3>), paragraphs (<p>), lists (<ul>, <ol>, <li>), and bold text (<b> or <strong>) for important terms to make it highly readable for students. Do not include \`\`\`html or any other code block markers, just the raw HTML.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching summary:", error);
        throw new Error("Failed to generate summary. Please try again.");
    }
};

export const generatePracticeQuestions = async (className: number, subjectName: string, topicName: string): Promise<PracticeQuestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate 5 practice questions for the topic "${topicName}" from the ICSE Class ${className} ${subjectName} syllabus. Include a mix of 2 multiple-choice questions (MCQs), 2 short answer questions, and 1 long answer question.
            - For MCQs, provide 4 options and the correct answer text must exactly match one of the options.
            - For all questions, provide the correct answer or a detailed explanation.
            Return the response as a JSON array adhering to the provided schema. The 'type' must be one of 'mcq', 'short', or 'long'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['mcq', 'short', 'long'] },
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            answer: { type: Type.STRING }
                        },
                        required: ['type', 'question', 'answer']
                    }
                }
            }
        });
        const jsonString = response.text.trim();
        const questions = JSON.parse(jsonString);
        return questions as PracticeQuestion[];
    } catch (error) {
        console.error("Error fetching questions:", error);
        throw new Error("Failed to generate practice questions. Please try again.");
    }
};

export const generateMindMap = async (className: number, subjectName: string, topicName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a mind map for the topic "${topicName}" from ICSE Class ${className} ${subjectName}. The mind map should cover key concepts, sub-topics, and important relationships. Represent the mind map as a nested HTML unordered list (<ul> and <li>) where each list item is wrapped in a <span> tag. The main topic should be the first-level list item. Do not include any CSS, doctype, or html/body tags. Output only the raw HTML starting with <ul>.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching mind map:", error);
        throw new Error("Failed to generate mind map. Please try again.");
    }
};

export const findLearningResources = async (className: number, subjectName: string, topicName: string): Promise<LearningResources> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `For the topic "${topicName}" from ICSE Class ${className} ${subjectName}, generate a list of 5 important questions and suggest 3 relevant YouTube video search queries. Return the response as a JSON object. The 'importantQuestions' should be an array of strings. The 'youtubeSuggestions' should be an array of objects, each with a 'title' and a 'query'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        importantQuestions: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        youtubeSuggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    query: { type: Type.STRING }
                                },
                                required: ['title', 'query']
                            }
                        }
                    },
                    required: ['importantQuestions', 'youtubeSuggestions']
                }
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as LearningResources;
    } catch (error) {
        console.error("Error fetching resources:", error);
        throw new Error("Failed to find learning resources. Please try again.");
    }
};

export const generateFullPaper = async (className: number, subjectName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Generate a full 80-marks model question paper for ICSE Class ${className} ${subjectName}. The paper must follow the latest ICSE syllabus and question paper pattern, including distribution of marks across Section A (compulsory) and Section B (internal choice). Provide the full paper with questions and a separate, complete answer key at the end. Format the entire output as a single HTML document with clear headings for sections, questions, marks, and the answer key. Do not include doctype, html, or body tags.`,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating paper:", error);
        throw new Error("Failed to generate the question paper. Please try again.");
    }
};