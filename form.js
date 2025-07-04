let employeeCounter = 1;

// Dodawanie nowego pracownika
function addEmployee() {
    employeeCounter++;
    const container = document.getElementById('employeesContainer');
    
    const newEmployeeCard = document.createElement('div');
    newEmployeeCard.className = 'employee-card';
    newEmployeeCard.setAttribute('data-employee', employeeCounter);
    
    newEmployeeCard.innerHTML = `
        <div class="employee-number">${employeeCounter}</div>
        <button type="button" class="remove-employee" onclick="removeEmployee(${employeeCounter})">
            <i class="fas fa-times"></i>
        </button>
        <!-- Wiersz 1: imię, płeć, wiek, wykształcenie -->
      <div class="form-row">
        <div class="row">
          <div class="col-md-4">
            <label class="form-label">Imię i nazwisko <span class="required">*</span></label>
            <input type="text" class="form-control" name="employee_1_name" required>
          </div>
          <div class="col-md-2">
            <label class="form-label">Płeć <span class="required">*</span></label>
            <select class="form-select" name="employee_1_gender" required>
              <option value="">Wybierz</option>
              <option value="M">Mężczyzna</option>
              <option value="K">Kobieta</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label">Wiek <span class="required">*</span></label>
            <input type="number" class="form-control" name="employee_1_age" min="18" max="70" required>
          </div>
          <div class="col-md-4">
            <label class="form-label">Wykształcenie <span class="required">*</span></label>
            <select class="form-select" name="employee_1_education" required>
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
      </div>
      <!-- Wiersz 2: stanowisko, rodzaj umowy, od, do -->
      <div class="form-row">
        <div class="row">
          <div class="col-md-3">
            <label class="form-label">Stanowisko <span class="required">*</span></label>
            <input type="text" class="form-control" name="employee_1_position" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Rodzaj umowy <span class="required">*</span></label>
            <select class="form-select" name="employee_1_contract_type" required>
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
            <input type="date" class="form-control" name="employee_1_contract_start" required>
          </div>
          <div class="col-md-3">
            <label class="form-label">Do kiedy</label>
            <input type="date" class="form-control" name="employee_1_contract_end">
          </div>
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

// Aktualizacja numeracji pracowników
function updateEmployeeNumbers() {
    const employees = document.querySelectorAll('.employee-card');
    employees.forEach((card, index) => {
        const number = index + 1;
        card.setAttribute('data-employee', number);
        card.querySelector('.employee-number').textContent = number;
        
        // Aktualizuj nazwy pól
        const inputs = card.querySelectorAll('input, select');
        inputs.forEach(input => {
            const name = input.name;
            if (name && name.includes('employee_')) {
                const fieldName = name.split('_').slice(2).join('_');
                input.name = `employee_${number}_${fieldName}`;
            }
        });

        // Aktualizuj onclick dla przycisku usuwania
        const removeBtn = card.querySelector('.remove-employee');
        if (removeBtn) {
            removeBtn.setAttribute('onclick', `removeEmployee(${number})`);
        }
    });
    
    employeeCounter = employees.length;
}

// Aktualizacja widoczności przycisków usuwania
function updateRemoveButtons() {
    const employees = document.querySelectorAll('.employee-card');
    employees.forEach((card, index) => {
        const removeBtn = card.querySelector('.remove-employee');
        if (removeBtn) {
            removeBtn.style.display = employees.length > 1 ? 'flex' : 'none';
        }
    });
}

// Funkcja do generowania podglądu
function generatePreview() {
  const formData = new FormData(document.getElementById('kfsForm'));
  const d = Object.fromEntries(formData);
  let html = `
    <div class="preview-section">
      <h4 class="preview-title">Dane podmiotu</h4>
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
            <td>${d.company_name||'-'}</td>
            <td>${d.company_nip||'-'}</td>
            <td>${d.company_pkd||'-'}</td>
            <td>${d.representative_person||'-'}</td>
            <td>${d.representative_phone||'-'}</td>
            <td>${d.contact_person_name||'-'}</td>
            <td>${d.contact_person_phone||'-'}</td>
            <td>${d.contact_person_email||'-'}</td>
            <td>${d.company_address||'-'}</td>
            <td>${d.activity_place||'-'}</td>
            <td>${d.correspondence_address||'-'}</td>
            <td>${d.bank_name||'-'}</td>
            <td>${d.bank_account||'-'}</td>
            <td>${d.total_employees||'-'}</td>
            <td>${d.company_size||'-'}</td>
            <td>${d.balance_under_2m||'-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="preview-section">
      <h4 class="preview-title">Pracownicy (${document.querySelectorAll('.employee-card').length})</h4>
      <table class="table table-bordered table-sm">
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
        <tbody>`;
  document.querySelectorAll('.employee-card').forEach((card, i) => {
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
  html += `</tbody></table></div>`;
  return html;
}

// Funkcja walidacji formularza
function validateForm() {
    const form = document.getElementById('kfsForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    let firstInvalidField = null;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        } else {
            field.classList.remove('is-invalid');
        }
    });

    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return isValid;
}

// Funkcja wysyłania danych do Airtable (przygotowana do implementacji)
async function submitToAirtable(formData) {
    // TODO: Implementacja wysyłania do Airtable
    console.log('Dane do wysłania do Airtable:', formData);
    
    // Symulacja wysyłania
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, message: 'Wniosek został wysłany pomyślnie!' });
        }, 1000);
    });
}

// Funkcja pokazywania komunikatów
function showMessage(message, type = 'success') {
    // Tworzy toast notification
    const toastContainer = document.createElement('div');
    toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease-out;
    `;
    toastContainer.textContent = message;
    
    document.body.appendChild(toastContainer);
    
    setTimeout(() => {
        toastContainer.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(toastContainer);
        }, 300);
    }, 3000);
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Dodawanie pracowników
    document.getElementById('addEmployeeBtn').addEventListener('click', addEmployee);
    
    // Submit button - pokazuje podgląd
    document.getElementById('submitBtn').addEventListener('click', function() {
        if (validateForm()) {
            // Generuj podgląd
            const previewContent = generatePreview();
            document.getElementById('previewContent').innerHTML = previewContent;
            
            // Pokaż modal
            const modal = new bootstrap.Modal(document.getElementById('previewModal'));
            modal.show();
        } else {
            showMessage('Proszę wypełnić wszystkie wymagane pola', 'error');
        }
    });

    // Final submit - rzeczywiste wysłanie
    document.getElementById('finalSubmitBtn').addEventListener('click', async function() {
        const submitBtn = this;
        const originalText = submitBtn.innerHTML;
        
        // Pokaż loading
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Wysyłanie...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(document.getElementById('kfsForm'));
            const data = Object.fromEntries(formData);
            
            // Wyślij do Airtable
            const result = await submitToAirtable(data);
            
            if (result.success) {
                showMessage(result.message, 'success');
                
                // Zamknij modal
                bootstrap.Modal.getInstance(document.getElementById('previewModal')).hide();
                
                // Opcjonalnie: wyczyść formularz
                // document.getElementById('kfsForm').reset();
                
            } else {
                throw new Error(result.message || 'Błąd podczas wysyłania');
            }
        } catch (error) {
            console.error('Błąd wysyłania:', error);
            showMessage('Wystąpił błąd podczas wysyłania wniosku. Spróbuj ponownie.', 'error');
        } finally {
            // Przywróć przycisk
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Walidacja w czasie rzeczywistym
    document.addEventListener('input', function(e) {
        if (e.target.hasAttribute('required')) {
            if (e.target.value.trim()) {
                e.target.classList.remove('is-invalid');
                e.target.classList.add('is-valid');
            } else {
                e.target.classList.remove('is-valid');
            }
        }
    });
    
    // Inicjalizacja przycisków usuwania
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
    }
    .is-valid {
        border-color: #27ae60 !important;
    }
`;
document.head.appendChild(style);
