# 🚀 Snabbstart - Lihag Tenant Frontend

## 30-sekunders installation

```bash
# Navigera till projektmappen
cd frontend/tenant

# Installera dependencies
npm install

# Starta utvecklingsserver
npm run dev
```

✅ Öppnas automatiskt på `http://localhost:3000`

---

## 📂 Projektöversikt

```
frontend/tenant/
├── src/
│   ├── components/       ← Återanvändbara UI-komponenter
│   ├── pages/            ← Fullständiga sidor/vyer
│   ├── data/             ← Mock-data (20 lägenheter, 6 rapporter)
│   ├── hooks/            ← Anpassade React-hooks
│   ├── App.jsx           ← Huvudkomponent
│   ├── main.jsx          ← Entry point
│   └── index.css         ← Globala stilar
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎯 Vad kan du testa?

### 1. **Startsida** - Sök lägenheter

- ✅ Filtrera efter typ, stad, pris, rum, våning, storlek
- ✅ 20 lägenheter visas i rutnät
- ✅ Klicka på lägenhet → se detaljer

### 2. **Lägenhetsinformation**

- ✅ Detaljerad info (9 fält)
- ✅ Viktiga datum (grön/röd bakgrund)
- ✅ Features-lista
- ✅ "Gör intresseanmälan" knapp

### 3. **Intresseanmälan**

- ✅ Formulär (namn, telefon, e-post)
- ✅ Lyckat meddelande → omdirigeras

### 4. **Inloggning**

- ✅ Demo: använd vilket e-post/lösenord som helst
- ✅ Omdirigerar till "Mina sidor"

### 5. **Mina sidor** (efter inloggning)

- ✅ Min lägenhet-sektion
- ✅ Felanmälningar (pågående/åtgärdade)
- ✅ Knapparna: Ny felanmälan, Profil, Logga ut

### 6. **Ny felanmälan**

- ✅ Formulär (titel, beskrivning)
- ✅ Bilddrag & drop
- ✅ Lyckat meddelande

### 7. **Min profil**

- ✅ Redigera namn, e-post, telefon
- ✅ Ändra lösenord (valfritt)
- ✅ Spara ändringar

### 8. **Om Lihag** & **Kontakta oss**

- ✅ Statisk information
- ✅ Öppettider, kontaktuppgifter

---

## 📋 Navigering

**Från startsidan:**

- Sök lediga lägenheter → Startsida
- Om Lihag → Om-sida
- Kontakta oss → Kontakt-sida
- Logga in → Inloggning

**Efter inloggning:**

- Felanmälan → Ny felanmälan
- Profil → Min profil
- Logga ut → Tillbaka till startsida

---

## 🛠️ Dev Server Kommandon

```bash
# Starta utvecklingsserver (auto-reload)
npm run dev

# Bygg för produktion
npm run build

# Förhandsgranska produktions-build
npm run preview

# Linting (om konfigurerat)
npm run lint
```

---

## 🎨 Designtips

- **Färg**: Blå tema (Blue-600 primär)
- **Layout**: Mobile-first responsive design
- **Ikoner**: Lucide React
- **Styling**: Tailwind CSS

---

## 🔗 Api Integration (Framtida)

För att koppla mot backend, uppdatera:

```javascript
// src/pages/LoginPage.jsx
const handleSubmit = async (e) => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
  // Spara JWT token
};

// src/pages/LandingPage.jsx
useEffect(() => {
  fetch("/api/apartments")
    .then((r) => r.json())
    .then(setApartments);
}, []);
```

---

## 🐛 Felsökning

### Port redan använd

```bash
# Ändra port i vite.config.js
server: {
  port: 3001  // ändra från 3000
}
```

### Node.js version

```bash
# Kräver Node 18+
node --version  # kontrollera version
```

### Dependencies problem

```bash
# Rensa och installera om
rm -rf node_modules package-lock.json
npm install
```

---

## 📦 Paket & Beroenden

```json
{
  "react": "^18.2.0", // UI framework
  "react-dom": "^18.2.0", // DOM rendering
  "lucide-react": "^0.294.0", // Icons
  "vite": "^5.0.8", // Build tool
  "tailwindcss": "^3.3.6" // Styling
}
```

---

## 📚 Mer Information

- **README.md** - Fullständig dokumentation
- **TENANT_PORTAL_SUMMARY.md** - Detaljerad överblick
- **MIGRATION_GUIDE.md** - Hur monoliten omstrukturerades

---

## ✨ Snabba Tips

1. **Använd React DevTools** för att inspektera komponenter
2. **Tryck F12** för att öppna webbläsarens dev tools
3. **Mobil test**: Tryck F12 → växla till mobilvyn
4. **Hot reload**: Ändringar sparas automatiskt
5. **Tailwind classes**: Alla Tailwind-klasser fungerar direkt

---

## 🎬 Nästa Steg

1. ✅ **Testa alla sidor** - Klicka runt och se hur allt fungerar
2. ⏳ **Integrera API** - Anslut till Property Service
3. ⏳ **Lägg till autentisering** - JWT-tokens från Auth Service
4. ⏳ **Real-time uppdateringar** - Polling för felanmälningar
5. ⏳ **Admin-portal** - Skapa admin-sida för förvaltare

---

## 🤝 Support

Frågor? Se README.md eller MIGRATION_GUIDE.md

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Skapat**: 2024 för Lihag AB

---

**Lycka till! 🚀**
