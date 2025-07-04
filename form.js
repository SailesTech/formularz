let employeeCounter = 1;

// Konfiguracja Airtable
const AIRTABLE_CONFIG = {
    pat: 'pat2GsVT2OUjyaYt7.0f1c8cde267165a96b2d01bfb8724f748db8493b9d8ce6ad81f30cefd6f0ebfb',
    baseId: 'appglhQbUMO1xf7GO',
    applicationsTableId: 'tbl2SOkYU0eBG2ZGj', // Applications table
    employeesTableId: 'tblh7tsaWWwXxBgSi', // Employees table
    baseUrl: 'https://api.airtable.com/v0'
};

// Dodawanie nowego pracownika
function addEmployee() {
    employeeCounter++;
    const container = document.getElementById('employeesContainer');
    
    const newEmployeeCard = document.createElement('div');
    newEmployeeCard.className = 'employee-card';
    newEmployeeCard.dataset.employee = employeeCounter;
    
    newEmployeeCard.innerHTML = `
      <div class="employee-number">${employeeCounter}</div>
      <button type="button" class="remove-employee" onclick="removeEmployee(${employeeCounter})">
        <i class="fas fa-times"></i>
      </button>
      <!-- Wiersz 1: imię, płeć, wiek, wykształcenie -->
      <div class="form-row row">
        <div class="col-md-4">
          <label class="form-label">Imię i nazwisko <span class="required">*</span></label>
          <input type="text" class="form-control" name="employee_${employeeCounter}_name" required>
        </div>
        <div class="col-md-2">
          <label class="form-label">Płeć <span class="required">*</span></label>
          <select class="form-select" name="employee_${employeeCounter}_gender" required>
            <option value="">Wybierz</option>
            <option value="M">Mężczyzna</option>
            <option value="K">Kobieta</option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">Wiek <span class="required">*</span></label>
          <input type="number" class="form-control" name="employee_${employeeCounter}_age" min="18" max="70" required>
        </div>
        <div class="col-md-4">
          <label class="form-label">Wykształcenie <span class="required">*</span></label>
          <select class="form-select" name="employee_${employeeCounter}_education" required>
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
      <!-- Wiersz 2: stanowisko, rodzaj umowy, od, do -->
      <div class="form-row row">
        <div class="col-md-3">
          <label class="form-label">Stanowisko <span class="required">*</span></label>
          <input type="text" class="form-control" name="employee_${employeeCounter}_position" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Rodzaj umowy <span class="required">*</span></label>
          <select class="form-select" name="employee_${employeeCounter}_contract_type" required>
            <option value="">Wybierz</option>
            <option value="umowa_o_prace">Umowa o pracę</option>
            <option value="umowa_zlecenie">Umowa zlecenie</option>
            <option value="umowa_dzielo">Umowa o dzieło</option>
            <option value="b2b">Kontrakt B2B</option>
            <option value="powolanie">Powołanie</option>
            <option value="inne">Inne</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Od kiedy <span class="required">*</span></label>
          <input type="date" class="form-control" name="employee_${employeeCounter}_contract_start" required>
        </div>
        <div class="col-md-3">
          <label class="form-label">Do kiedy</label>
          <input type="date" class="form-control" name="employee_${employeeCounter}_contract_end">
        </div>
      </div>
    `;
    
    container.appendChild(newEmployeeCard);
    updateRemoveButtons();
}

// Usuwanie pracownika
function removeEmployee(employeeId) {
    const employeeCard = document.querySelector(`[data-employee="${employeeId}"]`);
    if (employeeCard) {
        employeeCard.remove();
        updateEmployeeNumbers();
        updateRemoveButtons();
    }
}

// Aktualizacja numeracji i name= pól
function updateEmployeeNumbers() {
    const employees = document.querySelectorAll('.employee-card');
    employees.forEach((card, index) => {
        const newNum = index + 1;
        card.dataset.employee = newNum;
        card.querySelector('.employee-number').textContent = newNum;
        card.querySelector('.remove-employee').setAttribute('onclick', `removeEmployee(${newNum})`);
        
        // Zmieniamy name każdego input/select
        card.querySelectorAll('input, select').forEach(el => {
            const parts = el.name.split('_');
            // oryginalne: ["employee","X",...field]
            const field = parts.slice(2).join('_');
            el.name = `employee_${newNum}_${field}`;
        });
    });
    employeeCounter = employees.length;
}

// Pokaż/ukryj przyciski usuwania
function updateRemoveButtons() {
    const cards = document.querySelectorAll('.employee-card');
    cards.forEach(card => {
        const btn = card.querySelector('.remove-employee');
        btn.style.display = cards.length > 1 ? 'flex' : 'none';
    });
}

// Generowanie podglądu (preview) z ulepszonym responsywnym wyświetlaniem
function generatePreview() {
  const formData = new FormData(document.getElementById('kfsForm'));
  const d = Object.fromEntries(formData);
  let html = `
    <div class="preview-section">
      <h4 class="preview-title">Dane podmiotu</h4>
      <div class="table-responsive">
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Nazwa</th><th>NIP</th><th>PKD</th>
              <th>Reprezentant</th><th>Tel. repr.</th>
              <th>Kontakt</th><th>Tel. kontakt.</th><th>E-mail</th>
              <th>Adres</th><th>Działalność</th><th>Korespondencja</th>
              <th>Bank</th><th>Konto</th><th>Liczba prac.</th>
              <th>Wielkość</th><th>Suma <2 mln EUR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${d.company_name||'-'}</td><td>${d.company_nip||'-'}</td><td>${d.company_pkd||'-'}</td>
              <td>${d.representative_person||'-'}</td><td>${d.representative_phone||'-'}</td>
              <td>${d.contact_person_name||'-'}</td><td>${d.contact_person_phone||'-'}</td><td>${d.contact_person_email||'-'}</td>
              <td>${d.company_address||'-'}</td><td>${d.activity_place||'-'}</td><td>${d.correspondence_address||'-'}</td>
              <td>${d.bank_name||'-'}</td><td>${d.bank_account||'-'}</td><td>${d.total_employees||'-'}</td>
              <td>${d.company_size||'-'}</td><td>${d.balance_under_2m||'-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="preview-section">
      <h4 class="preview-title">Pracownicy (${document.querySelectorAll('.employee-card').length})</h4>
      <div class="table-responsive">
        <table class="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Lp.</th><th>Imię i nazw.</th><th>Stanowisko</th><th>Płeć</th>
              <th>Wiek</th><th>Wykształcenie</th><th>Rodzaj umowy</th>
              <th>Od kiedy</th><th>Do kiedy</th>
            </tr>
          </thead>
          <tbody>`;
  document.querySelectorAll('.employee-card').forEach((_, i) => {
    const n = i + 1;
    html += `
      <tr>
        <td>${n}</td>
        <td>${d[`employee_${n}_name`]||'-'}</td>
        <td>${d[`employee_${n}_position`]||'-'}</td>
        <td>${d[`employee_${n}_gender`]||'-'}</td>
        <td>${d[`employee_${n}_age`]||'-'}</td>
        <td>${d[`employee_${n}_education`]||'-'}</td>
        <td>${d[`employee_${n}_contract_type`]||'-'}</td>
        <td>${d[`employee_${n}_contract_start`]||'-'}</td>
        <td>${d[`employee_${n}_contract_end`]||'nieokreślony'}</td>
      </tr>`;
  });
  html += `</tbody></table></div></div>`;
  return html;
}

// Pobieranie ostatniego ID z Airtable
async function getLastSubmissionId() {
    try {
        const response = await fetch(`${AIRTABLE_CONFIG.baseUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.applicationsTableId}?maxRecords=1&sort%5B0%5D%5Bfield%5D=submission_id&sort%5B0%5D%5Bdirection%5D=desc`, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.pat}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.records && data.records.length > 0) {
            const lastId = data.records[0].fields.submission_id;
            // Jeśli submission_id jest w formacie KFS-XXXX, wyciągnij numer
            if (lastId && lastId.startsWith('KFS-')) {
                return parseInt(lastId.replace('KFS-', ''));
            }
            // Jeśli to tylko numer
            return parseInt(lastId) || 0;
        }
        
        return 0; // Jeśli brak rekordów, zaczynamy od 0
    } catch (error) {
        console.warn('Nie udało się pobrać ostatniego ID, używam wartości domyślnej:', error);
        return 0;
    }
}

// Generowanie nowego submission ID
async function generateSubmissionId() {
    const lastId = await getLastSubmissionId();
    const newId = lastId + 1;
    return `KFS-${newId.toString().padStart(4, '0')}`;
}

// Rzeczywiste wysyłanie do Airtable
async function submitToAirtable(formData) {
    try {
        // Generuj nowe submission ID
        const submissionId = await generateSubmissionId();
        console.log('Wygenerowane submission ID:', submissionId);

        // KROK 1: Wyślij dane głównego wniosku do tabeli Applications
        const applicationData = {
            records: [{
                fields: {
                    submission_id: submissionId,
                    submission_date: new Date().toISOString(),
                    company_name: formData.company_name || '',
                    company_nip: formData.company_nip || '',
                    company_pkd: formData.company_pkd || '',
                    representative_person: formData.representative_person || '',
                    representative_phone: formData.representative_phone || '',
                    contact_person_name: formData.contact_person_name || '',
                    contact_person_phone: formData.contact_person_phone || '',
                    contact_person_email: formData.contact_person_email || '',
                    company_address: formData.company_address || '',
                    activity_place: formData.activity_place || '',
                    correspondence_address: formData.correspondence_address || '',
                    bank_name: formData.bank_name || '',
                    bank_account: formData.bank_account || '',
                    total_employees: parseInt(formData.total_employees) || 0,
                    company_size: formData.company_size || '',
                    balance_under_2m: formData.balance_under_2m || '',
                    status: 'Submitted'
                }
            }]
        };

        console.log('Dane głównego wniosku:', applicationData);

        // Wyślij dane głównego wniosku
        const applicationResponse = await fetch(`${AIRTABLE_CONFIG.baseUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.applicationsTableId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.pat}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });

        if (!applicationResponse.ok) {
            const errorData = await applicationResponse.json();
            console.error('Błąd wysyłania wniosku:', errorData);
            throw new Error(`Błąd Airtable Applications: ${applicationResponse.status} - ${errorData.error?.message || 'Nieznany błąd'}`);
        }

        const applicationResult = await applicationResponse.json();
        const applicationRecordId = applicationResult.records[0].id;
        console.log('Utworzono główny rekord wniosku:', applicationRecordId);

        // KROK 2: Zbierz i wyślij pracowników do tabeli Employees
        const employeeRecords = [];
        let employeeIndex = 1;
        
        while (formData[`employee_${employeeIndex}_name`]) {
            const employeeRecord = {
                fields: {
                    Id: `${submissionId}-${employeeIndex}`, // Własne ID: KFS-0001-1, KFS-0001-2, etc.
                    employee_name: formData[`employee_${employeeIndex}_name`] || '',
                    gender: formData[`employee_${employeeIndex}_gender`] || '',
                    age: parseInt(formData[`employee_${employeeIndex}_age`]) || 0,
                    education: formData[`employee_${employeeIndex}_education`] || '',
                    position: formData[`employee_${employeeIndex}_position`] || '',
                    contract_type: formData[`employee_${employeeIndex}_contract_type`] || '',
                    contract_start: formData[`employee_${employeeIndex}_contract_start`] || '',
                    contract_end: formData[`employee_${employeeIndex}_contract_end`] || '',
                    application_id: [applicationRecordId] // Link do głównego rekordu
                }
            };
            employeeRecords.push(employeeRecord);
            employeeIndex++;
        }

        if (employeeRecords.length > 0) {
            const employeeData = {
                records: employeeRecords
            };

            console.log('Dane pracowników:', employeeData);

            // Wyślij pracowników (batch do 10 rekordów na raz)
            const batchSize = 10;
            for (let i = 0; i < employeeRecords.length; i += batchSize) {
                const batch = employeeRecords.slice(i, i + batchSize);
                const batchData = { records: batch };

                const employeeResponse = await fetch(`${AIRTABLE_CONFIG.baseUrl}/${AIRTABLE_CONFIG.baseId}/${AIRTABLE_CONFIG.employeesTableId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${AIRTABLE_CONFIG.pat}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(batchData)
                });

                if (!employeeResponse.ok) {
                    const errorData = await employeeResponse.json();
                    console.error('Błąd wysyłania pracowników:', errorData);
                    throw new Error(`Błąd Airtable Employees: ${employeeResponse.status} - ${errorData.error?.message || 'Nieznany błąd'}`);
                }

                const employeeResult = await employeeResponse.json();
                console.log(`Utworzono batch pracowników (${i+1}-${i+batch.length}):`, employeeResult.records.map(r => `${r.fields.Id} (${r.id})`));
            }
        }

        return {
            success: true,
            submissionId: submissionId,
            applicationRecordId: applicationRecordId,
            employeeCount: employeeRecords.length
        };

    } catch (error) {
        console.error('Błąd podczas wysyłania do Airtable:', error);
        throw error;
    }
}

// Walidacja formularza
function validateForm() {
  const form = document.getElementById('kfsForm');
  const required = form.querySelectorAll('[required]');
  let ok = true, first;
  required.forEach(f => {
    if (!f.value.trim()) {
      f.classList.add('is-invalid');
      ok = false;
      if (!first) first = f;
    } else f.classList.remove('is-invalid');
  });
  if (!ok && first) first.focus();
  return ok;
}

// Wyświetlanie komunikatów
function showMessage(msg, type='success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; top:20px; right:20px; padding:15px 20px;
    background:${type==='success'? '#27ae60':'#c0392b'};
    color:#fff; border-radius:8px; z-index:9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    font-weight: 500;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addEmployeeBtn').addEventListener('click', addEmployee);
  
  document.getElementById('submitBtn').addEventListener('click', () => {
    if (!validateForm()) return showMessage('Wypełnij wymagane pola','error');
    document.getElementById('previewContent').innerHTML = generatePreview();
    new bootstrap.Modal(document.getElementById('previewModal')).show();
  });
  
  document.getElementById('finalSubmitBtn').addEventListener('click', async function() {
    const btn = this; 
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Wysyłam...';
    
    try {
      const formData = Object.fromEntries(new FormData(document.getElementById('kfsForm')));
      const result = await submitToAirtable(formData);
      
      if (result.success) {
        // Ukryj modal
        bootstrap.Modal.getInstance(document.getElementById('previewModal')).hide();
        
        // Ukryj główny kontener
        document.querySelector('.main-container').style.display = 'none';
        
        // Pokaż stronę dziękujemy
        document.getElementById('submissionNumber').textContent = result.submissionId + ` (${result.employeeCount} pracowników)`;
        document.getElementById('thankYouPage').style.display = 'flex';
    }
    } catch (error) {
      console.error('Błąd podczas wysyłania:', error);
      showMessage(`Błąd wysyłki: ${error.message}`, 'error');
    } finally {
      btn.disabled = false; 
      btn.innerHTML = originalText;
    }
  });
  
  // Walidacja w czasie rzeczywistym
  document.addEventListener('input', e => {
    if (e.target.required) {
      if (e.target.value.trim()) {
        e.target.classList.remove('is-invalid');
        e.target.classList.add('is-valid');
      } else {
        e.target.classList.remove('is-valid');
        e.target.classList.add('is-invalid');
      }
    }
  });
  
  updateRemoveButtons();
});

// Style dla animacji (dodaj do CSS jeśli potrzebne)
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .is-invalid {
        border-color: #e74c3c !important;
        box-shadow: 0 0 0 0.2rem rgba(231, 76, 60, 0.25) !important;
    }
    .is-valid {
        border-color: #27ae60 !important;
        box-shadow: 0 0 0 0.2rem rgba(39, 174, 96, 0.25) !important;
    }
    .spinner {
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
