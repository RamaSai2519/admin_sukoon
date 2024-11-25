import React, { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(() => {
        const localStorageDarkMode = localStorage.getItem('darkMode');
        if (localStorageDarkMode !== null) {
            return JSON.parse(localStorageDarkMode);
        } else {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
    });

    useEffect(() => {
        if (darkMode) {
            localStorage.setItem('darkMode', 'true');
            document.body.classList.add('dark');
            document.documentElement.classList.add('dark');
        } else {
            localStorage.setItem('darkMode', 'false');
            document.body.classList.remove('dark');
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};
