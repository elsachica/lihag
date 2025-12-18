# 📧 Notification Service

Notification Service hanterar all e-postkorrespondens i Lihag-systemet. Den lyssnar på events från andra services (särskilt Maintenance Service) via RabbitMQ och skickar e-postmeddelanden.

---

## 🏗️ Arkitektur

```
Tenant rapporterar felanmälan
         ↓
Maintenance Service (skapar rapport)
         ↓
RabbitMQ (publicerar: maintenance.created)
         ↓
Notification Service (EventHandler lyssnar)
         ↓
MaintenanceHandler (hanterar eventet)
         ↓
Email Service (Gmail eller MailHog)
         ↓
Admin/Tenants mottar e-post
```

---

## 📋 Komponenter

### 1. **EventHandler** (`src/handlers/EventHandler.js`)
- Lyssnar på RabbitMQ-events från Maintenance Service
- Triggar lämplig handler baserat på event-typ (`maintenance.created`, `maintenance.updated` osv)
- Logar all aktivitet

### 2. **MaintenanceHandler** (`src/handlers/MaintenanceHandler.js`)
- Hanterar `maintenance.created`-events från Maintenance Service
- Skickar e-post till admin när ny felanmälan kommer in
- Skickar bekräftelse-e-post till rapportören

### 3. **Email Service** (`src/config/nodemailer.js`)
- Skickar e-post via SMTP
- Stöder både Gmail (produktion) och MailHog (development)
- Använder miljövariabler för konfiguration

### 4. **NotificationController** (`src/controllers/NotificationController.js`)
- GET `/notifications` - Hämta alla notifications
- GET `/notifications/:id` - Hämta specifik notification
- GET `/notifications/tenant/:tenantId` - Hämta tenant-notifications

---

## 🚀 Komma igång

### 1. Development (med MailHog)

MailHog är en lokal e-postserver för testing. Alla e-poster fångas upp och visas i web-UI.

**Starta alla services:**
```bash
docker-compose up
```

### 2. Skapa felanmälan via Maintenance Service

```bash
curl -X POST http://localhost:8004/maintenance-reports \
  -H "Content-Type: application/json" \
  -d '{
    "apartmentId": "694424491cd6621ccf918771",
    "category": "Badrum",
    "description": "Rör läcka under handfatet",
    "priority": "Hög"
  }'
```

### 3. Flödet:
1. Maintenance Service sparar rapporten i sin databas
2. Maintenance Service **publicerar event** `maintenance.created` till RabbitMQ
3. Notification Service tar emot eventet via EventHandler
4. MaintenanceHandler skickar e-post till admin via MailHog
5. E-posten visas i MailHog web-UI: **http://localhost:8025**

---

## 🔐 Gmail Setup (Production)

### Steg 1: Aktivera 2-stegverifiering
1. Gå till https://myaccount.google.com/security
2. Slå på "2-Step Verification"
3. Följ instruktionerna

### Steg 2: Skapa App Password
1. Gå till https://myaccount.google.com/apppasswords
2. Välj "Mail" och "Windows Computer"
3. Google genererar ett 16-teckens lösenord
4. Kopiera lösenordet (utan mellanslag)

### Steg 3: Uppdatera `.env`
```properties
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=elsagaswikstrom@gmail.com
SMTP_PASS=tgbrivxjqtvtvxnw
SMTP_FROM=elsagaswikstrom@gmail.com
ADMIN_EMAIL=elsagaswikstrom@gmail.com
```

### Steg 4: Starta service
```bash
docker-compose up notification
```

---

## 🛠️ Miljövariabler

### Development (`.env`)
```properties
NODE_ENV=development
PORT=8005
DB_CONNECTION_STRING=mongodb://mongodb:27017/notificationDB
RABBITMQ_URL=amqp://admin:password@rabbitmq:5672

# MailHog (local testing)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=mailhog
SMTP_PASS=mailhog
SMTP_FROM=noreply@lihag.se
ADMIN_EMAIL=admin@lihag.se

# Logging
LOG_LEVEL=info
LOGGER_UNCAUGHT_EXCEPTION_LOG_FILE=./logs/uncaught-exception.log
LOGGER_COMBINED_LOG_FILE=./logs/combined.log
LOGGER_ERROR_LOG_FILE=./logs/error.log
```

### Production (`.env.production`)
```properties
NODE_ENV=production
PORT=8005
DB_CONNECTION_STRING=mongodb://mongodb:27017/notificationDB
RABBITMQ_URL=amqp://admin:password@rabbitmq:5672

# Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=elsagaswikstrom@gmail.com
SMTP_PASS=tgbrivxjqtvtvxnw
SMTP_FROM=elsagaswikstrom@gmail.com
ADMIN_EMAIL=elsagaswikstrom@gmail.com

# Logging
LOG_LEVEL=info
LOGGER_UNCAUGHT_EXCEPTION_LOG_FILE=./logs/uncaught-exception.log
LOGGER_COMBINED_LOG_FILE=./logs/combined.log
LOGGER_ERROR_LOG_FILE=./logs/error.log
```

---

## 📧 Event Flow

**Exempel: Tenant rapporterar vattenlecka**

1. **Tenant** skapar felanmälan i Property Service:
   ```bash
   POST /maintenance-reports
   {
     "apartmentId": "694424491cd6621ccf918771",
     "category": "Badrum",
     "description": "Rör läcka under handfatet"
   }
   ```

2. **Maintenance Service** sparar rapporten och **publicerar event** till RabbitMQ:
   ```json
   {
     "type": "maintenance.created",
     "data": {
       "reportId": "123abc...",
       "apartmentId": "694424491cd6621ccf918771",
       "category": "Badrum",
       "status": "Ny"
     }
   }
   ```

3. **Notification Service EventHandler** tar emot event via RabbitMQ

4. **MaintenanceHandler** skickar två e-poster:
   - **Till admin**: "Ny felanmälan - Badrum - Prioritet: Hög"
   - **Till tenant**: "Vi har mottagit din felanmälan"

5. **E-poster** levereras via:
   - **Development**: MailHog (http://localhost:8025)
   - **Production**: Gmail SMTP

---

## 🧪 Test Endpoints

### Hämta alla notifications
```bash
curl http://localhost:8005/notifications
```

**Response:**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

### Hämta notification för tenant
```bash
curl http://localhost:8005/notifications/tenant/TENANT_ID
```

---

## 🐛 Debugging

### Se Notification Service logs
```bash
docker-compose logs -f notification
```

### Se MailHog e-poster
```
http://localhost:8025
```

### Kontrollera RabbitMQ Connection
```
http://localhost:15672
# User: admin
# Password: password
```

### Se om Maintenance Service publicerar events
```bash
docker-compose logs -f maintenance
```

---

## 📚 Filer

```
src/
├── config/
│   ├── mongoose.js      # MongoDB-anslutning
│   ├── winston.js       # Logging
│   ├── morgan.js        # HTTP-logging
│   ├── rabbitmq.js      # RabbitMQ-anslutning
│   └── nodemailer.js    # Email-konfiguration
├── handlers/
│   ├── EventHandler.js      # Lyssnar på RabbitMQ-events
│   └── MaintenanceHandler.js # Hanterar maintenance.created-events
├── controllers/
│   └── NotificationController.js # API-endpoints
├── models/
│   └── Notification.js   # MongoDB-schema
├── routes/
│   ├── router.js
│   └── notificationRoutes.js
├── middleware/
│   └── errorHandler.js   # Global error handler
└── index.js             # Entry point
```

---

## ⚠️ Vanliga problem

### "Cannot connect to RabbitMQ"
- Kontrollera att RabbitMQ körs: `docker-compose ps`
- Kontrollera RABBITMQ_URL i .env

### "Cannot send email"
- **Development**: Kontrollera att MailHog körs på port 1025
- **Production**: Verifiera Gmail App Password är korrekt (no spaces!)

### "EventHandler receives no events"
- Kontrollera att Maintenance Service är igång
- Se logs: `docker-compose logs maintenance`
- Verifiera att events publiceras till RabbitMQ

### "Permission denied: mkdir logs"
- Kontrollera att LOGGER-sökvägar använder `./logs/` (inte `/var/log/`)

---

## 📖 Resurser

- [Winston Logger Docs](https://github.com/winstonjs/winston)
- [Nodemailer Docs](https://nodemailer.com/)
- [MailHog Docs](https://github.com/mailhog/MailHog)
- [RabbitMQ Docs](https://www.rabbitmq.com/documentation.html)