# Formularz KFS 2025 - React Version

Aplikacja React do składania wniosków o sfinansowanie kosztów kształcenia ustawicznego pracowników.

## Funkcjonalności

- **Sekcja 1: Dane podmiotu** - formularz z danymi firmy, kontaktami i informacjami bankowymi
- **Sekcja 2: Dane pracowników** - dynamiczne zarządzanie pracownikami z możliwością dodawania, edycji i usuwania
- **Walidacja formularza** - sprawdzanie wymaganych pól w czasie rzeczywistym
- **Podgląd wniosku** - modal z podsumowaniem danych przed wysłaniem
- **Integracja z Airtable** - automatyczne zapisywanie danych do bazy
- **Responsywny design** - dostosowanie do urządzeń mobilnych

## Komponenty

- `App.js` - główny komponent aplikacji
- `FormContainer.js` - kontener formularza z logiką stanu
- `CompanyDataSection.js` - sekcja danych podmiotu
- `EmployeeSection.js` - sekcja zarządzania pracownikami
- `EmployeeCard.js` - karta pojedynczego pracownika
- `PreviewModal.js` - modal podglądu wniosku
- `ThankYouPage.js` - strona podziękowania po wysłaniu

## Instalacja i uruchomienie

```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm start

# Budowanie wersji produkcyjnej
npm run build
```

## Konfiguracja Airtable

Aby aplikacja działała z Airtable, zaktualizuj plik `src/services/airtableService.js`:

```javascript
const AIRTABLE_CONFIG = {
    pat: 'TU_WSTAW_SWOJ_PERSONAL_ACCESS_TOKEN',
    baseId: 'TU_WSTAW_BASE_ID',
    applicationsTableId: 'TU_WSTAW_APPLICATIONS_TABLE_ID',
    employeesTableId: 'TU_WSTAW_EMPLOYEES_TABLE_ID',
    baseUrl: 'https://api.airtable.com/v0'
};
```

## Struktura danych

### Tabela Applications (Wnioski)
- submission_id, company_name, company_nip, company_pkd
- representative_person, representative_phone
- contact_person_name, contact_person_phone, contact_person_email
- company_address, activity_place, correspondence_address
- bank_name, bank_account, total_employees, company_size, balance_under_2m

### Tabela Employees (Pracownicy)
- Id, employee_name, gender, age, education, position
- contract_type, contract_start, contract_end
- application_id (link do tabeli Applications)

## Technologie

- React 18
- Bootstrap 5.3.2
- FontAwesome 6.4.0
- Airtable API
- CSS3 z responsywnym designem

## Migracja z wersji HTML/JS

Wszystkie funkcjonalności zostały przeniesione z oryginalnej wersji HTML/JavaScript:
- ✅ Dynamiczne zarządzanie pracownikami
- ✅ Walidacja formularza
- ✅ Podgląd przed wysłaniem
- ✅ Integracja z Airtable
- ✅ Responsywny design
- ✅ Animacje i efekty wizualne

## Available Scripts

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.