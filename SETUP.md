# 🚀 Lihag System - Setup Guide

## Environment Configuration

### For Development

1. **Create a symlink from `.env.production` to `.env`:**

```bash
ln -s .env.production .env
```

This allows `docker-compose` to automatically read environment variables without needing the `--env-file` flag.

**Why?** Docker Compose automatically loads from `.env` by default, making commands simpler:

- ✅ `docker-compose up` (instead of `docker-compose --env-file .env.production up`)
- ✅ `docker-compose logs notification` (instead of `docker-compose --env-file .env.production logs notification`)

### For Production

In production, use the explicit flag:

```bash
docker-compose --env-file .env.production up -d
```

Or set the environment file in your deployment system (Kubernetes, Docker Swarm, etc.).

---

## First-Time Setup Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd lihag-system
```

2. **Create the `.env` symlink** (development)

```bash
ln -s .env.production .env
```

3. **Start all services**

```bash
docker-compose up -d
```

4. **Verify services are running**

```bash
docker-compose ps
```

All containers should show `Up` status.

---

## Environment Files

### `.env.production` (Template - Required)

This file contains all production/external email configuration:

```properties
NODE_ENV=production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@gmail.com
```

**⚠️ Important:**

- This file is in `.gitignore` - do NOT commit it
- Each developer/environment needs their own copy
- Gmail App Passwords are required (see Notification Service README)

### `.env` (Symlink)

**DO NOT create this file manually.** It should be a symlink to `.env.production`:

```bash
ln -s .env.production .env
```

This ensures:

- Single source of truth
- Easier to maintain
- Prevents accidental commits

---

## Services Overview

| Service      | Port  | Purpose                                 |
| ------------ | ----- | --------------------------------------- |
| Property     | 8003  | Apartment management API                |
| Notification | 8005  | Email notifications (RabbitMQ consumer) |
| Maintenance  | 8002  | Maintenance request API                 |
| Auth         | 8000  | Authentication service                  |
| Frontend     | 5173  | Tenant portal UI                        |
| MongoDB      | 27017 | Primary database                        |
| RabbitMQ     | 5672  | Event broker                            |
| MailHog      | 8025  | Email testing UI (development only)     |

---

## Common Commands

```bash
# Start all services
docker-compose up -d

# View logs for a specific service
docker-compose logs -f notification

# View all logs with filtering
docker-compose logs -f | grep -E "ERROR|WARN"

# Stop all services
docker-compose down

# Remove all data (fresh start)
docker-compose down -v

# Check service health
docker-compose ps
```

---

## Troubleshooting

### Services won't start

```bash
# Check if ports are already in use
lsof -i :8003  # Check port 8003
kill -9 <PID>  # Kill the process using the port
```

### Environment variables not loading

```bash
# Verify .env exists and is a symlink
ls -la .env
# Output should show: .env -> .env.production

# If it's not a symlink, create it:
rm .env
ln -s .env.production .env
```

### Email not sending

```bash
# Check Notification Service logs
docker-compose logs notification | grep -i "email"

# Verify credentials in .env.production
cat .env.production

# Test with MailHog instead (development)
# Open http://localhost:8025
```

---

## Next Steps

- See individual service READMEs for detailed documentation
- Check `docker-compose.yaml` for all service configuration
- Review `.gitignore` to understand what files are excluded
