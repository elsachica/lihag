# 🏗️ Lihag Tenant Portal - Architecture & Component Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LIHAG TENANT PORTAL                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   index.html     │
                  │  (HTML Template) │
                  └─────────┬────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   main.jsx       │
                  │  (Entry Point)   │
                  └─────────┬────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │    App.jsx       │
                  │  (Main Router)   │
                  └─────────┬────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
         ▼                  ▼                  ▼
    ┌─────────────┐  ┌────────────┐  ┌──────────────┐
    │   PUBLIC    │  │AUTHORIZED │  │    FORMS     │
    │   PAGES     │  │   PAGES    │  │    & DETAIL  │
    └─────────────┘  └────────────┘  └──────────────┘
         │                  │                │
    ┌────┴────┐        ┌────┴────┐     ┌────┴────────┐
    │    │    │        │    │    │     │    │   │    │
    ▼    ▼    ▼        ▼    ▼    ▼     ▼    ▼   ▼    ▼
  Land About Cont   Login Tenant Report Apart Interest Profile
  Page Page  act   Page  Dash  Form  Detail  Form    Page
                           Page
```

---

## Component Hierarchy

```
App.jsx (State Management)
│
├─ LandingPage
│  ├─ PublicHeader
│  ├─ Navigation
│  ├─ SearchFilters (Manages filters)
│  └─ ApartmentCard[] (Grid of 20)
│
├─ AboutPage
│  ├─ PublicHeader
│  └─ Navigation
│
├─ ContactPage
│  ├─ PublicHeader
│  └─ Navigation
│
├─ ApartmentDetailPage
│  └─ (Full apartment information)
│
├─ InterestFormPage
│  └─ (Form with apartment context)
│
├─ LoginPage
│  └─ (Simple form)
│
├─ TenantDashboardPage
│  ├─ TenantHeader
│  ├─ [Apartment Info Section]
│  │  └─ (Image + Details)
│  └─ [Reports Section]
│     ├─ ReportCard[] (Ongoing)
│     └─ ReportCard[] (Resolved)
│
├─ ReportFormPage
│  ├─ TenantHeader
│  └─ (Form with file upload)
│
└─ ProfilePage
   ├─ TenantHeader
   └─ (Edit profile form)
```

---

## Data Flow

```
┌──────────────────────────────────────────────┐
│         src/data/apartments.js               │
│  (20 apartments with full details)           │
└──────────────┬───────────────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │  LandingPage.jsx     │
    │  (Display apartments)│
    └──────┬───────────────┘
           │
           ├─ useFilteredApartments hook
           │  (Filter by: type, city, price, rooms, floor, size)
           │
           ▼
    ┌──────────────────────┐
    │ SearchFilters.jsx    │
    │ (User controls)      │
    └──────────────────────┘
           │
           ▼
    ┌──────────────────────┐
    │ ApartmentCard[]      │
    │ (Display filtered)   │
    └──────────────────────┘
           │
           ▼
    ┌──────────────────────────────┐
    │ ApartmentDetailPage.jsx      │
    │ (Selected apartment details) │
    └──────────────────────────────┘
           │
           ▼
    ┌──────────────────────────────┐
    │ InterestFormPage.jsx         │
    │ (Submit application)         │
    └──────────────────────────────┘
```

---

## Authentication Flow

```
┌────────────────────────────────────────────────┐
│              User Journey                      │
└────────────────────────────────────────────────┘
                    │
                    ▼
            ┌──────────────────┐
            │   Landing Page   │
            │  (Browse apart.) │
            └────────┬─────────┘
                     │
            ┌────────▼────────┐
            │  Click "Login"  │
            └────────┬────────┘
                     │
                     ▼
            ┌──────────────────┐
            │   LoginPage      │
            │ (Email & pass)   │
            └────────┬─────────┘
                     │
            ┌────────▼────────┐
            │ Auth Success?   │
            └─────┬───────┬──┘
                YES        NO
                 │         │
                 ▼         └─→ Show error
            ┌──────────────────┐
            │ TenantDashboard  │
            │ (My apartment)   │
            └────────┬─────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    View Reports  New Report   Edit Profile
        │            │            │
        │            ▼            ▼
        │       ReportForm   ProfilePage
        │       (Upload)     (Edit details)
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
            ┌──────────────────┐
            │  Logout Button   │
            └────────┬─────────┘
                     │
                     ▼
             Landing Page (Reset)
```

---

## Hooks & Logic Flow

```
useFilteredApartments Hook
│
├─ Inputs:
│  ├─ apartments array (20 items)
│  ├─ selectedType ("lägenhet" | "lokal" | "")
│  ├─ selectedCity ("Kalmar" | "Nybro" | "")
│  └─ filters object {price, rooms, floor, size}
│
├─ Processing:
│  └─ useMemo:
│     └─ Filter apartments array:
│        ├─ Skip if type doesn't match
│        ├─ Skip if city doesn't match
│        ├─ Skip if price > max
│        ├─ Skip if rooms != exact
│        ├─ Skip if floor != exact
│        └─ Skip if size < min
│
└─ Output:
   └─ Filtered apartments array
```

---

## Component Composition

```
┌─ REUSABLE COMPONENTS
│  │
│  ├─ Header.jsx
│  │  ├─ PublicHeader (for non-auth pages)
│  │  ├─ TenantHeader (for auth pages)
│  │  └─ Navigation (nav menu)
│  │
│  ├─ ApartmentCard.jsx
│  │  └─ Used in: LandingPage grid
│  │
│  ├─ ReportCard.jsx
│  │  └─ Used in: TenantDashboardPage (ongoing & resolved)
│  │
│  └─ SearchFilters.jsx
│     └─ Used in: LandingPage
│
├─ PAGE COMPONENTS
│  │
│  ├─ LandingPage.jsx (9 sections)
│  ├─ AboutPage.jsx
│  ├─ ContactPage.jsx
│  ├─ ApartmentDetailPage.jsx
│  ├─ InterestFormPage.jsx
│  ├─ LoginPage.jsx
│  ├─ TenantDashboardPage.jsx
│  ├─ ReportFormPage.jsx
│  └─ ProfilePage.jsx
│
├─ HOOKS
│  └─ useFilteredApartments.js
│
├─ DATA
│  ├─ apartments.js (20 objects)
│  └─ reports.js (6 objects)
│
└─ CORE
   ├─ App.jsx (router)
   ├─ main.jsx (entry)
   └─ index.css (styles)
```

---

## Responsive Breakpoints

```
Mobile         Tablet         Desktop
(< 768px)      (768-1024px)   (> 1024px)
│              │              │
├─ 1 column     ├─ 2 columns   ├─ 4 columns
├─ Full width   ├─ 50% width   ├─ 25% width
├─ Large touch  ├─ Medium      ├─ Optimized
└─ Readable     └─ Balanced    └─ Grid

ApartmentCard in Grid:
Mobile:   1 apt per row
Tablet:   2 apts per row  
Desktop:  4 apts per row
```

---

## State Management

```
App.jsx State:
│
├─ currentView: string
│  │ landing, about, contact, apartment-detail,
│  │ interest-form, login, tenant-dashboard,
│  │ report-form, profile
│  │
│  └─ onChange: handleNavigate(view)
│
└─ selectedApartment: object | null
   │ {id, type, city, address, ...}
   │
   └─ onChange: handleSelectApartment(apartment)

Page State (Local):
├─ LandingPage:
│  ├─ selectedType
│  ├─ selectedCity
│  └─ filters {price, rooms, floor, size}
│
├─ LoginPage:
│  ├─ email
│  └─ password
│
├─ ReportFormPage:
│  ├─ title
│  ├─ description
│  └─ image
│
├─ InterestFormPage:
│  ├─ name
│  ├─ phone
│  └─ email
│
└─ ProfilePage:
   ├─ name
   ├─ email
   ├─ phone
   └─ password
```

---

## File Import Tree

```
App.jsx
├─ LandingPage
│  ├─ PublicHeader (Header.jsx)
│  ├─ Navigation (Header.jsx)
│  ├─ ApartmentCard (ApartmentCard.jsx)
│  ├─ SearchFilters (SearchFilters.jsx)
│  └─ useFilteredApartments (hooks)
│     └─ apartments (data/apartments.js)
│
├─ AboutPage
│  ├─ PublicHeader (Header.jsx)
│  └─ Navigation (Header.jsx)
│
├─ ContactPage
│  ├─ PublicHeader (Header.jsx)
│  └─ Navigation (Header.jsx)
│
├─ ApartmentDetailPage
│  └─ selectedApartment (from App state)
│
├─ InterestFormPage
│  └─ selectedApartment (from App state)
│
├─ LoginPage
│  └─ (self-contained)
│
├─ TenantDashboardPage
│  ├─ TenantHeader (Header.jsx)
│  └─ ReportCard (ReportCard.jsx)
│     └─ maintenanceReports (data/reports.js)
│
├─ ReportFormPage
│  └─ TenantHeader (Header.jsx)
│
└─ ProfilePage
   └─ TenantHeader (Header.jsx)
```

---

## URL/Route Mapping (Current Implementation)

```
Current: State-based routing
┌──────────────────────────────────────────────────────┐
│ Route                   │ Component              │
├─────────────────────────────────────────────────────┤
│ /                       → LandingPage           │
│ /about                  → AboutPage             │
│ /contact                → ContactPage           │
│ /apartment-detail       → ApartmentDetailPage   │
│ /interest-form          → InterestFormPage      │
│ /login                  → LoginPage             │
│ /tenant-dashboard       → TenantDashboardPage   │
│ /report-form            → ReportFormPage        │
│ /profile                → ProfilePage           │
└──────────────────────────────────────────────────────┘

Future: React Router v6
┌──────────────────────────────────────────────────────┐
│ /                                                    │
│ ├─ /search                → LandingPage             │
│ ├─ /about                 → AboutPage               │
│ ├─ /contact               → ContactPage             │
│ ├─ /apartments/:id        → ApartmentDetailPage     │
│ ├─ /apartments/:id/apply  → InterestFormPage        │
│ ├─ /login                 → LoginPage               │
│ ├─ /dashboard             → TenantDashboardPage     │
│ │  ├─ /dashboard/reports  → ReportFormPage         │
│ │  └─ /dashboard/profile  → ProfilePage            │
│ └─ /logout                → Reset & redirect        │
└──────────────────────────────────────────────────────┘
```

---

## Performance Optimizations

```
1. Code Splitting (Vite)
   │
   ├─ Initial Load: App.jsx
   ├─ Lazy Load: Page components (on demand)
   └─ Vendor: Separated node_modules

2. Memoization
   │
   ├─ useFilteredApartments (useMemo)
   └─ Prevents unnecessary filtering

3. Component Optimization
   │
   ├─ Functional components (React 18)
   ├─ No prop drilling
   └─ Minimal re-renders

4. Asset Optimization
   │
   ├─ Unsplash images (external CDN)
   ├─ Lucide icons (tree-shaking)
   └─ Tailwind CSS (purge unused)
```

---

## Styling Architecture

```
CSS Hierarchy:
│
├─ Tailwind Base
│  └─ Reset & normalize
│
├─ Tailwind Components
│  └─ .btn, .card, etc. (custom)
│
├─ Tailwind Utilities
│  └─ Atomic classes
│
└─ Custom CSS (index.css)
   ├─ Scrollbar styling
   ├─ Line clamp utility
   └─ Transition helpers

Color System:
├─ Primary: Blue-600
├─ Light: Blue-50, Blue-100
├─ Status: Green (resolved), Yellow (ongoing)
├─ Text: Gray-900 (dark), Gray-700 (normal), Gray-600 (light)
└─ Borders: Blue-200
```

---

## Future Architecture Recommendations

```
Phase 1: Add Routing
└─ React Router v6
   ├─ /search
   ├─ /apartments/:id
   ├─ /login
   └─ /dashboard/*

Phase 2: Add State Management
└─ Context API or Redux
   ├─ Auth context
   ├─ Apartment context
   └─ User context

Phase 3: Add API Integration
└─ Fetch/Axios layer
   ├─ /api/apartments
   ├─ /api/auth/login
   ├─ /api/reports
   └─ /api/users

Phase 4: Add Testing
└─ Jest + React Testing Library
   ├─ Unit tests
   ├─ Integration tests
   └─ E2E tests (Cypress)

Phase 5: Add Advanced Features
└─ Type Safety (TypeScript)
   ├─ Interfaces
   ├─ Enums
   └─ Type checking
```

---

**Architecture Version**: 1.0.0  
**Status**: ✅ Complete & Well-Documented  
**Last Updated**: 2024  
**For**: Lihag AB Tenant Portal
