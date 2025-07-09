let employeeCounter = 0;
let employees = {}; // Przechowuje dane wszystkich pracowników

// Konfiguracja Airtable
const AIRTABLE_CONFIG = {
    pat: '{{AIRTABLE_PAT}}',
    baseId: '{{AIRTABLE_BASE_ID}}',
    applicationsTableId: '{{AIRTABLE_APPLICATIONS_TABLE_ID}}',
    employeesTableId: '{{AIRTABLE_EMPLOYEES_TABLE_ID}}',
    baseUrl: 'https://api.airtable.com/v0'
};

// Dodawanie nowego pracownika
function addEmployee() {
    employeeCounter++;
    const container = document.getElementById('employeesContainer');
    
    const newEmployeeCard = document.createElement('div');
    newEmployeeCard.className = 'employee-card editing';
    newEmployeeCard.dataset.employee = employeeCounter;
    
    newEmployeeCard.innerHTML = `
  <div class="employee-editing-header">${employeeCounter}</div>
  <div class="editing-indicator">
    <i class="fas fa-edit"></i> Edytowanie
  </div>
  
  <div class="employee-form-content">
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
    <!-- Przyciski akcji -->
    <div class="form-row mt-4">
      <div class="d-flex justify-content-end gap-2">
        <button type="button" class="btn-employee btn-cancel" onclick="cancelEmployee(${employeeCounter})">
          <i class="fas fa-times"></i> Anuluj
        </button>
        <button type="button" class="btn-employee btn-save" onclick="saveEmployee(${employeeCounter})">
          <i class="fas fa-save"></i> Zapisz pracownika
        </button>
      </div>
    </div>
  </div>

  <div class="employee-header" style="display: none;">
    <div class="employee-info">
      <div class="employee-number">${employeeCounter}</div>
      <div class="employee-text">
        <div class="employee-summary" id="summary_${employeeCounter}"></div>
        <div class="employee-details" id="details_${employeeCounter}"></div>
      </div>
    </div>
    <div class="employee-actions">
      <button type="button" class="btn-employee btn-edit" onclick="editEmployee(${employeeCounter})">
        <i class="fas fa-edit"></i> Edytuj
      </button>
      <button type="button" class="btn-employee btn-remove" onclick="removeEmployee(${employeeCounter})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
`;
    
    container.appendChild(newEmployeeCard);
    updateAddButton();
    
    // Scroll do nowego pracownika
    newEmployeeCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Zapisywanie pracownika
function saveEmployee(employeeId) {
    const card = document.querySelector(`[data-employee="${employeeId}"]`);
    if (!validateEmployee(employeeId)) {
        showMessage('Wypełnij wszystkie wymagane pola pracownika', 'error');
        return;
    }

    // Zbierz dane pracownika
    const employeeData = getEmployeeData(employeeId);
    employees[employeeId] = employeeData;

    // Zmień stan karty na "saved"
    card.classList.remove('editing');
    card.classList.add('saved');

    // Pokaż header i ukryj formularz
    card.querySelector('.employee-header').style.display = 'flex';
    card.querySelector('.employee-form-content').style.display = 'none';
    card.querySelector('.editing-indicator').style.display = 'none';
    card.querySelector('.employee-editing-header').style.display = 'none';

    // Aktualizuj podsumowanie
    updateEmployeeSummary(employeeId, employeeData);

    updateAddButton();
    showMessage(`Pracownik ${employeeData.name} został zapisany`, 'success');
}

// Edytowanie pracownika
function editEmployee(employeeId) {
    const card = document.querySelector(`[data-employee="${employeeId}"]`);
    
    // Zmień stan na edycję
    card.classList.remove('saved');
    card.classList.add('editing');

    // Pokaż formularz i ukryj header
    card.querySelector('.employee-header').style.display = 'none';
    card.querySelector('.employee-form-content').style.display = 'block';
    card.querySelector('.editing-indicator').style.display = 'block';
    card.querySelector('.employee-editing-header').style.display = 'flex';

    // Wypełnij formularz danymi
    if (employees[employeeId]) {
        fillEmployeeForm(employeeId, employees[employeeId]);
    }

    updateAddButton();
}

// Anulowanie edycji
function cancelEmployee(employeeId) {
    if (employees[employeeId]) {
        // Jeśli pracownik już był zapisany, przywróć stan zapisany
        const card = document.querySelector(`[data-employee="${employeeId}"]`);
        card.classList.remove('editing');
        card.classList.add('saved');
        card.querySelector('.employee-header').style.display = 'flex';
        card.querySelector('.employee-form-content').style.display = 'none';
        card.querySelector('.editing-indicator').style.display = 'none';
        card.querySelector('.employee-editing-header').style.display = 'none';
    } else {
        // Jeśli to nowy pracownik, usuń go
        removeEmployee(employeeId);
    }
    updateAddButton();
}

// Walidacja danych pracownika
function validateEmployee(employeeId) {
    const card = document.querySelector(`[data-employee="${employeeId}"]`);
    const required = card.querySelectorAll('[required]');
    let isValid = true;

    required.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });

    return isValid;
}

// Pobieranie danych pracownika
function getEmployeeData(employeeId) {
    const card = document.querySelector(`[data-employee="${employeeId}"]`);
    return {
        name: card.querySelector(`[name="employee_${employeeId}_name"]`).value,
        gender: card.querySelector(`[name="employee_${employeeId}_gender"]`).value,
        age: card.querySelector(`[name="employee_${employeeId}_age"]`).value,
        education: card.querySelector(`[name="employee_${employeeId}_education"]`).value,
        position: card.querySelector(`[name="employee_${employeeId}_position"]`).value,
        contract_type: card.querySelector(`[name="employee_${employeeId}_contract_type"]`).value,
        contract_start: card.querySelector(`[name="employee_${employeeId}_contract_start"]`).value,
        contract_end: card.querySelector(`[name="employee_${employeeId}_contract_end"]`).value
    };
}

// Wypełnianie formularza danymi
function fillEmployeeForm(employeeId, data) {
    const card = document.querySelector(`[data-employee="${employeeId}"]`);
    Object.keys(data).forEach(key => {
        const field = card.querySelector(`[name="employee_${employeeId}_${key}"]`);
        if (field) field.value = data[key];
    });
}

// Aktualizacja podsumowania pracownika
function updateEmployeeSummary(employeeId, data) {
    const summaryEl = document.getElementById(`summary_${employeeId}`);
    const detailsEl = document.getElementById(`details_${employeeId}`);
    
    summaryEl.textContent = `${data.name} - ${data.position}`;
    
    // Ulepszone szczegóły z datami umowy
    let contractPeriod = '';
    if (data.contract_start) {
        contractPeriod = `od ${data.contract_start}`;
        if (data.contract_end) {
            contractPeriod += ` do ${data.contract_end}`;
        } else {
            contractPeriod += ' (nieokreślony)';
        }
    }
    
    detailsEl.textContent = `${data.gender === 'M' ? 'Mężczyzna' : 'Kobieta'}, ${data.age} lat, ${data.education}, ${data.contract_type.replace('_', ' ')}${contractPeriod ? ', ' + contractPeriod : ''}`;
}

// Aktualizacja przycisku dodawania
function updateAddButton() {
    const btn = document.getElementById('addEmployeeBtn');
    const hasEditingEmployees = document.querySelectorAll('.employee-card.editing').length > 0;
    const employeeCount = document.querySelectorAll('.employee-card').length;

    if (hasEditingEmployees) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'flex';
        if (employeeCount === 0) {
            btn.innerHTML = '<i class="fas fa-plus"></i> Dodaj pierwszego pracownika';
        } else {
            btn.innerHTML = '<i class="fas fa-plus"></i> Dodaj kolejnego pracownika';
        }
    }
}

// Usuwanie pracownika
function removeEmployee(employeeId) {
    const employeeCard = document.querySelector(`[data-employee="${employeeId}"]`);
    if (employeeCard) {
        employeeCard.remove();
        delete employees[employeeId];
        updateEmployeeNumbers();
        updateAddButton();
        showMessage('Pracownik został usunięty', 'success');
    }
}

// Aktualizacja numeracji i name= pól
function updateEmployeeNumbers() {
    const employeeCards = document.querySelectorAll('.employee-card');
    employeeCards.forEach((card, index) => {
        const newNum = index + 1;
        card.dataset.employee = newNum;
        
        // Aktualizuj numer w headerze zapisanego pracownika
        const numberEl = card.querySelector('.employee-number');
        if (numberEl) numberEl.textContent = newNum;
        
        // Aktualizuj numer w trybie edycji
        const editingHeader = card.querySelector('.employee-editing-header');
        if (editingHeader) editingHeader.textContent = newNum;
        
        // Aktualizuj onclick dla przycisków (bez remove-employee)
        card.querySelectorAll('[onclick*="saveEmployee"]').forEach(btn => {
            btn.setAttribute('onclick', `saveEmployee(${newNum})`);
        });
        card.querySelectorAll('[onclick*="editEmployee"]').forEach(btn => {
            btn.setAttribute('onclick', `editEmployee(${newNum})`);
        });
        card.querySelectorAll('[onclick*="cancelEmployee"]').forEach(btn => {
            btn.setAttribute('onclick', `cancelEmployee(${newNum})`);
        });
        card.querySelectorAll('[onclick*="removeEmployee"]').forEach(btn => {
            btn.setAttribute('onclick', `removeEmployee(${newNum})`);
        });
        
        // Zmieniamy name każdego input/select
        card.querySelectorAll('input, select').forEach(el => {
            const parts = el.name.split('_');
            // oryginalne: ["employee","X",...field]
            const field = parts.slice(2).join('_');
            el.name = `employee_${newNum}_${field}`;
        });
        
        // Aktualizuj ID podsumowania
        const summaryEl = card.querySelector('.employee-summary');
        if (summaryEl) summaryEl.id = `summary_${newNum}`;
        const detailsEl = card.querySelector('.employee-details');
        if (detailsEl) detailsEl.id = `details_${newNum}`;
    });
    employeeCounter = employeeCards.length;
}

// Generowanie podglądu (preview) z ulepszonym responsywnym wyświetlaniem
function generatePreview() {
  const formData = new FormData(document.getElementById('kfsForm'));
  
  // Dodaj dane zapisanych pracowników do FormData
  Object.keys(employees).forEach(employeeId => {
      const data = employees[employeeId];
      Object.keys(data).forEach(key => {
          formData.set(`employee_${employeeId}_${key}`, data[key]);
      });
  });
  
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
      <h4 class="preview-title">Pracownicy (${Object.keys(employees).length})</h4>
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
  
  let index = 1;
  Object.keys(employees).forEach(employeeId => {
      const emp = employees[employeeId];
      html += `
        <tr>
          <td>${index}</td>
          <td>${emp.name||'-'}</td>
          <td>${emp.position||'-'}</td>
          <td>${emp.gender||'-'}</td>
          <td>${emp.age||'-'}</td>
          <td>${emp.education||'-'}</td>
          <td>${emp.contract_type||'-'}</td>
          <td>${emp.contract_start||'-'}</td>
          <td>${emp.contract_end||'nieokreślony'}</td>
        </tr>`;
      index++;
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

        // Używaj zapisanych danych z obiektu employees
        Object.keys(employees).forEach(employeeId => {
            const emp = employees[employeeId];
            const employeeRecord = {
                fields: {
                    Id: `${submissionId}-${employeeIndex}`,
                    employee_name: emp.name || '',
                    gender: emp.gender || '',
                    age: parseInt(emp.age) || 0,
                    education: emp.education || '',
                    position: emp.position || '',
                    contract_type: emp.contract_type || '',
                    contract_start: emp.contract_start || '',
                    contract_end: emp.contract_end || '',
                    application_id: [applicationRecordId]
                }
            };
            employeeRecords.push(employeeRecord);
            employeeIndex++;
        });

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
  
  // Sprawdź czy są zapisani pracownicy
  if (Object.keys(employees).length === 0) {
    showMessage('Dodaj przynajmniej jednego pracownika', 'error');
    ok = false;
  }
  
  // Sprawdź czy nie ma pracowników w trybie edycji
  const editingEmployees = document.querySelectorAll('.employee-card.editing').length;
  if (editingEmployees > 0) {
    showMessage('Zapisz wszystkich pracowników przed wysłaniem wniosku', 'error');
    ok = false;
  }
  
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
    font-weight: 500; max-width: 350px;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Inicjalizacja po załadowaniu DOM
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addEmployeeBtn').addEventListener('click', addEmployee);
  
  document.getElementById('submitBtn').addEventListener('click', () => {
    if (!validateForm()) return;
    document.getElementById('previewContent').innerHTML = generatePreview();
    new bootstrap.Modal(document.getElementById('previewModal')).show();
  });
  
  document.getElementById('finalSubmitBtn').addEventListener('click', async function() {
    const btn = this; 
    const originalText = btn.innerHTML;
    btn.disabled = true; 
    btn.innerHTML = '<i class="fas fa-spinner spinner"></i> Wysyłam...';
    
    try {
      // Przygotuj dane do wysłania
      const formData = new FormData(document.getElementById('kfsForm'));
      
      // Dodaj dane zapisanych pracowników do FormData
      Object.keys(employees).forEach(employeeId => {
          const data = employees[employeeId];
          Object.keys(data).forEach(key => {
              formData.set(`employee_${employeeId}_${key}`, data[key]);
          });
      });
      
      const result = await submitToAirtable(Object.fromEntries(formData));
      
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
  
  updateAddButton();
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
