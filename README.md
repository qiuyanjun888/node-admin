# Node Admin - Enterprise General Management Framework

Node Admin is a premium, enterprise-grade general-purpose back-office management framework designed for scalability, maintainability, and a superior developer experience. It provides a robust foundation for building complex administrative systems with a modern technology stack.

## 🌟 Key Features

- **Rich Feature Modules**: Pre-built modules for core administrative tasks.
- **RBAC (Role-Based Access Control)**: Granular permission management including:
  - **User Management**: Comprehensive user lifecycle management.
  - **Role Management**: Flexible role definition and assignment.
  - **Menu Management**: Dynamic navigation and menu structure control.
  - **Department Management**: Organizational hierarchy management.
- **Developer Friendly**: Structured for easy development and long-term maintenance.
- **Modern Aesthetics**: Built with professional, premium designs using the latest UI technologies.

## 🛠 Technology Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (A progressive Node.js framework)
- **ORM**: [Prisma](https://www.prisma.io/) (Next-generation Node.js and TypeScript ORM)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Documentation**: [Swagger](https://swagger.io/) (OpenAPI)
- **Validation**: [class-validator](https://github.com/typestack/class-validator) & [class-transformer](https://github.com/typestack/class-transformer)
- **Security**: JWT Authentication & Passport

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Data Fetching**: [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Navigation**: [React Router](https://reactrouter.com/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file from the provided configuration.
   - Set your `DATABASE_URL`.
4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Run the dev server:
   ```bash
   npm run start:dev
   ```
   *Access API documentation at `http://localhost:3000/api/docs`*

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   *Access the web app at `http://localhost:5173`*

## 📁 Project Structure

```text
node-admin/
├── backend/            # NestJS Backend API
│   ├── prisma/         # Prisma schema and migrations
│   └── src/            # Application source code
├── frontend/           # React Frontend App
│   └── src/            # Application source code
└── README.md           # Project documentation
```

## 📜 License

This project is licensed under the MIT License.
