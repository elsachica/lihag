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
- **Admin Service:** Manages all admin functionality: apartments, tenants, maintenance requests, rent info, and statistics.
- **Tenant Service:** Responsible for tenant views, such as their own apartments and maintenance requests. Reads and writes data via the Admin Service.
- **Notification Service:** Asynchronously sends emails via RabbitMQ (e.g., rent reminders, maintenance updates).

### Frontend
A web application with different views (routes) for:
- **Home page:** Available apartments, About, Contact, and tenant login form.
- **Tenant dashboard (“My Pages”):** For logged-in tenants.
- **Admin panel:** Separate login and dashboard for administrators.

### Databases
- **UserDB:** Stores usernames and hashed passwords.
- **AdminDB:** Stores apartments, tenants, maintenance requests, history, and rents.

### Communication
- **REST API** between frontend and microservices
- **RabbitMQ** for asynchronous communication between microservices (e.g., maintenance request → notification)

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

### Tenant Service
- Provides tenant profile and apartment information
- Allows tenants to submit and view maintenance requests
- Sends events to RabbitMQ for notifications
- Uses Redis for caching

### Admin Service
- Manages CRUD operations for apartments and tenants
- Handles maintenance requests and status updates
- Provides rental and apartment statistics
- Sends events to RabbitMQ for notifications
- Uses Redis for caching

### Notification Service
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