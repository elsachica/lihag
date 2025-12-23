# Assignment 3 - Maintenance microservice 

**Contributor: Liv Åberg <lh224hh@student.lnu.se>**  
**Version: 1.0.0**  
**Language: JavaScript** 

## Service Overview

The service:  
- Provides tenant profile and apartment information  
- Allows tenants to submit and follow maintenance requests  
- Sends events to RabbitMQ for notifications
- Uses Redis for caching.


## Features

- Log in to view apartment information  
- Submit maintenance requests  
- View upcoming rents  

---

## Technical Architecture

Maintenance Service is a microservice responsible for tenant views, such as their own apartments and maintenance requests. Reads and writes data via the Admin Service.  

### Frontend
- **Tenant dashboard (“My Pages”):** 
For logged-in tenants.  

### Communication
- **REST API** between frontend and microservices  
- **RabbitMQ** for asynchronous communication between microservices (e.g., maintenance request → notification)  

### Infrastructure
- **GitLab CI/CD** pipelines for automatic build, test, and deployment  
- **Docker** for containerization  
- **Kubernetes (Minikube)** for orchestration (optionally with Helm Charts)  
- **Terraform/Ansible** for infrastructure management  

---

## Typical User Flow

1. Tenant logs in via frontend (Auth Service validates credentials)
2. Tenant views apartment info and maintenance requests (Tenant Service via Admin Service)
3. Tenant submits maintenance requests (Tenant → Admin → Notification via RabbitMQ)


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