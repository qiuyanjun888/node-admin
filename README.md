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

## 🚀 快速开始

### 先决条件

- Node.js (v18+，建议 v20+)
- pnpm (已通过 corepack 锁定版本)
- PostgreSQL 已安装并运行

### 安装依赖

在仓库根目录执行：

```bash
pnpm install
```

### 环境变量

后端需要配置 `DATABASE_URL`：

```bash
cp apps/backend/.env.example apps/backend/.env
```

然后根据实际数据库连接信息修改 `apps/backend/.env`。

### 启动开发环境

在仓库根目录执行：

```bash
pnpm dev
```

或分别启动：

后端（NestJS）

```bash
pnpm --filter @node-admin/backend start:dev
```

访问：`http://localhost:3000/api/docs`

前端（Vite）

```bash
pnpm --filter @node-admin/frontend dev
```

访问：`http://localhost:5173`

### 编译、检查、测试（推荐在根目录）

```bash
pnpm build
pnpm lint
pnpm test
```

说明：

- 后端 `build` 已包含 `prisma generate`，不需要手动执行。
- 如需单独生成 Prisma Client：
  ```bash
  pnpm --filter @node-admin/backend exec prisma generate
  ```

## 📁 项目结构（Monorepo）

```text
node-admin/
├── apps/
│   ├── backend/                # NestJS 后端
│   │   ├── prisma/             # Prisma schema 和迁移
│   │   └── src/                # 后端源码
│   └── frontend/               # React + Vite 前端
│       ├── src/                # 前端源码
│       └── test/               # 前端测试
├── packages/
│   ├── shared-types/           # 前后端共享类型
│   ├── eslint-config/          # 共享 ESLint 配置
│   └── tsconfig/               # 共享 TS 基础配置
├── pnpm-workspace.yaml         # pnpm workspace 定义
├── turbo.json                  # Turbo 任务编排
└── README.md
```

## 📜 License

This project is licensed under the MIT License.
