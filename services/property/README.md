# Property Service 🏢

Property Service är en **microservice** som hanterar fastighetsrelaterade data i Lihag-systemet. Den är en **CRUD-tjänst** för lägenheter som lagras i MongoDB och publicerar events till RabbitMQ när ändringar sker.

## 📋 Vad är Property Service?

Property Service är en **microservice-komponent** som:

- 🏠 Hanterar **lägenheter** (apartments) - Create, Read, Update, Delete
- 📊 Tillhandahåller **statistik** och **sökfunktionalitet**
- 🔄 Publicerar **events** till RabbitMQ när ändringar sker
- 🌐 Exponeras via **REST API** på port 8003

**Den är inte en standalone-applikation** - den ska anropas från:

- **Frontend** via API Gateway
- **Andra microservices** som behöver lägenhetsdata

## Installation

```bash
npm install
```

## Miljövariabler

```env
PORT=8003
DB_CONNECTION_STRING=mongodb://mongodb:27017/propertyDB
RABBITMQ_URL=amqp://admin:password@rabbitmq:5672
LOG_LEVEL=info
```

## 📡 API Endpoints

### GET /apartments

Lista alla lägenheter med valfri filtrering.

```bash
GET /apartments
GET /apartments?area=Söder%20om%20järnvägen
GET /apartments?type=apartment
GET /apartments?area=Nybro&type=apartment
```

**Response:**

```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "number": "A1",
    "size": 65,
    "propertyId": "prop-001",
    "area": "Söder om järnvägen",
    "type": "apartment",
    "price": 5500,
    "floor": 1,
    "roomCount": 2,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
]
```

### GET /apartments/:id

Hämta en specifik lägenhet.

```bash
GET /apartments/507f1f77bcf86cd799439011
```

**Request:**

```json
{
  "number": "A1",
  "size": 65,
  "propertyId": "prop-001",
  "area": "Söder om järnvägen",
  "type": "apartment",
  "price": 5500,
  "floor": 1,
  "roomCount": 2
}
```

**Events published:**

- `apartment.created` - Publiceras när ny lägenhet skapas

### PUT /apartments/:id

Uppdatera en lägenhet.

**Request:**

```json
{
  "number": "A1",
  "size": 68,
  "price": 5700
}
```

**Events published:**

- `apartment.updated` - Publiceras när lägenhet uppdateras

### DELETE /apartments/:id

Ta bort en lägenhet.

**Events published:**

- `apartment.deleted` - Publiceras när lägenhet raderas

### GET /apartments/statistics

Hämta statistik över lägenheter grupperade efter område och typ.

```bash
GET /apartments/statistics
```

**Response:**

```json
[
  {
    "_id": {
      "area": "Söder om järnvägen",
      "type": "apartment"
    },
    "count": 5
  }
]
```

**Systemintegration:**

```
┌─────────┐
│Frontend │
└────┬────┘
     │ HTTP Request
     ▼
┌───────────────┐
│ API Gateway   │
└────┬──────────┘
     │ Forward
     ▼
Property Service ◄─── REST API calls
     │
     ├─► MongoDB (data persistence)
     └─► RabbitMQ (event publishing)
```

## 🗄 MongoDB Schema & Exempeldata

Property Service använder MongoDB-databasen `propertyDB` med collection `apartments`.

### Apartments Collection Schema

```javascript
{
  _id: ObjectId,              // MongoDB auto-generated ID
  number: String,             // Lägenhetsnummer (A1, B5, etc)
  size: Number,               // Storlek i m²
  propertyId: String,         // ID på fastigheten
  area: String,               // Område/stadsdel
  type: String,               // Typ: "apartment", "studio", "penthouse"
  price: Number,              // Hyra/pris per månad
  floor: Number,              // Våningsplan
  roomCount: Number,          // Antal rum
  createdAt: Date,            // Auto-set vid skapande
  updatedAt: Date             // Auto-update vid ändringar
}
```

### Seeded Exempeldata

Tjänsten levereras med exempeldata (seeded från `seed/` scriptet) för utveckling och tester:

**Område 1: Söder om järnvägen**

- 5x lägenheter (65-75 m², 2-3 rum, 5000-6000 kr/mån)
- Typ: "apartment"

**Område 2: Nybro**

- 3x studior (35-45 m², 1 rum, 3000-3500 kr/mån)
- Typ: "studio"

**Område 3: Centrum**

- 2x penthouse (120-150 m², 4-5 rum, 8000-9500 kr/mån)
- Typ: "penthouse"

Denna data är **endast för utveckling** och kan reseedas när databasen töms.

## 🧪 Tester

Property Service har **17 stycken unit-tests** för ApartmentController med 100% pass-rate.

```bash
# Kör alla tester
npm test

# Med watch-mode (utveckling)
npm run test:watch

# Med UI dashboard
npm run test:ui
```

**Test Coverage:**

- `index()` - Listning och filtrering (5 tester)
- `show()` - Hämta enskild lägenhet (1 test)
- `create()` - Skapa med event-publishing (2 tester)
- `update()` - Uppdatera med event-publishing (2 tester)
- `delete()` - Radera med event-publishing (2 tester)
- `loadApartmentDocument()` - Laddning och error-handling (3 tester)
- `statistics()` - Aggregering och felhantering (2 tester)

**Notering:** Alla tester använder mocked dependencies (MongoDB, RabbitMQ, Logger) - ingen databas behövs för att köra tests.

## 📚 RabbitMQ Events

Property Service publicerar följande events till RabbitMQ topic-exchange `tasks`:

| Event               | Routing Key         | Payload                                                                  |
| ------------------- | ------------------- | ------------------------------------------------------------------------ |
| Lägenhet skapad     | `apartment.created` | `{ _id, number, size, propertyId, area, type, price, floor, roomCount }` |
| Lägenhet uppdaterad | `apartment.updated` | `{ _id, number, size, propertyId, area, type, price, floor, roomCount }` |
| Lägenhet raderad    | `apartment.deleted` | `{ _id }`                                                                |

**Notering:** Om RabbitMQ inte är tillgänglig loggas ett varningsmeddelande och events försöks inte publiceras.

## 🔧 Linting & Kodstandard

```bash
npm run lint          # Kontrollera kodstandard
npm run lint:fix      # Fixa automatiskt
```


### Fullständig lokal stack (med Docker)

```bash
# I projekt-roten, starta externa tjänster
docker-compose up mongodb rabbitmq -d
```

Då fungerar allt normalt.
