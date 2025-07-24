import React, { useState } from 'react';
import './App.css';
import FormContainer from './components/FormContainer';
import ThankYouPage from './components/ThankYouPage';

function App() {
  const [showThankYou, setShowThankYou] = useState(false);
  const [submissionData, setSubmissionData] = useState(null);

  const handleSubmissionSuccess = (data) => {
    setSubmissionData(data);
    setShowThankYou(true);
  };

  const handleNewSubmission = () => {
    setShowThankYou(false);
    setSubmissionData(null);
  };

  return (
    <div className="App">
      {showThankYou ? (
        <ThankYouPage 
          submissionData={submissionData} 
          onNewSubmission={handleNewSubmission}
        />
      ) : (
        <FormContainer onSubmissionSuccess={handleSubmissionSuccess} />
      )}
    </div>
  );
}

export default App;