# Formularz Vite - Dokumentacja dla Claude

## 🏗️ Architektura Projektu

### Struktura katalogów
```
formularz-vite/
├── src/
│   ├── components/          # Komponenty React
│   │   ├── FormWizard.tsx   # Główny komponent kreatora formularza
│   │   ├── ModernEmployeeCard.tsx  # Karta pracownika (edycja/widok)
│   │   ├── steps/           # Kroki formularza
│   │   │   ├── CompanyDataStep.tsx    # Krok 1: Dane firmy
│   │   │   ├── EmployeesStep.tsx      # Krok 2: Pracownicy
│   │   │   ├── ReviewStep.tsx         # Krok 3: Przegląd
│   │   │   └── SuccessStep.tsx        # Krok 4: Potwierdzenie
│   │   └── ui/              # Komponenty UI
│   │       ├── Button.tsx   # Komponenty przycisków
│   │       ├── FormField.tsx # Pola formularza
│   │       ├── Input.tsx    # Komponenty input
│   │       └── ProgressSteps.tsx # Pasek postępu
│   ├── constants/
│   │   └── texts.ts         # Wszystkie teksty aplikacji
│   ├── services/
│   │   └── airtableService.ts # Integracja z Airtable
│   ├── styles/              # Style CSS
│   │   ├── components.css   # Style komponentów
│   │   └── design-system.css # System designu (zmienne CSS)
│   ├── types/
│   │   └── index.ts         # Definicje typów TypeScript
│   └── App.tsx              # Główny komponent aplikacji
├── package.json             # Zależności i skrypty
└── vite.config.ts          # Konfiguracja Vite
```

## 🎯 Główne Komponenty

### FormWizard.tsx
**Cel**: Główny komponent zarządzający krokami formularza
**Stan**: 
- `currentStep`: aktualny krok (1-4)
- `companyData`: dane firmy
- `employees`: kolekcja pracowników

### EmployeesStep.tsx
**Cel**: Zarządzanie listą pracowników
**Funkcje**:
- `addEmployee()`: dodaje nowego pracownika
- `updateEmployee()`: aktualizuje dane pracownika
- `removeEmployee()`: usuwa pracownika

### ModernEmployeeCard.tsx
**Cel**: Karta pojedynczego pracownika
**Tryby**:
- Edycja: pełny formularz z walidacją
- Widok: kompaktowy widok z przyciskami akcji

## 🛠️ Sposób Debugowania Kodu

### 1. Uruchamianie aplikacji
```bash
cd /Users/charlie/PycharmProjects/formularz/formularz-vite
npm run dev
```
Aplikacja uruchomi się na http://localhost:5173/

**⚠️ KRYTYCZNE: Zawsze używaj narzędzia Bash do uruchamiania serwera!**
Server wyłącza się automatycznie gdy Claude przełącza się na inne narzędzia.

### 2. Budowanie i linting
```bash
# Sprawdzenie błędów TypeScript i budowanie
npm run build

# Sprawdzenie błędów ESLint
npm run lint
```

### 3. Struktura błędów
- **TypeScript**: błędy typów w trakcie `npm run build`
- **ESLint**: problemy stylu kodu w `npm run lint`
- **Runtime**: błędy w konsoli przeglądarki (F12)

### 4. Najczęstsze błędy i rozwiązania

#### Błędy TypeScript
```typescript
// ❌ Błąd: any types
const formatEmployeeDetails = (employee: any) => {

// ✅ Poprawka: użyj zdefiniowanych typów
const formatEmployeeDetails = (employee: Employee) => {
```

#### Błędy walidacji
```typescript
// Sprawdź czy wszystkie wymagane pola są wypełnione
if (!formData.name?.trim()) newErrors.name = 'Pole wymagane';
```

## 📋 Typy Danych

### CompanyData
```typescript
interface CompanyData {
  company_name: string;
  company_nip: string;
  company_pkd: string;
  representative_person: string;
  // ... inne pola
}
```

### Employee
```typescript
interface Employee {
  id?: string;
  name: string;
  gender: 'M' | 'K' | '';
  age: string;
  education: 'podstawowe' | 'gimnazjalne' | 'zawodowe' | 'srednie' | 'policealne' | 'wyzsze' | '';
  position: string;
  contract_type: string;
  contract_start: string;
  contract_end: string;
  isEditing: boolean;
  isNew?: boolean;
}
```

## 🎨 System Stylów

### CSS Custom Properties (design-system.css)
```css
:root {
  --primary-600: #2563eb;
  --success-600: #16a34a;
  --error-600: #dc2626;
  --space-4: 1rem;
  --radius-xl: 0.75rem;
}
```

### Klasy użytkowe
- `.animate-fade-in`: animacja pojawiania się
- `.form-grid`: responsywna siatka formularza
- `.modern-input`: stylizowane pola input
- `.modern-button`: stylizowane przyciski

## 🔧 Integracja z Airtable

### Konfiguracja (airtableService.ts)
```typescript
const AIRTABLE_CONFIG = {
  pat: 'YOUR_PAT_TOKEN',
  baseId: 'YOUR_BASE_ID',
  applicationsTableId: 'YOUR_TABLE_ID',
  employeesTableId: 'YOUR_EMPLOYEE_TABLE_ID'
};
```

### Struktura danych wysyłanych
1. **Aplikacja**: zapisywana w tabeli Applications
2. **Pracownicy**: zapisywani w tabeli Employees z linkiem do aplikacji

## 🚀 Środowisko Deweloperskie

### Wymagane narzędzia
- Node.js (v18+)
- npm
- Vite (zainstalowany lokalnie)

### Przydatne skróty VS Code
- `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- `Ctrl+Shift+P` → "Developer: Reload Window"

### Browser DevTools
- **React DevTools**: sprawdzanie stanu komponentów
- **Network tab**: monitorowanie requestów do Airtable
- **Console**: sprawdzanie błędów JavaScript

## ⚡ Szybkie Starty

### Dodanie nowego pola do Employee
1. Zaktualizuj interface `Employee` w `types/index.ts`
2. Dodaj pole do formularza w `ModernEmployeeCard.tsx`
3. Dodaj walidację jeśli potrzebna
4. Zaktualizuj widok w `ReviewStep.tsx`

### Dodanie nowego kroku
1. Utwórz komponent w `components/steps/`
2. Dodaj do switch w `FormWizard.tsx`
3. Zaktualizuj `ProgressSteps.tsx`

### Debugowanie problemów z formularzem
1. Sprawdź stan w React DevTools
2. Zweryfikuj typy TypeScript
3. Sprawdź konsole błędów
4. Przetestuj walidację pól

## 📝 Konwencje Kodowania

### Nazewnictwo
- Komponenty: PascalCase (`ModernEmployeeCard`)
- Funkcje: camelCase (`updateEmployee`)
- Stałe: UPPER_SNAKE_CASE (`AIRTABLE_CONFIG`)

### Struktura komponentów
```typescript
// Import dependencies
import React, { useState } from 'react';
import { Component } from './Component';

// Types/interfaces
interface ComponentProps {
  // props definition
}

// Component definition
const MyComponent: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // State hooks
  const [state, setState] = useState();
  
  // Event handlers
  const handleAction = () => {
    // implementation
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default MyComponent;
```

### Obsługa błędów
```typescript
// Zawsze sprawdzaj błędy walidacji
const [errors, setErrors] = useState<Record<string, string>>({});

// Czyść błędy przy zmianie wartości
if (errors[field]) {
  setErrors(prev => ({ ...prev, [field]: '' }));
}
```

## 🔍 Najważniejsze Pliki do Monitorowania

1. **FormWizard.tsx** - główna logika nawigacji
2. **EmployeesStep.tsx** - zarządzanie pracownikami
3. **ModernEmployeeCard.tsx** - edycja/widok pracownika
4. **airtableService.ts** - integracja z backendem
5. **types/index.ts** - definicje typów

Te pliki zawierają większość logiki aplikacji i są najczęściej modyfikowane.