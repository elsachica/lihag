# 4Chics – Housing Management System for Lihag AB

## Project Overview
A web-based housing management system for Lihag AB, designed to simplify rental apartment administration and improve communication between tenants and property administrators.

---

## Team Members
- Elsa Gas Wikström
- Anna Ståhlberg
- Cecilia Nilsson
- Liv Åberg

---

## Features

### For Visitors
- View available apartments
- Submit interest applications via a form
- Read about the company
- Contact Lihag

### For Tenants
- Log in to view apartment information
- Submit maintenance requests
- View upcoming rents

### For Administrators
- Create, update, and delete apartments
- Mark apartments as available or rented
- Manage users (create/delete)
- View current and historical rents
- Access statistics (rented apartments, rental income, payments)
- Send notifications to tenants via email

---

## Technical Architecture

### Microservices
- **Auth Service:** Handles authentication and roles (admin/tenant), generates JWT tokens for the frontend.
- **Property Service:** Manages apartments, tenants, maintenance requests, rent info, and statistics.
- **Maintenance Service:** Handles maintenance requests and related workflows.
- **Notification Service:** (Planned) Will asynchronously send emails via RabbitMQ (e.g., rent reminders, maintenance updates).

### Frontend
A web application with different views (routes) for:
- **Home page:** Available apartments, About, Contact, and tenant login form.
- **Tenant dashboard (“My Pages”):** For logged-in tenants.
- **Admin panel:** Separate login and dashboard for administrators.

### Databases
- **authDB:** Stores user credentials and authentication data.
- **propertyDB:** Stores apartments, tenants, contracts, rents, and property information.
- **maintenanceDB:** Stores maintenance requests, work orders, status updates, and related messages.

### Communication
- **REST API** between frontend and microservices
- **RabbitMQ** (planned) for asynchronous communication between microservices

### Infrastructure
- **GitLab CI/CD** pipelines for automatic build, test, and deployment
- **Docker** for containerization
- **Kubernetes (Minikube)** for orchestration (optionally with Helm Charts)
- **Terraform/Ansible** for infrastructure management

---

## Service Responsibilities

### Auth Service
- Validates login credentials against UserDB
- Issues JWT tokens for authenticated users
- Manages sessions and token validation
- Uses Redis for session and cache management

### Property Service
- Manages CRUD operations for apartments and tenants
- Handles maintenance requests and status updates
- Provides rental and apartment statistics
- (Planned) Sends events to RabbitMQ for notifications
- Uses Redis for caching

### Maintenance Service
- Handles maintenance requests and related workflows
- (Planned) Sends events to RabbitMQ for notifications

### Notification Service (Planned)
- Listens to events from RabbitMQ
- Sends emails to tenants and administrators (e.g., rent reminders, maintenance updates)
- Integrates with email APIs (SMTP, SendGrid, Mailgun, etc.)


---

## Typical User Flows

### Tenant
1. Logs in via frontend (Auth Service validates credentials)
2. Views apartment info and maintenance requests (Tenant Service via Admin Service)
3. Submits maintenance requests (Tenant → Admin → Notification via RabbitMQ)

### Admin
1. Logs in via frontend (Auth Service validates credentials)
2. Manages apartments, tenants, maintenance, and statistics (Admin Service)
3. Sends notifications via Notification Service

---

## Notifications
- Notification Service receives events via RabbitMQ and sends emails accordingly.
- **Examples:** Rent reminders, maintenance updates, new maintenance requests, resolved issues.

---

## Technologies Used
- **Node.js** (services)
- **Redis** (caching and session management)
- **RabbitMQ** (event/message broker)
- **Docker, Kubernetes, Terraform, Ansible** (infrastructure)
- **GitLab CI/CD**

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

Copyright (c) 2026 4Chics Team
- Elsa Gas Wikström
- Anna Ståhlberg
- Cecilia Nilsson
- Liv Åberg