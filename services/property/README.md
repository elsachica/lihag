TenantController.create()
Kräver nu apartmentId i request body
Validerar att apartment existerar och är ledig
Skapar tenant
Binder tenant till apartment automatiskt
Publicerar två events: tenant.created och apartment.tenant-bound
Returnerar tenant med sin _id
Exempel:

```bash
POST /tenants
{
  "name": "Johan Andersson",
  "email": "johan@andersson.com",
  "phone": "070-1234567",
  "apartmentId": "507f1f77bcf86cd799439011"
}

→ Svar 201:
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Johan Andersson",
  "email": "johan@andersson.com",
  "phone": "070-1234567",
  "createdAt": "...",
  "updatedAt": "..."
}

→ Apartment uppdateras:
{
  "_id": "507f1f77bcf86cd799439011",
  "tenant": "507f1f77bcf86cd799439012",
  "isAvailable": false,
  ...
}
```

TenantController.delete()
Hittar apartment som är kopplad till tenant
Unbinds tenant (sätter tenant: null, isAvailable: true)
Tar bort tenant
Publicerar event apartment.tenant-unbound






Text hur flöde ska gå till:

---

## **Förklaring på flöde:**

### **1. ✅ Användare rapporterar fel**
```
Frontend: Tenant klickar "Rapportera fel"
  ↓
Form fyller i:
{
  "description": "Vattnet läcker från taket"
  // apartmentId läggs till automatiskt från JWT
  // tenantId läggs till automatiskt från JWT
}
```


---

### **2. ✅ Skickas som POST med JWT**
```
POST /maintenance
Authorization: Bearer eyJhbGciOi...  ← JWT token här
Content-Type: application/json
Body: {
  "description": "Vattnet läcker från taket"
}
```

---

### **3. ✅ API Gateway verifierar och extraherar**
```
API Gateway mottar POST /maintenance + JWT

1. Verifierar JWT:
   - Token är giltlig?
   - Token är inte utgången?
   - Signaturen är korrekt?

2. Extraherar från JWT:
   - tenantId: "tenant-123"
   - role: "tenant"
   - apartmentId: "apt-A1"

3. Kontrollerar permissions:
   - Får "tenant" skapa maintenance?
   - JA → Forward
   - NEJ → Return 403

4. Forwarden till Maintenance Service:
   POST /maintenance
   Headers:
     X-User-Id: tenant-123
     X-Tenant-Id: tenant-123
     X-Apartment-Id: apt-A1
     X-User-Role: tenant
   Body:
     description: "Vattnet läcker från taket"
```

---

### **4. ✅ Maintenance Service sparar och skapar event**
```
Maintenance Service mottar POST /maintenance

1. Tar emot JSON:
   description: "Vattnet läcker från taket"
   (+ headers från API Gateway)

2. Extraherar från headers:
   tenantId = X-User-Id (tenant-123)
   apartmentId = X-Apartment-Id (apt-A1)

3. Skapar maintenance i DB:
   {
     _id: "maint-456",  ← MongoDB genererar detta
     tenantId: "tenant-123",
     apartmentId: "apt-A1",
     description: "Vattnet läcker från taket",
     status: "open",
     createdAt: 2025-12-09T10:30:00Z
   }

4. Publicerar event:
   publishEvent('maintenance.created', {
     maintenanceId: "maint-456",
     tenantId: "tenant-123",
     apartmentId: "apt-A1",
     description: "Vattnet läcker från taket"
   })
```


---

### **5. ❓ RabbitMQ "tar emot och skickar vidare"**

**Här är det lite missförstånd.** RabbitMQ gör INTE detta automatiskt. Låt mig förklara:

```
Maintenance Service:
publishEvent('maintenance.created', {...})
  ↓
RabbitMQ Topic Exchange named 'events':
- Lagrar meddelandet
- Routar baserat på routing key
  (routing key = 'maintenance.created')

RabbitMQ gör INTE något mer!
Det är bara en brevlåda.
```

**RabbitMQ är en MESSAGE BROKER** - den lagrar och routar messages, men skickar inte aktivt nånstans. 

**API Gateway MÅSTE prenumerera och KONSUMERA events från RabbitMQ.**

```
┌─────────────────────────────────────────┐
│       MAINTENANCE SERVICE               │
│                                         │
│  publishEvent('maintenance.created')   │
│  ↓                                      │
└─────────────────────────────────────────┘
              ↓
        ┌─────▼──────┐
        │  RabbitMQ  │
        │            │
        │ Topic Exch │
        │  'events'  │
        │            │
        │ Routing K: │
        │ maintenance│
        │ .created   │
        └─────┬──────┘
              ↓
   (meddelandet väntar här)
              ↓
┌─────────────────────────────────────────┐
│      API GATEWAY (CONSUMER)             │
│                                         │
│ const ch = await amqp.connect(...)     │
│ ch.consume(queue, (msg) => {           │
│   const data = JSON.parse(msg)        │
│   handleEvent(data)                   │
│ })                                      │
│                                         │
│ ← AKTIVT konsumerar från RabbitMQ!    │
└─────────────────────────────────────────┘
```

**RabbitMQ skickar INTE aktivt - API Gateway HÄMTAR.**

---

### **6. ❓ "API Gateway parsar datan" - vad betyder det?**

**Parsa = Läsa och tolka data.**

```javascript
// API Gateway consumer:
channel.consume(queue, (msg) => {
  // msg.content är en buffer (raw bytes)
  const rawData = msg.content  // Buffer: <Buffer 7b 22 6d ... >
  
  // PARSE = Omvandla från bytes till JavaScript objekt
  const parsedData = JSON.parse(rawData.toString())
  
  // Nu har vi ett vanligt JavaScript objekt:
  // {
  //   maintenanceId: "maint-456",
  //   tenantId: "tenant-123",
  //   apartmentId: "apt-A1",
  //   description: "Vattnet läcker från taket"
  // }
  
  // Sedan routar vi detta
  handleEvent(parsedData)
})
```

**Så "parsa" = omvandla från JSON-sträng till JavaScript objekt.**

---

### **7. ✅ API Gateway routar via WebSocket**

```
API Gateway har mottagit och parsat event:
{
  maintenanceId: "maint-456",
  tenantId: "tenant-123",
  apartmentId: "apt-A1",
  description: "..."
}

Sedan routar den via WebSocket till rätt platser:

// Skicka till tenant som skapade den
io.to('tenant-123').emit('maintenance-created', {
  id: 'maint-456',
  message: "Din felanmälan är registrerad",
  status: "open"
})

// Skicka till admin
io.to('admin').emit('new-maintenance', {
  id: 'maint-456',
  tenantId: 'tenant-123',
  apartmentId: 'apt-A1',
  description: "Vattnet läcker från taket"
})
```

✅ **Rätt!** Men det är **WebSocket channels/rooms** inte "routes". 

---

### **8. ✅ Frontend tar emot via WebSocket**

```
// Tenant Frontend
socket.on('maintenance-created', (data) => {
  console.log(data.message)  // "Din felanmälan är registrerad"
  showNotification("✓ " + data.message)
  updateUI()
})

// Admin Frontend
socket.on('new-maintenance', (data) => {
  console.log(data.message)  // "Ny felanmälan från tenant-123 i apt-A1"
  showAlert("⚠️ Ny felanmälan inlagd")
  addToMaintenanceList(data)
})
```


---

## **Fullständigt flöde visualiserat:**

```
┌─────────────────────────────────────────────────────────────────┐
│  1. FRONTEND - Tenant klickar "Rapportera fel"                 │
│     Form: description: "Vattnet läcker från taket"             │
└────────────────┬──────────────────────────────────────────────┘
                 │
                 │ 2. POST /maintenance
                 │    Authorization: Bearer {JWT}
                 │    Body: {description: "..."}
                 │
     ┌───────────▼────────────────────────────────┐
     │  3. API GATEWAY / AUTH (port 3000)         │
     │                                            │
     │  Verify JWT:                               │
     │  - Token giltlig?                          │
     │  - Inte utgången?                          │
     │                                            │
     │  Extract från JWT:                         │
     │  - tenantId: "tenant-123"                  │
     │  - role: "tenant"                          │
     │  - apartmentId: "apt-A1"                   │
     │                                            │
     │  Check permissions:                        │
     │  - Får tenant skapa maintenance?           │
     │  - JA! Forward.                            │
     │                                            │
     │  Forward to Maintenance Service:           │
     │  POST /maintenance                         │
     │  X-User-Id: tenant-123                    │
     │  X-Apartment-Id: apt-A1                   │
     │  Body: {description: "..."}               │
     └────────────┬─────────────────────────────┘
                  │
                  │ 4. MAINTENANCE SERVICE (port 8004)
                  │
     ┌────────────▼────────────────────────────────┐
     │  Receive POST /maintenance                  │
     │                                             │
     │  Extract from headers:                      │
     │  - tenantId: "tenant-123"                   │
     │  - apartmentId: "apt-A1"                    │
     │                                             │
     │  Create maintenance in DB:                  │
     │  {                                          │
     │    _id: "maint-456",                       │
     │    tenantId: "tenant-123",                 │
     │    apartmentId: "apt-A1",                  │
     │    description: "Vattnet läcker från taket",│
     │    status: "open"                          │
     │  }                                          │
     │                                             │
     │  publishEvent('maintenance.created', {...})│
     └────────────┬────────────────────────────────┘
                  │
                  │ 5. RABBITMQ (port 5672)
                  │
     ┌────────────▼────────────────────────────────┐
     │  Topic Exchange: 'events'                   │
     │  Routing Key: 'maintenance.created'         │
     │  Message: {maintenanceId, tenantId, ...}    │
     │                                             │
     │  (Meddelandet lagras och väntar)            │
     └────────────┬────────────────────────────────┘
                  │
                  │ 6. API GATEWAY (CONSUMER)
                  │
     ┌────────────▼────────────────────────────────┐
     │  RabbitMQ Consumer:                         │
     │                                             │
     │  channel.consume(queue, (msg) => {          │
     │    // Parse datan                          │
     │    const data = JSON.parse(msg.toString()) │
     │                                             │
     │    // Route via WebSocket                   │
     │    io.to('tenant-123')                      │
     │      .emit('maintenance-created', {         │
     │        id: 'maint-456',                    │
     │        message: "Din felanmälan är reg..."  │
     │      })                                     │
     │                                             │
     │    io.to('admin')                           │
     │      .emit('new-maintenance', {             │
     │        id: 'maint-456',                    │
     │        tenantId: 'tenant-123',             │
     │        description: "..."                   │
     │      })                                     │
     │  })                                         │
     └────────────┬────────────────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        │ 7a. WebSocket      │ 7b. WebSocket
        │                    │
    ┌───▼──────────────────┐ ┌──▼────────────────────┐
    │  TENANT FRONTEND     │ │  ADMIN FRONTEND      │
    │  (8002)              │ │  (8001)              │
    │                      │ │                      │
    │  socket.on(          │ │  socket.on(          │
    │  'maintenance-       │ │  'new-maintenance',  │
    │   created', (data)   │ │  (data) => {         │
    │   => {               │ │                      │
    │     Show: "✓ Din     │ │    Show: "⚠️ Ny      │
    │     felanmälan är    │ │    felanmälan från   │
    │     registrerad"     │ │    tenant-123 i A1"  │
    │   }                  │ │                      │
    │                      │ │    Add to list       │
    │  Update UI in        │ │    Update UI in      │
    │  real-time!          │ │    real-time!        │
    └──────────────────────┘ └──────────────────────┘
```

--------------------

## **Förklaring på flöde - del 2:**


```
┌──────────────────────────────────────────────────────────────────┐
│                    TENANT FRONTEND (8002)                        │
│                                                                  │
│  Tenant klickar: "Rapportera fel"                               │
│  ↓                                                               │
│  Form: {                                                         │
│    description: "Vattnet läcker från taket",                    │
│    apartmentId: "apt-A1"                                        │
│  }                                                               │
└────────────────────────┬─────────────────────────────────────────┘
                         │
                         │ POST /maintenance
                         │ Content-Type: application/json
                         │ Authorization: Bearer {JWT}
                         │
         ┌───────────────▼──────────────────┐
         │   API GATEWAY / AUTH (3000)      │
         │                                  │
         │  1. Verify JWT token             │
         │  2. Extract: tenantId, role      │
         │  3. Route to Maintenance Service │
         │  4. Forward request              │
         └───────────────┬──────────────────┘
                         │
                         │ POST /maintenance
                         │ (with tenantId, apartmentId, description)
                         │
         ┌───────────────▼──────────────────┐
         │  MAINTENANCE SERVICE (8004)      │
         │                                  │
         │  1. Receive JSON request         │
         │  2. Validate data                │
         │  3. Save to MongoDB              │
         │  4. Generate maintenanceId       │
         │  5. publishEvent('              │
         │       maintenance.created',     │
         │       {                          │
         │         maintenanceId: "...",   │
         │         tenantId: "tenant-123", │
         │         apartmentId: "apt-A1",  │
         │         description: "..."      │
         │       }                          │
         │     )                            │
         └───────────────┬──────────────────┘
                         │
                         │ Event published
                         │
         ┌───────────────▼──────────────────┐
         │       RABBITMQ (5672)            │
         │                                  │
         │  Topic Exchange: 'events'        │
         │  Routing Key: 'maintenance.*'    │
         │                                  │
         │  Message: {                      │
         │    maintenanceId: "...",         │
         │    tenantId: "tenant-123",       │
         │    apartmentId: "apt-A1",        │
         │    description: "..."            │
         │  }                               │
         └───────────────┬──────────────────┘
                         │
                         │ Event routed
                         │
         ┌───────────────▼──────────────────┐
         │   API GATEWAY / AUTH (3000)      │
         │                                  │
         │  RabbitMQ Consumer:              │
         │  1. Receive event                │
         │  2. Parse data                   │
         │  3. Determine routing:           │
         │     - Send to tenant-123         │
         │     - Send to admin              │
         │     - Send to apartment-A1       │
         │  4. Broadcast via WebSocket      │
         │                                  │
         │  socket.to('tenant-123')        │
         │    .emit('maintenance-created',  │
         │    {                             │
         │      id: "maint-456",           │
         │      status: "created"          │
         │    })                            │
         │                                  │
         │  socket.to('admin')             │
         │    .emit('maintenance-alert',    │
         │    {                             │
         │      id: "maint-456",           │
         │      tenantId: "tenant-123",    │
         │      apartmentId: "apt-A1",     │
         │      description: "..."         │
         │    })                            │
         └───────────────┬──────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌─────────────────────────┐    ┌──────────────────────┐
│  TENANT FRONTEND (8002) │    │  ADMIN FRONTEND (8001)
│                         │    │                      │
│  WebSocket message:     │    │  WebSocket message:  │
│  'maintenance-created'  │    │  'maintenance-alert' │
│                         │    │                      │
│  UI uppdateras:         │    │  UI uppdateras:      │
│  ✓ Din felanmälan är    │    │  ⚠️ Ny felanmälan    │
│    registrerad!         │    │    från Johan i A1!  │
│                         │    │                      │
│  [Se status här]        │    │  [Lägg till svar]    │
└─────────────────────────┘    └──────────────────────┘
```

---

## **Steg-för-steg förklaring:**

**1️⃣ Tenant skickar felanmälan**
```
POST http://localhost:3000/maintenance
Header: Authorization: Bearer eyJhbGciOi...
Body: {
  "description": "Vattnet läcker från taket",
  "apartmentId": "507f1f77bcf86cd799439011"
}
```

**2️⃣ API Gateway verifierar och routar**
```javascript
// API Gateway middleware
verifyJWT(token) 
  → Extract tenantId: "tenant-123"
  → Extract role: "tenant"
  → Forward to Maintenance Service
```

**3️⃣ Maintenance Service sparar och publicerar event**
```javascript
// Maintenance Service
const maintenance = await MaintenanceModel.create({
  tenantId: "tenant-123",
  apartmentId: "apt-A1",
  description: "Vattnet läcker från taket",
  status: "open"
})

// Publicera event
await publishEvent('maintenance.created', {
  maintenanceId: maintenance._id,
  tenantId: "tenant-123",
  apartmentId: "apt-A1",
  description: "..."
})
```

**4️⃣ RabbitMQ routar eventet**
```
RabbitMQ Topic Exchange:
- Exchange name: 'events'
- Routing key: 'maintenance.created'
- Message forwarded to API Gateway consumer
```

**5️⃣ API Gateway consumer mottar och broadcastar**
```javascript
// API Gateway RabbitMQ consumer
channel.consume(queue, (msg) => {
  const event = JSON.parse(msg.content.toString())
  
  if (event.routing_key === 'maintenance.created') {
    const data = event.body
    
    // Send to tenant who created it
    io.to(`tenant-${data.tenantId}`)
      .emit('maintenance-created', {
        message: "Din felanmälan är registrerad",
        id: data.maintenanceId
      })
    
    // Send to admin
    io.to('admin')
      .emit('maintenance-alert', {
        message: "Ny felanmälan från Johan i A1",
        maintenanceId: data.maintenanceId,
        tenantId: data.tenantId,
        apartmentId: data.apartmentId
      })
  }
})
```

**6️⃣ Frontend mottar via WebSocket**
```javascript
// Tenant Frontend
socket.on('maintenance-created', (data) => {
  console.log(data.message) // "Din felanmälan är registrerad"
  showNotification("✓ " + data.message)
  updateUI()
})

// Admin Frontend
socket.on('maintenance-alert', (data) => {
  console.log(data.message) // "Ny felanmälan från Johan i A1"
  showAlert("⚠️ " + data.message)
  refreshMaintenanceList()
})
```

---

## **Data flow sammanfattning:**

```
Tenant Frontend
       ↓ (JSON via REST API)
API Gateway / Auth
       ↓ (Forward JSON)
Maintenance Service
       ↓ (Save to DB + publish event)
RabbitMQ
       ↓ (Route event)
API Gateway / Auth (Consumer)
       ↓ (Broadcast via WebSocket)
Tenant Frontend ← "Din felanmälan är registrerad"
Admin Frontend ← "Ny felanmälan från Johan i A1"
```

---

## **Är det helt rätt nu?** ✅

Du har precis förklarat hela **event-driven microservice architecture** för din system! 🎉

**Nästa frågor:**
1. Vill du att jag börjar implementera API Gateway / Auth?
2. Eller uppdatera Maintenance Service för att publicera events?
3. Eller båda tillsammans?

Vad tycker du? 👀