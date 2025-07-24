import React from 'react';

const PreviewModal = ({ formData, employees, onClose, onSubmit, isSubmitting }) => {
  const generatePreview = () => {
    const employeeCount = Object.keys(employees).length;
    
    const companyData = [
      [
        formData.company_name || '-',
        formData.company_nip || '-',
        formData.company_pkd || '-',
        formData.representative_person || '-',
        formData.representative_phone || '-',
        formData.contact_person_name || '-',
        formData.contact_person_phone || '-',
        formData.contact_person_email || '-',
        formData.company_address || '-',
        formData.activity_place || '-',
        formData.correspondence_address || '-',
        formData.bank_name || '-',
        formData.bank_account || '-',
        formData.total_employees || '-',
        formData.company_size || '-',
        formData.balance_under_2m || '-'
      ]
    ];

    const employeeData = Object.values(employees).map((emp, index) => [
      index + 1,
      emp.name || '-',
      emp.position || '-',
      emp.gender || '-',
      emp.age || '-',
      emp.education || '-',
      emp.contract_type || '-',
      emp.contract_start || '-',
      emp.contract_end || 'nieokreślony'
    ]);

    return { companyData, employeeData, employeeCount };
  };

  const { companyData, employeeData, employeeCount } = generatePreview();

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fas fa-eye"></i>
                Podgląd wniosku przed wysłaniem
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={onClose}
              />
            </div>
            
            <div className="modal-body">
              <div className="preview-section">
                <h4 className="preview-title">Dane podmiotu</h4>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Nazwa</th>
                        <th>NIP</th>
                        <th>PKD</th>
                        <th>Reprezentant</th>
                        <th>Tel. repr.</th>
                        <th>Kontakt</th>
                        <th>Tel. kontakt.</th>
                        <th>E-mail</th>
                        <th>Adres</th>
                        <th>Działalność</th>
                        <th>Korespondencja</th>
                        <th>Bank</th>
                        <th>Konto</th>
                        <th>Liczba prac.</th>
                        <th>Wielkość</th>
                        <th>Suma &lt;2 mln EUR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyData.map((row, index) => (
                        <tr key={index}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="preview-section">
                <h4 className="preview-title">Pracownicy ({employeeCount})</h4>
                <div className="table-responsive">
                  <table className="table table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>Lp.</th>
                        <th>Imię i nazw.</th>
                        <th>Stanowisko</th>
                        <th>Płeć</th>
                        <th>Wiek</th>
                        <th>Wykształcenie</th>
                        <th>Rodzaj umowy</th>
                        <th>Od kiedy</th>
                        <th>Do kiedy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeData.map((row, index) => (
                        <tr key={index}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                <i className="fas fa-edit"></i> Popraw dane
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={onSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner spinner"></i> Wysyłam...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check"></i> Wyślij wniosek
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
};

export default PreviewModal;