import React, { useState } from 'react';
import EmployeeCard from './EmployeeCard';

const EmployeeSection = ({ employees, setEmployees, validationErrors }) => {
  const [nextId, setNextId] = useState(1);

  const addEmployee = () => {
    const newEmployee = {
      id: nextId,
      name: '',
      gender: '',
      age: '',
      education: '',
      position: '',
      contract_type: '',
      contract_start: '',
      contract_end: '',
      isEditing: true,
      isNew: true
    };
    
    setEmployees(prev => ({
      ...prev,
      [nextId]: newEmployee
    }));
    
    setNextId(prev => prev + 1);
  };

  const updateEmployee = (id, data) => {
    setEmployees(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        ...data
      }
    }));
  };

  const removeEmployee = (id) => {
    setEmployees(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const getEmployeeCount = () => {
    return Object.keys(employees).length;
  };

  const hasEditingEmployees = () => {
    return Object.values(employees).some(emp => emp.isEditing);
  };

  const getButtonText = () => {
    const count = getEmployeeCount();
    if (count === 0) {
      return 'Dodaj pierwszego pracownika';
    }
    return 'Dodaj kolejnego pracownika';
  };

  return (
    <div className="mb-5">
      <h2 className="section-title">
        <i className="fas fa-users"></i>
        Sekcja 2: Dane pracowników
      </h2>
      
      <div id="employeesContainer">
        {Object.entries(employees).map(([id, employee], index) => (
          <EmployeeCard
            key={id}
            employee={employee}
            employeeNumber={index + 1}
            onUpdate={(data) => updateEmployee(id, data)}
            onRemove={() => removeEmployee(id)}
          />
        ))}
      </div>

      <div className="add-employee-section">
        <p className="text-muted mb-3">
          <i className="fas fa-info-circle"></i>
          Dodaj pracowników, dla których składasz wniosek o finansowanie kształcenia
        </p>
        
        {validationErrors.employees && (
          <div className="alert alert-danger">
            {validationErrors.employees}
          </div>
        )}
        
        {!hasEditingEmployees() && (
          <button 
            type="button" 
            className="add-employee-btn"
            onClick={addEmployee}
          >
            <i className="fas fa-plus"></i> {getButtonText()}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeSection;