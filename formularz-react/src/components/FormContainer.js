import React, { useState } from 'react';
import CompanyDataSection from './CompanyDataSection';
import EmployeeSection from './EmployeeSection';
import PreviewModal from './PreviewModal';
import { submitToAirtable } from '../services/airtableService';

const FormContainer = ({ onSubmissionSuccess }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    company_nip: '',
    company_pkd: '',
    representative_person: '',
    representative_phone: '',
    contact_person_name: '',
    contact_person_phone: '',
    contact_person_email: '',
    company_address: '',
    activity_place: '',
    correspondence_address: '',
    bank_name: '',
    bank_account: '',
    total_employees: '',
    company_size: '',
    balance_under_2m: ''
  });

  const [employees, setEmployees] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const required = [
      'company_name', 'company_nip', 'company_pkd', 'representative_person',
      'representative_phone', 'contact_person_name', 'contact_person_phone',
      'contact_person_email', 'company_address', 'activity_place',
      'correspondence_address', 'bank_name', 'bank_account', 'total_employees',
      'company_size', 'balance_under_2m'
    ];

    required.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        errors[field] = 'To pole jest wymagane';
      }
    });

    // Sprawdź czy są zapisani pracownicy
    if (Object.keys(employees).length === 0) {
      errors.employees = 'Dodaj przynajmniej jednego pracownika';
    }

    // Sprawdź czy nie ma pracowników w trybie edycji
    const editingEmployees = Object.values(employees).filter(emp => emp.isEditing);
    if (editingEmployees.length > 0) {
      errors.employees = 'Zapisz wszystkich pracowników przed wysłaniem wniosku';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showMessage('Wypełnij wszystkie wymagane pola', 'error');
      return;
    }
    setShowPreview(true);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitToAirtable(formData, employees);
      
      if (result.success) {
        onSubmissionSuccess(result);
      }
    } catch (error) {
      console.error('Błąd podczas wysyłania:', error);
      showMessage(`Błąd wysyłki: ${error.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showMessage = (msg, type = 'success') => {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position:fixed; top:20px; right:20px; padding:15px 20px;
      background:${type === 'success' ? '#27ae60' : '#c0392b'};
      color:#fff; border-radius:8px; z-index:9999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-weight: 500; max-width: 350px;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  return (
    <div className="main-container">
      {/* Header z logo */}
      <div className="header-section">
        <div className="logo">
          <i className="fas fa-file-contract"></i>
        </div>
        <h1 className="header-title">
          Wniosek o sfinansowanie kosztów kształcenia ustawicznego pracowników
        </h1>
      </div>

      <div className="form-content">
        <form id="kfsForm" onSubmit={(e) => e.preventDefault()}>
          <CompanyDataSection 
            formData={formData}
            onChange={handleFormChange}
            validationErrors={validationErrors}
          />
          
          <EmployeeSection 
            employees={employees}
            setEmployees={setEmployees}
            validationErrors={validationErrors}
          />

          {/* Submit Section */}
          <div className="submit-section">
            <div className="mb-3">
              <small className="text-muted">
                <i className="fas fa-check-circle text-success"></i>
                Przed wysłaniem sprawdź wszystkie dane w podglądzie
              </small>
            </div>
            <button 
              type="button" 
              className="btn-submit" 
              onClick={handleSubmit}
            >
              <i className="fas fa-paper-plane"></i>
              Wyślij wniosek
            </button>
          </div>
        </form>
      </div>

      {showPreview && (
        <PreviewModal 
          formData={formData}
          employees={employees}
          onClose={() => setShowPreview(false)}
          onSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default FormContainer;