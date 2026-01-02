# Node Admin Backend

This is the backend for the Node Admin enterprise-grade general management framework, built with NestJS and Prisma.

## 🚀 Key Technologies

- **Framework**: [NestJS](https://nestjs.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **API Docs**: [Swagger](https://swagger.io/)
- **Validation**: [class-validator](https://github.com/typestack/class-validator)

## 🛠 Features

- **RBAC Foundation**: User, Role, Menu, and Department management.
- **RESTful API**: Clean and consistent API design.
- **Auto-generated Documentation**: Interactive API documentation.
- **Modern Security**: JWT-based authentication.

## 🏁 Getting Started

### Installation

```bash
npm install
```

### Database Setup

1. Ensure PostgreSQL is running.
2. Update `.env` with your `DATABASE_URL`.
3. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Running the App

```bash
# development
npm run start:dev

# production
npm run build
npm run start:prod
```

## 📚 API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
`http://localhost:3000/api/docs`

## 📜 License

This project is licensed under the MIT License.

