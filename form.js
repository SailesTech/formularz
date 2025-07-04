let employeeCounter = 1;

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

// Generowanie podglądu (preview)
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
    <div class="preview-section">
      <h4 class="preview-title">Pracownicy (${document.querySelectorAll('.employee-card').length})</h4>
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
  html += `</tbody></table></div>`;
  return html;
}

// Reszta funkcji (walidacja, wysyłka, toasty, init)
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

async function submitToAirtable(data) {
  console.log('Wysyłam do Airtable:', data);
  return new Promise(r => setTimeout(() => r({success:true}), 500));
}

function showMessage(msg, type='success') {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; top:20px; right:20px; padding:10px 15px;
    background:${type==='success'? '#27ae60':'#c0392b'};
    color:#fff; border-radius:5px; z-index:9999;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('addEmployeeBtn').addEventListener('click', addEmployee);
  document.getElementById('submitBtn').addEventListener('click', () => {
    if (!validateForm()) return showMessage('Wypełnij wymagane pola','error');
    document.getElementById('previewContent').innerHTML = generatePreview();
    new bootstrap.Modal(document.getElementById('previewModal')).show();
  });
  document.getElementById('finalSubmitBtn').addEventListener('click', async function() {
    const btn = this; btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
      const data = Object.fromEntries(new FormData(document.getElementById('kfsForm')));
      const res = await submitToAirtable(data);
      showMessage(res.success? 'Wysłano pomyślnie':'Błąd','success');
      bootstrap.Modal.getInstance(document.getElementById('previewModal')).hide();
    } catch {
      showMessage('Błąd wysyłki','error');
    } finally {
      btn.disabled = false; btn.textContent = 'Wyślij wniosek';
    }
  });
  // real-time validation
  document.addEventListener('input', e => {
    if (e.target.required) {
      e.target.classList.toggle('is-valid', !!e.target.value.trim());
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
    }
    .is-valid {
        border-color: #27ae60 !important;
    }
`;
document.head.appendChild(style);
