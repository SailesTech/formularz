// Konfiguracja Airtable
const AIRTABLE_CONFIG = {
    pat: '{{AIRTABLE_PAT}}',
    baseId: '{{AIRTABLE_BASE_ID}}',
    applicationsTableId: '{{AIRTABLE_APPLICATIONS_TABLE_ID}}',
    employeesTableId: '{{AIRTABLE_EMPLOYEES_TABLE_ID}}',
    baseUrl: 'https://api.airtable.com/v0'
};

// Pobieranie ostatniego ID z Airtable
export const getLastSubmissionId = async () => {
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
};

// Generowanie nowego submission ID
export const generateSubmissionId = async () => {
    const lastId = await getLastSubmissionId();
    const newId = lastId + 1;
    return `KFS-${newId.toString().padStart(4, '0')}`;
};

// Rzeczywiste wysyłanie do Airtable
export const submitToAirtable = async (formData, employees) => {
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
};