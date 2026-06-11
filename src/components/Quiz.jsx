import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import Question from './Question';
import Result from './Result';
import rawQuestions from '../data/questions.json';

const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const Quiz = () => {
  // Config & State
  const [phase, setPhase] = useState('welcome'); // 'welcome' | 'active' | 'completed'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: selectedOptionIndex }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { [questionIndex]: boolean }
  
  // Customization Options
  const [shuffleEnabled, setShuffleEnabled] = useState(false);

  // Initialize questions
  useEffect(() => {
    setQuestions(rawQuestions);
  }, []);

  // Start the quiz
  const handleStartQuiz = () => {
    let quizQuestions = [...rawQuestions];
    if (shuffleEnabled) {
      quizQuestions = shuffleArray(quizQuestions);
    }
    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setPhase('active');
  };

  // Select an option
  const handleSelectAnswer = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIndex,
    }));
  };

  // Toggle flag/bookmark for current question
  const handleToggleFlag = (index) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Navigation
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Submit confirmation and handling
  const handleSubmit = () => {
    const answeredCount = Object.keys(userAnswers).length;
    const unansweredCount = questions.length - answeredCount;

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have left ${unansweredCount} questions unanswered. Are you sure you want to submit the quiz?`
      );
      if (!confirmSubmit) return;
    } else {
      const confirmSubmit = window.confirm('Are you sure you want to submit the quiz and view your results?');
      if (!confirmSubmit) return;
    }

    setPhase('completed');
  };

  // Reset/Restart handlers
  const handleRestart = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setPhase('welcome');
  };

  const handleResetQuiz = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the quiz? All your answers and bookmarks will be cleared."
    );
    if (!confirmReset) return;
    
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    
    let quizQuestions = [...rawQuestions];
    if (shuffleEnabled) {
      quizQuestions = shuffleArray(quizQuestions);
    }
    setQuestions(quizQuestions);
    setPhase('welcome'); // Return to settings start screen
  };

  // Calculate score
  const calculateScore = () => {
    return questions.reduce((score, q, idx) => {
      const userAnswer = userAnswers[idx];
      return userAnswer === q.answerIndex ? score + 1 : score;
    }, 0);
  };

  // Welcome Screen Render
  if (phase === 'welcome') {
    return (
      <div className="glass-panel welcome-card">
        <div className="welcome-icon">⚡</div>
        <h2 className="welcome-title">Data Mining Questions Bank</h2>
        <p className="welcome-description">
          Test your understanding with all <strong>{rawQuestions.length} questions</strong> extracted directly from the Data Mining question pool. Features multiple choice & True/False questions.
        </p>

        <div className="settings-grid">
          <div 
            className={`settings-card ${shuffleEnabled ? 'active' : ''}`}
            onClick={() => setShuffleEnabled(!shuffleEnabled)}
          >
            <div className="settings-card-header">
              <span>Shuffle Questions</span>
              <input 
                type="checkbox" 
                checked={shuffleEnabled} 
                onChange={() => {}} // handled by click
              />
            </div>
            <span className="settings-card-desc">Randomize the order of questions to test your raw knowledge.</span>
          </div>
        </div>

        <button onClick={handleStartQuiz} className="btn btn-primary" style={{ minWidth: '220px', padding: '0.9rem 2rem' }}>
          Start Quiz
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </div>
    );
  }

  // Result Screen Render
  if (phase === 'completed') {
    return (
      <Result 
        score={calculateScore()}
        total={questions.length}
        userAnswers={userAnswers}
        questions={questions}
        flaggedQuestions={flaggedQuestions}
        onRestart={handleRestart}
      />
    );
  }

  // Active Quiz Render
  const currentQuestion = questions[currentIndex];

  return (
    <div className="glass-panel">
      <ProgressBar 
        current={Object.keys(userAnswers).length} 
        total={questions.length} 
      />

      <Question 
        question={currentQuestion}
        selectedAnswer={userAnswers[currentIndex]}
        onSelectAnswer={handleSelectAnswer}
        isFlagged={flaggedQuestions[currentIndex] === true}
        onToggleFlag={() => handleToggleFlag(currentIndex)}
      />

      <div className="quiz-actions">
        <div /> {/* Spacer */}

        <div className="button-group">
          <button 
            onClick={handlePrev} 
            disabled={currentIndex === 0} 
            className="btn btn-secondary"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button 
              onClick={handleSubmit} 
              className="btn btn-primary"
            >
              Submit Quiz
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          ) : (
            <button 
              onClick={handleNext} 
              className="btn btn-secondary"
            >
              Next
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Quick navigation bar to jump around */}
      <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--panel-border)', paddingTop: '1.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Question Navigator
        </h4>
        <div style={{ 
          display: 'flex', 
          gap: '6px', 
          flexWrap: 'wrap', 
          maxHeight: '120px', 
          overflowY: 'auto',
          padding: '0.5rem',
          background: 'var(--bg-app-accent)',
          borderRadius: '10px',
          border: '1px solid var(--panel-border)'
        }}>
          {questions.map((q, idx) => {
            const answered = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
            const active = idx === currentIndex;
            const flagged = flaggedQuestions[idx] === true;
            
            let btnStyle = {
              width: flagged ? '38px' : '28px',
              height: '28px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              border: '1px solid transparent',
              transition: 'all 0.15s ease',
            };

            if (active) {
              btnStyle.background = 'hsl(var(--color-primary))';
              btnStyle.color = 'white';
              btnStyle.boxShadow = '0 0 8px rgba(99, 102, 241, 0.3)';
            } else if (flagged) {
              btnStyle.background = 'rgba(245, 158, 11, 0.08)';
              btnStyle.border = '1px solid #f59e0b';
              btnStyle.color = '#d97706';
            } else if (answered) {
              btnStyle.background = 'rgba(99, 102, 241, 0.08)';
              btnStyle.border = '1px solid rgba(99, 102, 241, 0.2)';
              btnStyle.color = '#4f46e5';
            } else {
              btnStyle.background = 'var(--option-bg)';
              btnStyle.border = '1px solid var(--option-border)';
              btnStyle.color = 'var(--text-secondary)';
            }

            return (
              <button
                key={q.id}
                style={btnStyle}
                onClick={() => setCurrentIndex(idx)}
                title={`Question ${idx + 1}${flagged ? ' (Bookmarked)' : ''}`}
                type="button"
              >
                {idx + 1}
                {flagged && '★'}
              </button>
            );
          })}
        </div>
        
        {/* Early submit & Reset options */}
        <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button 
            onClick={handleResetQuiz} 
            className="btn btn-secondary" 
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}
          >
            Reset Quiz
          </button>
          <button 
            onClick={handleSubmit} 
            className="btn btn-danger" 
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
          >
            End Quiz Early
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
