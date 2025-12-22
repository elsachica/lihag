# 📧 Notification Service

Notification Service hanterar all e-postkorrespondens i Lihag-systemet. Den lyssnar på events från andra services (särskilt Maintenance Service) via RabbitMQ och skickar e-postmeddelanden.

---

## 🏗️ Arkitektur

```
Maintenance Service (skapar rapport)
         ↓
Publicerar event till RabbitMQ
         ↓
Notification Service (EventHandler lyssnar på queue)
         ↓
MaintenanceHandler:
  1. Hämtar lägenhet-info från Property Service
  2. Hämtar beskrivning från Maintenance Service API
  3. Genererar HTML email
  4. Skickar via MailHog (dev) eller Gmail (prod)
  5. Sparar notification till MongoDB
         ↓
Admin mottar e-post
```

**Detaljerat flöde:**

1. Maintenance Service skapar felanmälan-rapport
2. Maintenance Service publicerar `maintenance.created` event till RabbitMQ (`maintenance-exchange`)
3. Notification Service tar emot event från `notification.events` queue
4. EventHandler routar till MaintenanceHandler
5. MaintenanceHandler:
   - Fetchar lägenhet-data från `http://property:8003/apartments/{apartmentId}`
   - Fetchar rapport-detaljer från `http://maintenance:8002/maintenance/{reportId}`
   - Genererar HTML-mail med alla detaljer
   - Skickar mail via SMTP (MailHog lokalt, Gmail i produktion)
   - Sparar notification i MongoDB med status `sent`

---

## 📋 Komponenter

### 1. **EventHandler** (`src/handlers/EventHandler.js`)

- Lyssnar på RabbitMQ-events från Maintenance Service
- Tar emot messages från `notification.events` queue
- Routar till lämplig handler baserat på event-typ (`maintenance.created`)
- Logar all aktivitet

### 2. **MaintenanceHandler** (`src/handlers/MaintenanceHandler.js`)

- Hanterar `maintenance.created`-events
- `getApartmentDetails()` - Fetchar lägenhet-nummer från Property Service API

  ```javascript
  http://property:8003/apartments/{apartmentId}
  ```

  Returnerar: `{ number, tenantId, tenantName, area }`

- `getMaintenanceDetails()` - Fetchar rapport-detaljer från Maintenance Service API

  ```javascript
  http://maintenance:8002/maintenance/{reportId}
  ```

  Returnerar: `{ description, category, ...andra fält }`

- Genererar HTML-mail med templatefunktionen
- Skickar mail via Nodemailer (MailHog eller Gmail)
- Sparar notification i MongoDB med status `sent`/`failed`

### 3. **Email Templates** (`src/templates/EmailTemplates.js`)

- `getMaintenanceCreatedTemplate()` - HTML template för admin-notifiering
- Visar: Lägenhet, Hyresgäst, Felanmälan ID, Kategori, Status, Problem-beskrivning
- Returnerar: `{ subject, html }`

### 4. **Email Service** (`src/config/nodemailer.js`)

- Initialiserar Nodemailer med SMTP-konfiguration
- **Development**: Skickar till MailHog på `mailhog:1025`
- **Production**: Skickar till Gmail SMTP `smtp.gmail.com:587`
- Konfigureras via miljövariabler

### 5. **NotificationController** (`src/controllers/NotificationController.js`)

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

**Hämta först ett verkligt apartment ID:**

```bash
curl -s http://localhost:8003/apartments | jq '.[0] | {number, id}'
```

Sedan skapa felanmälan (använd ett verkligt apartment ID):

```bash
curl -X POST http://localhost:8002/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "apartmentId": "694924f0246791b5ab90d723",
    "category": "Badrum",
    "description": "Kranar på handfatet är rostiga och läcker",
    "priority": "Hög"
  }'
```

**Response:**

```json
{
  "data": {
    "id": "69492ab788259f7797c48d5f",
    "apartmentId": "694924f0246791b5ab90d723",
    "category": "Badrum",
    "description": "Kranar på handfatet är rostiga och läcker",
    "status": "Ny",
    "assignedTo": null,
    "priority": "Hög",
    "images": [],
    "createdAt": "2025-12-22 11:25"
  }
}
```

Nu kommer Notification Service att:

1. Ta emot `maintenance.created` event från RabbitMQ
2. Hämta lägenhet-data från Property Service
3. Skicka e-post via MailHog
4. Spara notification i MongoDB

### 3. Följ flödet

**Se Maintenance Service logs (publicerar event):**

```bash
docker-compose logs -f maintenance | grep -i "event\|published"
```

**Se Notification Service logs (tar emot event):**

```bash
docker-compose logs -f notification | grep -i "received\|email\|notification"
```

### 4. Öppna MailHog för att se e-posterna

Gå till: **http://localhost:8025**

Du bör se en e-post med:

- **Subject**: `Ny felanmälan: A1` (eller lägenhet-numret)
- **Content**: Lägenhet, Hyresgäst, Kategori, Beskrivning, Status

---
## 🔐 Gmail Setup (Production)

### ⚠️ VIKTIGT - Läs detta först!

Du **måste** använda en **verklig Gmail-adress** för både `SMTP_USER` och `SMTP_FROM`. E-poster från okända domäner (t.ex. `noreply@lihag.se`) blockeras av Gmail och levereras aldrig.

### Steg-för-steg Setup

#### 1️⃣ Aktivera 2-stegverifiering på ditt Google-konto

- Gå till: https://myaccount.google.com/security
- Slå på **"2-Step Verification"**
- Följ instruktionerna (bekräfta med telefon)

#### 2️⃣ Skapa App Password

- Gå till: https://myaccount.google.com/apppasswords
- Välj: **"Mail"** och **"Windows Computer"**
- Klicka: **"Generate"**
- Google ger dig ett **16-teckens lösenord** (utan mellanslag)
- **Kopiera det** - du behöver det nu!

#### 3️⃣ Skapa `.env.production` fil i rotmappen

Skapa fil: `lihag-system/.env.production`

```properties
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=din-email@gmail.com
SMTP_PASS=ditt16charapppassword
SMTP_FROM=din-email@gmail.com
ADMIN_EMAIL=mottagare@gmail.com
```

#### 4️⃣ (Optional) Skapa `.env.development` för MailHog-testing

Skapa fil: `lihag-system/.env.development`

```properties
NODE_ENV=development
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=test
SMTP_PASS=test
SMTP_FROM=noreply@lihag.se
ADMIN_EMAIL=admin@lihag.se
```

#### 5️⃣ Docker-compose konfiguration

Din `docker-compose.yaml` notification-sektion bör se ut såhär:

```yaml
  notification:
    build:
      context: ./services/notification
      dockerfile: Dockerfile.development
    container_name: lihag-notification
    ports:
      - "8005:8005"
    environment:
      PORT: 8005
      DB_CONNECTION_STRING: mongodb://mongodb:27017/notificationDB
      RABBITMQ_URL: amqp://admin:password@rabbitmq:5672
      SMTP_HOST: ${SMTP_HOST}
      SMTP_PORT: ${SMTP_PORT}
      SMTP_USER: ${SMTP_USER}
      SMTP_PASS: ${SMTP_PASS}
      SMTP_FROM: ${SMTP_FROM}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      LOG_LEVEL: info
    volumes:
      - ./services/notification:/usr/src/app
      - /usr/src/app/node_modules
    depends_on:
      mongodb:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
      mailhog:
        condition: service_started
    command: npx nodemon -e js,json --inspect=0.0.0.0:9229 src/index.js
    networks:
      - lihag-network
    restart: unless-stopped
```

**Viktigt:** `${SMTP_HOST}`, `${SMTP_USER}` osv. läses från `.env`-filen!


#### 6️⃣ Starta servicen

**För Gmail (production):**

```bash
docker-compose --env-file .env.production up notification
```

**För MailHog (development/testing):**

```bash
docker-compose --env-file .env.development up notification
```

### ✅ Verifiering

Service är igång när du ser:

```
✅ Email service initialized successfully with Gmail
✅ RabbitMQ consumer connected and listening on notification.events
MongoDB connected
```

### Skapa testfelanmälan

```bash
curl -X POST http://localhost:8002/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "apartmentId": "694924f0246791b5ab90d723",
    "category": "Badrum",
    "description": "TEST - Gmail integration",
    "priority": "Hög"
  }'
```

Gå till din Gmail inbox - e-posten bör komma inom 2-3 sekunder! ✅

---

## 🧪 Test & Debugging

### Hämta apartment IDs

```bash
curl -s http://localhost:8003/apartments | jq '.[] | {number, id}' | head -20
```

### Skapa felanmälan

```bash
curl -X POST http://localhost:8002/maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "apartmentId": "694924f0246791b5ab90d723",
    "category": "Badrum",
    "description": "TEST - Kran läcker",
    "priority": "Hög"
  }'
```

### Se Notification Service logs

```bash
docker-compose logs -f notification | grep -E "Email|RabbitMQ|MongoDB"
```

### Se alle notifications i MongoDB

```bash
docker exec lihag-mongodb mongosh notificationDB --eval "db.notifications.find().limit(5).pretty()"
```

---

## 📚 Resurser

- [Nodemailer Gmail Setup](https://nodemailer.com/smtp/gmail/)
- [Google App Passwords](https://support.google.com/accounts/answer/185833)
- [MailHog Docs](https://github.com/mailhog/MailHog)
- [RabbitMQ Docs](https://www.rabbitmq.com/documentation.html)
