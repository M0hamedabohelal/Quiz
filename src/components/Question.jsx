import React from 'react';

const Question = ({ question, selectedAnswer, onSelectAnswer, isFlagged = false, onToggleFlag, reviewMode = false }) => {
  if (!question) return null;

  const { question: text, options, answerIndex, type } = question;

  const isAnswered = selectedAnswer !== null && selectedAnswer !== undefined;
  const showFeedback = reviewMode || isAnswered;
  const isCorrect = selectedAnswer === answerIndex;

  const getOptionClass = (index) => {
    if (showFeedback) {
      if (index === answerIndex) {
        return 'option-card correct';
      }
      if (selectedAnswer === index && selectedAnswer !== answerIndex) {
        return 'option-card wrong';
      }
      return 'option-card';
    } else {
      return selectedAnswer === index ? 'option-card selected' : 'option-card';
    }
  };

  const getOptionPrefix = (index) => {
    if (type === 'boolean') {
      return index === 0 ? 'T' : 'F';
    }
    return String.fromCharCode(65 + index); // A, B, C, D, E
  };

  return (
    <div className="question-container" key={question.id}>
      <div className="question-meta">
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-info">Question #{question.id}</span>
          <span className="badge badge-warning">
            {type === 'boolean' ? 'True / False' : 'Multiple Choice'}
          </span>
        </div>
        
        {!reviewMode && onToggleFlag && (
          <button 
            onClick={onToggleFlag}
            className={`badge badge-flagged ${isFlagged ? 'active' : ''}`}
            title={isFlagged ? 'Remove Bookmark' : 'Bookmark Question'}
            type="button"
          >
            <svg width="12" height="12" fill={isFlagged ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            {isFlagged ? 'Bookmarked' : 'Bookmark'}
          </button>
        )}
      </div>
      
      <h2 className="question-text">{text}</h2>
      
      <div className="options-grid">
        {options.map((option, index) => (
          <button
            key={index}
            className={getOptionClass(index)}
            onClick={() => !showFeedback && onSelectAnswer(index)}
            disabled={showFeedback}
            type="button"
          >
            <span className="option-prefix">{getOptionPrefix(index)}</span>
            <span className="option-text">{option}</span>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div className={`feedback-box ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
          {isCorrect ? (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Correct Answer!</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Incorrect. The correct answer is <strong>{type === 'boolean' ? (answerIndex === 0 ? 'True' : 'False') : String.fromCharCode(65 + answerIndex)}: {options[answerIndex]}</strong>.
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Question;
