# Lihag AB - Tenant Portal Frontend

Modernt React-baserat frontend för hyresgäster. Byggd med Vite, React 18, och Tailwind CSS.

## 📁 Projektstruktur

```
frontend/tenant/
├── src/
│   ├── components/          # Återanvändbara UI-komponenter
│   │   ├── Header.jsx       # Header & Navigation
│   │   ├── ApartmentCard.jsx    # Lägenhetskort
│   │   ├── ReportCard.jsx       # Felanmälningskort
│   │   └── SearchFilters.jsx    # Sökfilter
│   │
│   ├── pages/               # Fullständiga sidor/vyer
│   │   ├── LandingPage.jsx      # Startsida (lägenhetssökning)
│   │   ├── AboutPage.jsx        # Om Lihag
│   │   ├── ContactPage.jsx      # Kontakta oss
│   │   ├── ApartmentDetailPage.jsx  # Lägenhetsinformation
│   │   ├── InterestFormPage.jsx # Intresseanmälan
│   │   ├── LoginPage.jsx        # Inloggning
│   │   ├── TenantDashboardPage.jsx  # Mina sidor
│   │   ├── ReportFormPage.jsx   # Skapa felanmälan
│   │   └── ProfilePage.jsx      # Profilsida
│   │
│   ├── data/                # Mock-data och datakällor
│   │   ├── apartments.js    # 20 lägenhetsobjekt
│   │   └── reports.js       # 6 felanmälningar
│   │
│   ├── hooks/               # Anpassade React hooks
│   │   └── useFilteredApartments.js  # Filtreringslogik
│   │
│   ├── utils/               # Hjälpfunktioner (API-anrop etc.)
│   │   └── (för framtida expansión)
│   │
│   ├── App.jsx              # Huvudkomponent & router
│   ├── main.jsx             # React DOM-inmatningspunkt
│   └── index.css            # Globala stilar & Tailwind
│
├── index.html               # HTML-mall
├── package.json             # Beroenden & scripts
├── vite.config.js           # Vite-konfiguration
├── tailwind.config.js       # Tailwind CSS-konfiguration
├── postcss.config.js        # PostCSS-konfiguration
└── README.md                # Denna fil
```

## 🎯 Funktioner

### Oautentiserade sidor

- **Startsida** - Sök och filtrera lägenheter
  - Filteroptioner: typ, stad, maxpris, antal rum, våning, storlek
  - Gridrenderering av 20 lägenheter
- **Om Lihag** - Företagsinformation
- **Kontakta oss** - Kontaktuppgifter & öppettider

### Lägenhetsinformation

- **Lägenhetssida** - Detaljerad information
  - Fakta (område, adress, obj.nr, typ, boyta, våning, hyra, byggt)
  - Viktiga datum (tillgänglig från, anmäl senast)
  - Beskrivning & features
- **Intresseanmälan** - Formulär för att anmäla intresse

### Autentiserade sidor (efter inloggning)

- **Inloggning** - Enkel e-post/lösenord inloggning
- **Mina sidor** - Hyresgästens huvuddashboard
  - Min lägenhet-sektion
  - Felanmälningar (pågående & åtgärdade)
- **Ny felanmälan** - Skapa och ladda upp bilder
- **Min profil** - Redigera personliga uppgifter & lösenord

## 🚀 Installering & Start

### Förutsättningar

- Node.js 18+
- npm eller yarn

### Installation

```bash
cd frontend/tenant
npm install
```

### Utveckling

```bash
npm run dev
```

Öppnas automatiskt på `http://localhost:3000`

### Produktion

```bash
npm run build
npm run preview
```

## 🎨 Design & Styling

- **Framework**: Tailwind CSS
- **Färgschema**: Blå tema (Blue-600 primär, Blue-100 bakgrund)
- **Ikoner**: Lucide React
- **Responsiv**: Mobile-first design

## 🔧 Komponenter & Hooks

### Komponenter

- `Header` - Rubrik & navigation (oautentiserad/autentiserad)
- `Navigation` - Navigationsmeny för offentliga sidor
- `ApartmentCard` - Lägenhetskort för rutnät
- `ReportCard` - Felanmälningskort för dashboard
- `SearchFilters` - Filterkontroller

### Hooks

- `useFilteredApartments` - Filtrerar lägenheter baserat på användarval

## 📊 Mock-data

### Apartments (src/data/apartments.js)

20 lägenheter med:

- Adress, område, stad
- Antal rum, storlek, våning
- Månadshyra
- Bild (Unsplash URL)
- Tillgänglighetsdatum & ansökningsdeadline
- Beskrivning & features

### Maintenance Reports (src/data/reports.js)

6 felanmälningar med:

- Titel, status (pågående/åtgärdad)
- Datum & beskrivning

## 🔐 Autentisering (Framtida integrering)

För närvarande använder den en enkel lokal estado-simulering. För produktion:

1. Integrera med Auth Service API
2. Implementera JWT-tokenhantering
3. Lägg till API-anrop för:
   - POST /auth/login
   - GET /apartments
   - GET /tenants/:id
   - POST /reports
   - PUT /tenants/:id

## 📱 Responsiv design

- **Mobil**: 1 kolumn
- **Tablet**: 2 kolumner
- **Desktop**: 4 kolumner (lägenhet) eller 2 kolumner (dashboard)

Alla komponenter använder Tailwind CSS's responsive breakpoints.

## 🎯 Framtida förbättringar

- [ ] Integrering med API Gateway
- [ ] JWT-autentisering
- [ ] Polling för realtidsuppdateringar av felanmälningar
- [ ] Bild-upload för felanmälningar
- [ ] Admin-portal för fastighetsförvaltare
- [ ] E-postbekräftelser
- [ ] Notifikationer för felanmälningar
- [ ] Betalningshantering
- [ ] Chattöversättning för support

## 🛠️ Teknisk stack

- **Framework**: React 18
- **Build tool**: Vite 5
- **CSS**: Tailwind CSS 3
- **Ikoner**: Lucide React
- **Språk**: JavaScript (moduler)
- **Package manager**: npm

## 📝 Kodstandard

- Komponentnamn: PascalCase
- Filnamn: PascalCase för komponenter, camelCase för utilities
- Props dokumentation: JSDoc-kommentarer
- State management: React hooks (useState, useCallback, useMemo)

## 🤝 Bidrag

Denna frontend är del av Lihag-systemet. För ändringar:

1. Skapa feature branch
2. Implementera ändringar
3. Testa på mobil & desktop
4. Skapa pull request

## 📄 Licens

Alla rättigheter förbehållna Lihag AB.
