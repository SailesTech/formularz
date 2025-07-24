import React from 'react';

const CompanyDataSection = ({ formData, onChange, validationErrors }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
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

  return (
    <div className="mb-5">
      <h2 className="section-title">
        <i className="fas fa-building"></i>
        Sekcja 1: Dane podmiotu
      </h2>
      
      {/* Wiersz 1: nazwa | NIP | PKD */}
      <div className="form-row">
        <div className="row">
          <div className="col-md-4">
            <label className="form-label">
              Nazwa podmiotu <span className="required">*</span>
            </label>
            <input
              type="text"
              className={getFieldClass('company_name')}
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              NIP <span className="required">*</span>
            </label>
            <input
              type="text"
              className={getFieldClass('company_nip')}
              name="company_nip"
              value={formData.company_nip}
              onChange={handleChange}
              pattern="[0-9]{3}-?[0-9]{3}-?[0-9]{2}-?[0-9]{2}"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              Główne PKD <span className="required">*</span>
            </label>
            <input
              type="text"
              className={getFieldClass('company_pkd')}
              name="company_pkd"
              value={formData.company_pkd}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Wiersz 2: reprezentant i kontakt w jednej linii */}
      <div className="form-row">
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">
              Reprezentant <span className="required">*</span>
            </label>
            <input
              type="text"
              className={getFieldClass('representative_person')}
              name="representative_person"
              value={formData.representative_person}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">
              Tel. repr. <span className="required">*</span>
            </label>
            <input
              type="tel"
              className={getFieldClass('representative_phone')}
              name="representative_phone"
              value={formData.representative_phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">
              Kontakt (imię i nazw.) <span className="required">*</span>
            </label>
            <input
              type="text"
              className={getFieldClass('contact_person_name')}
              name="contact_person_name"
              value={formData.contact_person_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">
              Tel. kontaktowy <span className="required">*</span>
            </label>
            <input
              type="tel"
              className={getFieldClass('contact_person_phone')}
              name="contact_person_phone"
              value={formData.contact_person_phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">
              E-mail kontaktowy <span className="required">*</span>
            </label>
            <input
              type="email"
              className={getFieldClass('contact_person_email')}
              name="contact_person_email"
              value={formData.contact_person_email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>

      {/* Wiersz 3: adresy */}
      <div className="form-row">
        <div className="row">
          <div className="col-md-4">
            <label className="form-label">
              Adres siedziby <span className="required">*</span>
            </label>
            <textarea
              className={getFieldClass('company_address')}
              name="company_address"
              value={formData.company_address}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              Miejsce działalności <span className="required">*</span>
            </label>
            <textarea
              className={getFieldClass('activity_place')}
              name="activity_place"
              value={formData.activity_place}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">
              Adres korespondencji <span className="required">*</span>
            </label>
            <textarea
              className={getFieldClass('correspondence_address')}
              name="correspondence_address"
              value={formData.correspondence_address}
              onChange={handleChange}
              rows="2"
              required
            />
          </div>
        </div>
      </div>

      {/* Wiersz 4: bank, konto, pracownicy, wielkość, suma */}
      <div className="form-row">
        <div className="row">
          <div className="col-md-2">
            <label className="form-label">
              Nazwa banku <span className="required">*</span>
            </label>
            <input
              type="text"
              className={getFieldClass('bank_name')}
              name="bank_name"
              value={formData.bank_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">
              Numer konta <span className="required">*</span>
            </label>
            <input
              type="text"
              className={getFieldClass('bank_account')}
              name="bank_account"
              value={formData.bank_account}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">
              Łączna liczba prac. <span className="required">*</span>
            </label>
            <input
              type="number"
              className={getFieldClass('total_employees')}
              name="total_employees"
              value={formData.total_employees}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">
              Wielkość podmiotu <span className="required">*</span>
            </label>
            <select
              className={getSelectClass('company_size')}
              name="company_size"
              value={formData.company_size}
              onChange={handleChange}
              required
            >
              <option value="">Wybierz</option>
              <option value="mikro">Mikro</option>
              <option value="mały">Mały</option>
              <option value="średni">Średni</option>
              <option value="duży">Duży</option>
              <option value="inne">Inne</option>
            </select>
          </div>
          <div className="col-md-3">
            <label className="form-label">
              Roczna suma &lt;2 mln EUR? <span className="required">*</span>
            </label>
            <select
              className={getSelectClass('balance_under_2m')}
              name="balance_under_2m"
              value={formData.balance_under_2m}
              onChange={handleChange}
              required
            >
              <option value="">Wybierz</option>
              <option value="tak">TAK</option>
              <option value="nie">NIE</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDataSection;