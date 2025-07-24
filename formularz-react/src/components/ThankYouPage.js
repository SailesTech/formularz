import React from 'react';

const ThankYouPage = ({ submissionData, onNewSubmission }) => {
  return (
    <div className="thank-you-page">
      <div className="thank-you-content">
        <div className="thank-you-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="thank-you-title">Dziękujemy za przesłanie zgłoszenia!</h2>
        <p className="thank-you-message">
          Twój wniosek został pomyślnie wysłany.<br />
          <strong>
            Numer zgłoszenia: {submissionData?.submissionId} ({submissionData?.employeeCount} pracowników)
          </strong>
        </p>
        <p className="thank-you-info">
          Skontaktujemy się z Tobą w ciągu 2-3 dni roboczych.
        </p>
        <button 
          type="button" 
          className="btn-submit" 
          onClick={onNewSubmission}
        >
          <i className="fas fa-plus"></i> Wyślij kolejne zgłoszenie
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;