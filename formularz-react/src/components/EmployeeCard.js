import React, { useState, useEffect } from 'react';

const EmployeeCard = ({ employee, employeeNumber, onUpdate, onRemove }) => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    education: '',
    position: '',
    contract_type: '',
    contract_start: '',
    contract_end: ''
  });
  
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setFormData({
      name: employee.name || '',
      gender: employee.gender || '',
      age: employee.age || '',
      education: employee.education || '',
      position: employee.position || '',
      contract_type: employee.contract_type || '',
      contract_start: employee.contract_start || '',
      contract_end: employee.contract_end || ''
    });
  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const fieldName = name.includes('_') ? name.split('_').pop() : name;
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear validation error
    if (validationErrors[fieldName]) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: undefined
      }));
    }
  };

  const validate = () => {
    const errors = {};
    const required = ['name', 'gender', 'age', 'education', 'position', 'contract_type', 'contract_start'];
    
    required.forEach(field => {
      if (!formData[field] || !formData[field].toString().trim()) {
        errors[field] = 'Pole wymagane';
      }
    });
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) {
      return;
    }
    
    onUpdate({
      ...formData,
      isEditing: false
    });
  };

  const handleEdit = () => {
    onUpdate({ isEditing: true });
  };

  const handleCancel = () => {
    if (employee.isNew) {
      onRemove();
    } else {
      // Reset form data to original values
      setFormData({
        name: employee.name || '',
        gender: employee.gender || '',
        age: employee.age || '',
        education: employee.education || '',
        position: employee.position || '',
        contract_type: employee.contract_type || '',
        contract_start: employee.contract_start || '',
        contract_end: employee.contract_end || ''
      });
      onUpdate({ isEditing: false });
    }
  };

  const getFieldClass = (fieldName) => {
    const baseClass = 'form-control';
    if (validationErrors[fieldName]) {
      return `${baseClass} is-invalid`;
    }
    if (formData[fieldName] && formData[fieldName].toString().trim()) {
      return `${baseClass} is-valid`;
    }
    return baseClass;
  };

  const getSelectClass = (fieldName) => {
    const baseClass = 'form-select';
    if (validationErrors[fieldName]) {
      return `${baseClass} is-invalid`;
    }
    if (formData[fieldName] && formData[fieldName].toString().trim()) {
      return `${baseClass} is-valid`;
    }
    return baseClass;
  };

  const formatEmployeeDetails = () => {
    const genderText = formData.gender === 'M' ? 'Mężczyzna' : 'Kobieta';
    const contractText = formData.contract_type.replace('_', ' ');
    let contractPeriod = '';
    
    if (formData.contract_start) {
      contractPeriod = `od ${formData.contract_start}`;
      if (formData.contract_end) {
        contractPeriod += ` do ${formData.contract_end}`;
      } else {
        contractPeriod += ' (nieokreślony)';
      }
    }
    
    return `${genderText}, ${formData.age} lat, ${formData.education}, ${contractText}${contractPeriod ? ', ' + contractPeriod : ''}`;
  };

  if (employee.isEditing) {
    return (
      <div className="employee-card editing">
        <div className="employee-editing-header">{employeeNumber}</div>
        <div className="editing-indicator">
          <i className="fas fa-edit"></i> Edytowanie
        </div>
        
        <div className="employee-form-content">
          {/* Wiersz 1: imię, płeć, wiek, wykształcenie */}
          <div className="form-row row">
            <div className="col-md-4">
              <label className="form-label">
                Imię i nazwisko <span className="required">*</span>
              </label>
              <input
                type="text"
                className={getFieldClass('name')}
                name={`employee_${employeeNumber}_name`}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-2">
              <label className="form-label">
                Płeć <span className="required">*</span>
              </label>
              <select
                className={getSelectClass('gender')}
                name={`employee_${employeeNumber}_gender`}
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Wybierz</option>
                <option value="M">Mężczyzna</option>
                <option value="K">Kobieta</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">
                Wiek <span className="required">*</span>
              </label>
              <input
                type="number"
                className={getFieldClass('age')}
                name={`employee_${employeeNumber}_age`}
                value={formData.age}
                onChange={handleChange}
                min="18"
                max="70"
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">
                Wykształcenie <span className="required">*</span>
              </label>
              <select
                className={getSelectClass('education')}
                name={`employee_${employeeNumber}_education`}
                value={formData.education}
                onChange={handleChange}
                required
              >
                <option value="">Wybierz</option>
                <option value="podstawowe">Podstawowe</option>
                <option value="gimnazjalne">Gimnazjalne</option>
                <option value="zawodowe">Zasadnicze zawodowe</option>
                <option value="srednie">Średnie</option>
                <option value="policealne">Policealne</option>
                <option value="wyzsze">Wyższe</option>
              </select>
            </div>
          </div>

          {/* Wiersz 2: stanowisko, rodzaj umowy, od, do */}
          <div className="form-row row">
            <div className="col-md-3">
              <label className="form-label">
                Stanowisko <span className="required">*</span>
              </label>
              <input
                type="text"
                className={getFieldClass('position')}
                name={`employee_${employeeNumber}_position`}
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">
                Rodzaj umowy <span className="required">*</span>
              </label>
              <select
                className={getSelectClass('contract_type')}
                name={`employee_${employeeNumber}_contract_type`}
                value={formData.contract_type}
                onChange={handleChange}
                required
              >
                <option value="">Wybierz</option>
                <option value="umowa_o_prace">Umowa o pracę</option>
                <option value="umowa_zlecenie">Umowa zlecenie</option>
                <option value="umowa_dzielo">Umowa o dzieło</option>
                <option value="b2b">Kontrakt B2B</option>
                <option value="powolanie">Powołanie</option>
                <option value="inne">Inne</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">
                Od kiedy <span className="required">*</span>
              </label>
              <input
                type="date"
                className={getFieldClass('contract_start')}
                name={`employee_${employeeNumber}_contract_start`}
                value={formData.contract_start}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Do kiedy</label>
              <input
                type="date"
                className={getFieldClass('contract_end')}
                name={`employee_${employeeNumber}_contract_end`}
                value={formData.contract_end}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Przyciski akcji */}
          <div className="form-row mt-4">
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn-employee btn-cancel"
                onClick={handleCancel}
              >
                <i className="fas fa-times"></i> Anuluj
              </button>
              <button
                type="button"
                className="btn-employee btn-save"
                onClick={handleSave}
              >
                <i className="fas fa-save"></i> Zapisz pracownika
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-card saved">
      <div className="employee-header">
        <div className="employee-info">
          <div className="employee-number">{employeeNumber}</div>
          <div className="employee-text">
            <div className="employee-summary">
              {formData.name} - {formData.position}
            </div>
            <div className="employee-details">
              {formatEmployeeDetails()}
            </div>
          </div>
        </div>
        <div className="employee-actions">
          <button
            type="button"
            className="btn-employee btn-edit"
            onClick={handleEdit}
          >
            <i className="fas fa-edit"></i> Edytuj
          </button>
          <button
            type="button"
            className="btn-employee btn-remove"
            onClick={onRemove}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;