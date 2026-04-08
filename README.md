# "NovelWebsite": A web app for reading novels

> A full-stack novel reading platform with role-based content management.

A web application where users can browse and read novels, while staff manage content through a structured permission system.
Built to demonstrate scalable backend design, authentication, and real-world engineering challenges.

## 🎬 Application Preview

### Browsing Novels

![Browse Novels](https://github.com/user-attachments/assets/593a1d9e-4e3c-418d-9744-e8f4dd588e98)

### Reading Chapters

![Read-Chapter](https://github.com/user-attachments/assets/d54a08be-74d9-4dc0-8dfa-95fc0a258ac6)

## Motivation



This project was created to explore how a full-stack content platform can be built from the ground up.

I wanted to create a space where novels can be easily shared and read, while also implementing features commonly found in production systems such as authentication, role-based permissions, and content management workflows.

At the same time, this project serves as a way to demonstrate my ability to design, build, and structure a complete web application.

## Quick Start

> Recommended: Try the live demo first for a quick overview.

### 🌐 Live Demo

You can try the application here:
👉 [Live Demo](https://novelwebsite-jawad.onrender.com)

> Note: The app is hosted on a free-tier service from render, so it may:
>
> - Take a few seconds to wake up on first load
> - Occasionally return rate limit errors (HTTP 429)
>
> If this happens, click on this site [Backend Server](https://novelwebsite-backend.onrender.com) and wait till the backend application is ready.
> When it's ready go back to [Live Demo](https://novelwebsite-jawad.onrender.com)
>
> If the problem still persists, please retry after a few moments or run the project locally (Scroll to the bottom of this file, before contributing section, to see the instructions).

## ✨ Key Features
- 🔐 OAuth authentication (Google, Discord)
- 🍪 Session-based auth with HTTP-only cookies
- 🛡️ Role-Based Access Control (User, Staff, Supervisor, Admin)
- 📖 Novel browsing and chapter reading experience
- ✍️ Content management system (create/edit/delete novels & chapters)
- 🔎 Search and optimized reading interface
- 📄 Google Docs → structured chapter ingestion
- ⚡ Parallel testing with isolated environments
- 🌐 Nginx reverse proxy for unified domain + cookie handling

## Challenges & Learnings

### 1. ⚡ Scaling Test Performance with Parallel Execution

**Challenge**

Initial test execution was fully sequential, which made the test suite slow and inefficient as the project grew.

Introducing parallel testing improved speed, but created new issues:
- Shared state between tests
- Data leakage across test suites
- Inconsistent and unreliable test results

**Solution**

To address this, I designed an isolated testing environment:

- Used **Vitest** with parallel execution enabled
- Leveraged `setupFiles` to initialize environments per test suite
- Ran **PostgreSQL** and **Redis** inside Docker containers
- Created isolated databases and logical Redis namespaces per test file

To further optimize performance:
- Implemented **PostgreSQL template databases** to avoid repeated migrations
- Used **key prefixing in Redis** instead of separate databases (bypassing the 16 DB limit)

**Outcome**

- Significantly faster test execution
- Fully isolated and deterministic test runs
- Production-like testing environment without additional infrastructure overhead

---

### 2. 🍪 Handling Authentication Across Domains

**Challenge**

During deployment, the frontend and backend were hosted on different domains.

This caused session cookies to be treated as **third-party cookies**, leading to:
- Authentication failures
- Sessions not being persisted in the browser

**Solution**

Instead of relying on a custom domain, I introduced an **Nginx reverse proxy**:

- Served the frontend and backend under a single domain
- Proxied `/api` requests to the backend service
- Ensured cookies were treated as **first-party** by the browser

**Outcome**

- Stable and secure session-based authentication
- No need for additional cost (custom domains)
- Production-like deployment architecture using reverse proxying

This setup mirrors a production-like environment and ensures scalability and separation of concerns.

## Usage

> Below are the main workflows supported by the application.

### 📚 Browse and Read Novels

Users can explore available novels and read chapters through a clean and simple interface.

- Browse a list of available novels
- Open a novel to view its chapters
- Navigate seamlessly between chapters
  
#### Reading a Chapter

![Read-Chapter](https://github.com/user-attachments/assets/d54a08be-74d9-4dc0-8dfa-95fc0a258ac6)

---

### 🔎 Search & Reading Experience

The application provides tools to improve discoverability and readability:

- Search for novels
- Customize reading settings for a better reading experience
- Optimized layout for long-form content

---

### 🔐 Authentication

Users can securely sign in using OAuth providers:

- Google
- Discord

After authentication:

- A session is created using HTTP-only cookies
- Users remain logged in across requests securely

---

### ✍️ Content Management (Staff)

Users with elevated roles (e.g., Staff) can manage content within the platform:

- Create, edit, and delete novels
- Add, update, and remove chapters
- Assign authors to novels

> Note: These actions are protected via role-based access control (RBAC).

#### Creating a Chapter (Workflow)

The chapter creation process integrates external content (Google Docs) into the platform:

1. Write the chapter using Google Docs
2. Paste the document link into the chapter creation form
3. Click **Preview** to fetch and render the content
4. Review the formatted chapter inside the application
5. Submit the form to create the chapter

Behind the scenes:
- The backend fetches and parses the Google Docs content into structured HTML
- The processed content is returned for preview
- Upon submission, the chapter is persisted in the database
- The frontend provides feedback via toast notifications
- Content is dynamically transformed into a consistent format for rendering across all chapters

![Create Chapter](https://github.com/user-attachments/assets/8edd3846-15d1-46d2-b58a-6f535fd562d2)

---

### 🛡️ Role-Based Access Control

The application implements a hierarchical role-based access control (RBAC) system:

- **User**
  - Can browse and read novels
  - Can manage their own profile

- **Staff**
  - Can create and manage novels and chapters
  - Can only modify content they own (e.g., their own translations)

- **Supervisor**
  - Has elevated permissions over staff
  - Can manage content and users with lower roles
  - Cannot modify users with equal or higher privileges

- **Admin**
  - Full system access
  - Can manage all resources and users
  - Includes safeguards to prevent destructive actions (e.g., self-deletion or privilege conflicts)

Authorization is enforced both:

- At the API level (backend)
- At the feature level (UI visibility)

## Tech Stack

### Frontend
- **React (Vite)** – Fast, modern frontend tooling for building a responsive UI
- **TypeScript** – Ensures type safety and maintainability across the application
- **Tailwind CSS** – Utility-first styling for rapid and consistent UI development

### Backend
- **Node.js + Express** – REST API server handling business logic and request routing
- **TypeScript** – Shared type safety between frontend and backend

### Database
- **PostgreSQL** – Relational database for structured data (users, novels, chapters)
- **Redis** - Cache database for user's sessions
- **MinIO** - Storing images in development environment
- **Drizzle ORM** – Type-safe ORM for schema definition and database queries

### Authentication & Authorization
- **OAuth 2.0** (Google, Discord) – Secure third-party authentication
- **Session-based authentication** – Persistent login sessions using HTTP-only cookies
- **Role-Based Access Control (RBAC)** – Differentiates permissions between users, staff, and admins

### DevOps / Infrastructure
- **Docker** – Containerized development and deployment environments
- **Nginx** – Reverse proxy for routing frontend and backend services
- **Turborepo** – Monorepo management for scalable project structure

## Testing

The project includes a comprehensive automated testing setup designed for reliability and isolation.

### Approach

- **Vitest** is used for fast unit and integration testing
- Tests are executed in **parallel** to improve performance
- Each test file runs in an **isolated environment**

### Test Isolation

To ensure consistency and avoid cross-test interference:

- Each test suite uses its own **isolated PostgreSQL schema/database**
- Each test suite uses its own **isolated Redis instance (logical separation)**
- Shared services (PostgreSQL and Redis) run in **single Docker containers**

This approach provides:
- Deterministic test results
- No state leakage between tests
- Production-like testing conditions

### Coverage

- Unit tests for core business logic
- Integration tests for API endpoints and authentication flows
  
## Architecture

### Overview

The application follows a **full-stack client-server architecture** with a clear separation of concerns between the frontend, backend, and database layers.

### System Design

- The **frontend** communicates with the backend via REST APIs.
- The **backend** handles authentication, authorization, and business logic.
- The **database** stores structured data such as users, novels, and chapters.
- **Nginx** acts as a reverse proxy, routing requests to the appropriate services especially for stage environment.

### Authentication Flow

1. Users authenticate via OAuth providers (Google or Discord)
2. The backend validates the OAuth response
3. A session is created and stored in redis (server-side).
4. A secure HTTP-only cookie is sent to the client
5. Subsequent requests are authenticated via session middleware

### Deployment Architecture

The application is containerized using Docker and can be deployed as multiple services:

- Frontend service (served via Nginx on Render)
- Backend API service (Render)
- PostgreSQL database (Render)
- Redis (Upstash)
- Storage Buckets (Supabase Storage Buckets CDN)

Nginx acts as a reverse proxy to:
- Route `/api` requests to the backend
- Serve frontend assets
- Handle cookies and headers for authentication

## 💻 Run Locally

> Note: Local setup requires configuring OAuth providers and environment variables.

#### Prerequisites

- Node.js
- Docker & Docker Compose

#### Environment Variables

At apps/backend

Create a .env.dev file

.env.dev

```md
DB_PORT = 5433
DATABASE_URL=postgres://dev:dev@localhost:5433/novelwebsite_dev_db

REDIS_URL=redis://localhost:6380

NODE_ENV=development

OAUTH_REDIRECT_URL_BASE=http://localhost:3000/oauth/login/

GOOGLE_CLIENT_ID= YOUR_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET= YOUR_GOOGLE_CLIENT_SECRET

DISCORD_CLIENT_ID= YOUR_DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET= YOUR_DISCORD_CLIENT_SECRET

GOOGLE_APPLICATION_CREDENTIALS=./googleKeys/googleDoc.json

FRONTEND_URL=http://localhost:5173

STORAGE_DRIVER=minio
PUBLIC_BUCKET=novelwebsite-images
STORAGE_PUBLIC_DOMAIN=http://localhost:9000

MINIO_ENDPOINT=http://localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

> Make sure to create a ./googleKeys/googleDoc.json that contains the service account.

#### Setup

At terminal

```bash
git clone https://github.com/your-username/novelwebsite
cd novelwebsite

# Install dependencies
npm install

# Start development servers (starts docker services and seeding the database)
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

> To create an admin user, make sure to tinker around the mockdata.ts file



## 🤝 Contributing

### Clone the repo

```bash
git clone https://github.com/ShyPenguin/NovelWebsite.git
cd NovelWebsite
```

### Install the necessary modules

```bash
npm install
```

### Please refer to Run Locally to know the necessary stuff to run the application locally.

### Run the test suite

```bash
npm run test
```

### Submit a pull request

If you'd like to contribute, please fork the repository and open a pull request to the `main` branch.


