import React, { createContext, useContext, useState } from 'react';

const ContentContext = createContext();

export function ContentProvider({ children }) {
    // Global filter/sort state that persists across category changes if desired
    const [globalFilters, setGlobalFilters] = useState({
        genre: 'All',
        minRating: 0,
        releaseYearRange: null, // format: { start: 2020, end: 2024 }
    });

    const [globalSort, setGlobalSort] = useState('popularity-desc'); // format: field-direction
    const [globalLanguage, setGlobalLanguage] = useState('All'); // 'All', 'hi', 'bn', 'en'

    const resetFilters = () => {
        setGlobalFilters({
            genre: 'All',
            minRating: 0,
            releaseYearRange: null,
        });
        setGlobalSort('popularity-desc');
        setGlobalLanguage('All');
    };

    const value = {
        globalFilters,
        setGlobalFilters,
        globalSort,
        setGlobalSort,
        globalLanguage,
        setGlobalLanguage,
        resetFilters
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContentContext() {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContentContext must be used within a ContentProvider');
    }
    return context;
}
