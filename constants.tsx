
import React from 'react';
import { Subject } from './types';

const ScienceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
);

const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const GeographyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h1a2 2 0 002-2v-1a2 2 0 012-2h1.945M12 4.5v.01M12 8.5v.01M12 12.5v.01M12 16.5v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const MathIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3.25M9 17v-3.25M12 17v-3.25m0 0V7m0 6.75A2.25 2.25 0 0014.25 12H9.75A2.25 2.25 0 0012 13.75z" />
    </svg>
);

const EnglishIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
);

const ComputerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const HindiIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.5 16.5a3 3 0 013-3h.5a3 3 0 013 3c0 1.657-1.343 3-3 3s-3-1.343-3-3zm3-3V7.5m-1 9h8m3-9h-5" />
    </svg>
);

const EVSIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const SocialStudiesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
    </svg>
);

const EconomicsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const CommercialStudiesIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const PhysicalEducationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const ArtIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
    </svg>
);


// Master list of all subjects
const ALL_SUBJECTS: { [key: string]: Subject } = {
    ENGLISH: { name: 'English', icon: <EnglishIcon /> },
    HINDI: { name: 'Hindi', icon: <HindiIcon /> },
    MATHEMATICS: { name: 'Mathematics', icon: <MathIcon /> },
    EVS: { name: 'Environmental Science (EVS)', icon: <EVSIcon /> },
    SCIENCE: { name: 'Science', icon: <ScienceIcon /> },
    SOCIAL_STUDIES: { name: 'Social Studies', icon: <SocialStudiesIcon /> },
    PHYSICS: { name: 'Physics', icon: <ScienceIcon /> },
    CHEMISTRY: { name: 'Chemistry', icon: <ScienceIcon /> },
    BIOLOGY: { name: 'Biology', icon: <ScienceIcon /> },
    HISTORY_CIVICS: { name: 'History & Civics', icon: <HistoryIcon /> },
    GEOGRAPHY: { name: 'Geography', icon: <GeographyIcon /> },
    COMPUTER: { name: 'Computer Applications', icon: <ComputerIcon /> },
    ECONOMICS: { name: 'Economics Applications', icon: <EconomicsIcon /> },
    COMMERCIAL: { name: 'Commercial Studies', icon: <CommercialStudiesIcon /> },
    PHYSICAL_EDUCATION: { name: 'Physical Education', icon: <PhysicalEducationIcon /> },
    ART: { name: 'Art', icon: <ArtIcon /> },
};


export const getSubjectsForClass = (classNum: number): Subject[] => {
    const { 
        ENGLISH, HINDI, MATHEMATICS, EVS, SCIENCE, SOCIAL_STUDIES, 
        PHYSICS, CHEMISTRY, BIOLOGY, HISTORY_CIVICS, GEOGRAPHY, 
        COMPUTER, ECONOMICS, COMMERCIAL, PHYSICAL_EDUCATION, ART
    } = ALL_SUBJECTS;

    if (classNum >= 1 && classNum <= 2) {
        return [ENGLISH, HINDI, MATHEMATICS, EVS, ART];
    }
    if (classNum >= 3 && classNum <= 5) {
        return [ENGLISH, HINDI, MATHEMATICS, SCIENCE, SOCIAL_STUDIES, COMPUTER, ART];
    }
    if (classNum >= 6 && classNum <= 8) {
        return [ENGLISH, HINDI, MATHEMATICS, PHYSICS, CHEMISTRY, BIOLOGY, HISTORY_CIVICS, GEOGRAPHY, COMPUTER, PHYSICAL_EDUCATION, ART];
    }
    if (classNum >= 9 && classNum <= 10) {
        // ICSE Group I (Compulsory) + popular Group II/III choices
        return [ENGLISH, HINDI, HISTORY_CIVICS, GEOGRAPHY, MATHEMATICS, PHYSICS, CHEMISTRY, BIOLOGY, COMPUTER, ECONOMICS, COMMERCIAL, PHYSICAL_EDUCATION, ART];
    }
    return []; // Default case
};