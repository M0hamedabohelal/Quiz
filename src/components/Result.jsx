import React, { useState } from 'react';
import Question from './Question';

const Result = ({ score, total, userAnswers, questions, flaggedQuestions = {}, onRestart }) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'correct' | 'incorrect' | 'skipped' | 'flagged'

  const percent = total > 0 ? Math.round((score / total) * 100) : 0;
  
  // Calculate detailed stats
  const answeredCount = Object.keys(userAnswers).length;
  const skippedCount = total - answeredCount;
  const incorrectCount = answeredCount - score;
  const flaggedCount = Object.keys(flaggedQuestions).filter(k => flaggedQuestions[k]).length;

  // SVG Radial Gauge parameters
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Filtered questions for the review list
  const filteredQuestions = questions.filter((q, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === q.answerIndex;
    const isAnswered = userAnswer !== undefined && userAnswer !== null;
    const isFlagged = flaggedQuestions[index] === true;

    if (filter === 'correct') return isAnswered && isCorrect;
    if (filter === 'incorrect') return isAnswered && !isCorrect;
    if (filter === 'skipped') return !isAnswered;
    if (filter === 'flagged') return isFlagged;
    return true;
  });

  const getResultMessage = () => {
    if (percent >= 90) return "Excellent! You have mastered data mining concepts.";
    if (percent >= 75) return "Great job! You have a solid understanding of the material.";
    if (percent >= 50) return "Good effort. Review the incorrect answers to improve your score.";
    return "Keep studying! Review the questions below to understand the concepts better.";
  };

  return (
    <div className="result-card">
      <div className="header-brand">
        <h1>Quiz Results</h1>
        <p>Here is how you performed in the Data Mining test</p>
      </div>

      <div className="score-radial-container">
        <svg width="180" height="180" className="score-radial-svg">
          <defs>
            <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(250, 75%, 50%)" />
              <stop offset="100%" stopColor="hsl(310, 70%, 55%)" />
            </linearGradient>
          </defs>
          <circle 
            cx="90" 
            cy="90" 
            r={radius} 
            className="score-radial-bg" 
          />
          <circle 
            cx="90" 
            cy="90" 
            r={radius} 
            className="score-radial-value"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className="score-text-overlay">
          <span className="score-percent">{percent}%</span>
          <span className="score-absolute">{score} / {total}</span>
        </div>
      </div>

      <h2 className="result-heading">
        {percent >= 75 ? '🎉 Congratulations!' : '📚 Keep Learning!'}
      </h2>
      <p className="result-message">{getResultMessage()}</p>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Correct</span>
          <span className="stat-val success">{score}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Incorrect</span>
          <span className="stat-val error">{incorrectCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Bookmarked</span>
          <span className="stat-val" style={{ color: '#d97706' }}>{flaggedCount}</span>
        </div>
      </div>

      <button onClick={onRestart} className="btn btn-primary" style={{ minWidth: '200px' }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        Restart Quiz
      </button>

      {/* Review Section */}
      <div className="review-section">
        <h3 className="review-title">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Review Questions ({filteredQuestions.length})
        </h3>

        <div className="review-filters">
          <button 
            onClick={() => setFilter('all')} 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          >
            All Questions ({total})
          </button>
          <button 
            onClick={() => setFilter('correct')} 
            className={`filter-btn ${filter === 'correct' ? 'active' : ''}`}
          >
            Correct ({score})
          </button>
          <button 
            onClick={() => setFilter('incorrect')} 
            className={`filter-btn ${filter === 'incorrect' ? 'active' : ''}`}
          >
            Incorrect ({incorrectCount})
          </button>
          <button 
            onClick={() => setFilter('skipped')} 
            className={`filter-btn ${filter === 'skipped' ? 'active' : ''}`}
          >
            Skipped ({skippedCount})
          </button>
          <button 
            onClick={() => setFilter('flagged')} 
            className={`filter-btn ${filter === 'flagged' ? 'active' : ''}`}
          >
            Bookmarked ({flaggedCount})
          </button>
        </div>

        <div className="review-list">
          {filteredQuestions.map((q) => {
            const originalIndex = questions.findIndex(item => item.id === q.id);
            const userAnswer = userAnswers[originalIndex];
            const isBookmarked = flaggedQuestions[originalIndex] === true;
            
            return (
              <div key={q.id} className="review-item">
                <div className="review-q-num">
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>QUESTION {q.id}</span>
                    {isBookmarked && (
                      <span style={{ 
                        color: '#d97706', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '2px', 
                        fontWeight: '700', 
                        fontSize: '0.8rem',
                        background: 'rgba(245, 158, 11, 0.08)',
                        padding: '0.1rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid rgba(245, 158, 11, 0.15)'
                      }}>
                        <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                        Bookmarked
                      </span>
                    )}
                  </div>
                  {userAnswer === undefined || userAnswer === null ? (
                    <span className="badge badge-warning">Skipped</span>
                  ) : userAnswer === q.answerIndex ? (
                    <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.08)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.15)' }}>Correct</span>
                  ) : (
                    <span className="badge" style={{ background: 'rgba(239, 68, 68, 0.08)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.15)' }}>Incorrect</span>
                  )}
                </div>
                <Question 
                  question={q} 
                  selectedAnswer={userAnswer} 
                  reviewMode={true} 
                />
              </div>
            );
          })}

          {filteredQuestions.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No questions found for this filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
