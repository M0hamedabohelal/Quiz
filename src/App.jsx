import React, { useState, useEffect } from 'react';
import Quiz from './components/Quiz';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('quiz-theme') || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('quiz-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="container">
      <header className="header-brand">
        <h1>Data Mining Quiz Master</h1>
        <p>Practice and master core concepts with our comprehensive interactive quiz</p>
        
        <div className="header-controls">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            ) : (
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.59 1.59m12.38 12.38l1.59 1.59M3 12h2.25m13.5 0H21M5.81 18.19l-1.59 1.59m14.22-14.22l-1.59 1.59M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
              </svg>
            )}
          </button>
        </div>
      </header>
      
      <main>
        <Quiz />
      </main>
      
      <footer style={{ 
        marginTop: '3rem', 
        paddingTop: '1.5rem', 
        borderTop: '1px solid var(--panel-border)', 
        textAlign: 'center', 
        color: 'var(--text-muted)', 
        fontSize: '0.85rem' 
      }}>
        <p>&copy; {new Date().getFullYear()} Data Mining Quiz App. 264 questions in Main Bank, 53 questions in B-Lite Bank.</p>
      </footer>
    </div>
  );
}

export default App;
