# Sistema de Ventas

Modern point-of-sale (POS) and sales management system built with React 19, TypeScript, and
Supabase.

## 🚀 Features

- **Point of Sale (POS)** - Fast and intuitive sales interface
- **Product Management** - Complete CRUD operations for products and categories
- **Inventory Control** - Multi-warehouse and multi-branch inventory tracking
- **Sales Reporting** - Advanced analytics and charts
- **Multi-currency Support** - Handle different currencies
- **User Roles & Permissions** - Fine-grained access control
- **Real-time Data** - Live updates with Supabase subscriptions
- **Print Support** - Direct printing of receipts and invoices
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

### Frontend

- **React 19.2** - Latest React with new features
- **TypeScript 5.9** (Strict Mode) - Full type safety
- **Vite 7.3** - Lightning-fast build tool
- **Ant Design 5.29** - Professional UI component library
- **Styled Components 6.1** - CSS-in-JS styling
- **React Router 7.11** - Client-side routing
- **Zustand 5.0** - Lightweight state management (30 stores)

### Backend & Data

- **Supabase 2.89** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)

### Data Fetching & Caching

- **TanStack Query 5.90** (React Query) - Server state management
- **TanStack Table 8.21** - Headless table library

### Additional Libraries

- **React Hook Form 7.69** - Form management
- **date-fns 4.1** / **dayjs 1.11** - Date manipulation
- **Recharts 3.6** - Data visualization
- **pdfmake 0.2** / **@react-pdf/renderer 4.3** - PDF generation
- **Firebase 12.7** - Analytics and hosting

## 📋 Prerequisites

- **Node.js** >= 18.x
- **pnpm** >= 8.x (package manager)
- **Supabase account** (for database)

## 🚀 Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd sistema-ventas
   ```

2. **Install dependencies with pnpm:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   VITE_APP_SUPABASE_URL=your_supabase_url
   VITE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Build for production (includes TypeScript type checking)
pnpm preview      # Preview production build locally
pnpm lint         # Run ESLint on TypeScript/JavaScript files
pnpm type-check   # Run TypeScript type checking without building
```

## 📁 Project Structure

```
sistema-ventas/
├── public/              # Static assets (logo, icons)
├── src/
│   ├── components/      # React components (Atomic Design)
│   │   ├── atomos/      # Atoms (smallest components)
│   │   ├── moleculas/   # Molecules (combinations of atoms)
│   │   ├── organismos/  # Organisms (complex components)
│   │   ├── templates/   # Page templates
│   │   └── ui/          # Reusable UI components
│   ├── context/         # React Context providers
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── reports/         # Report generation components
│   ├── routers/         # Routing configuration
│   ├── store/           # Zustand stores (30 stores for state management)
│   ├── styles/          # Global styles, themes, variables
│   ├── supabase/        # Supabase client and CRUD functions (22 files)
│   ├── tanstack/        # TanStack Query hooks
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   ├── main.tsx         # Application entry point
│   └── index.ts         # Barrel exports
├── .env                 # Environment variables (create from example)
├── tsconfig.json        # TypeScript configuration (strict mode)
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## 🗄️ Database Setup

This application uses **Supabase** as the backend. You'll need to:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up your database schema (tables for products, sales, users, etc.)
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers (email, Google OAuth, etc.)
5. Copy your Supabase URL and anon key to `.env`

### Required Tables

The system expects the following main tables:

- `productos` - Products catalog
- `categorias` - Product categories
- `clientes` - Customers
- `proveedores` - Suppliers
- `ventas` - Sales transactions
- `detalle_venta` - Sale line items
- `usuarios` - System users
- `empresa` - Company settings
- `almacenes` - Warehouses
- `cajas` - Cash registers
- `sucursales` - Branches
- `metodos_pago` - Payment methods
- And more...

## 🏗️ Building for Production

1. **Build the application:**

   ```bash
   pnpm build
   ```

   This will:
   - Run TypeScript type checking
   - Build optimized production bundle
   - Output to `dist/` directory

2. **Preview the build:**

   ```bash
   pnpm preview
   ```

3. **Deploy** to your hosting provider:
   - Vercel
   - Netlify
   - Firebase Hosting (already configured)
   - Or any static hosting service

## 🔐 Environment Variables

| Variable                     | Description                 | Required |
| ---------------------------- | --------------------------- | -------- |
| `VITE_APP_SUPABASE_URL`      | Your Supabase project URL   | Yes      |
| `VITE_APP_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes      |

## 🎨 Architecture Highlights

### Atomic Design Pattern

Components are organized following Atomic Design methodology:

- **Atoms**: Basic building blocks (buttons, inputs)
- **Molecules**: Simple combinations of atoms
- **Organisms**: Complex, feature-specific components
- **Templates**: Page-level layouts

### State Management

- **Zustand**: 30 specialized stores for client state
- **TanStack Query**: Server state, caching, and synchronization
- **React Context**: Authentication context

### Type Safety

- **100% TypeScript coverage** with strict mode enabled
- Type definitions for all entities, stores, and API responses
- Compile-time error detection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Support

For support or questions:

- Open an issue in the GitHub repository
- Check [CLAUDE.md](./CLAUDE.md) for AI-assisted development guide

## 🎯 Development Notes

- This project uses **pnpm** for efficient package management
- TypeScript is configured in **strict mode** - all code must be typed
- ESLint is configured for TypeScript and React best practices
- Git hooks may be configured for pre-commit checks
- The project follows conventional commits format

## 🌟 Recent Updates

- ✅ Migrated from npm to pnpm
- ✅ Updated to React 19.2
- ✅ Complete TypeScript migration (217 files)
- ✅ Updated all packages to latest versions
- ✅ Vite 7.3 with improved build performance
- ✅ React Router 7.11 with new features
- ✅ Zustand 5.0 (TypeScript-first)
- ✅ Firebase 12.7 integration

---

Built with ❤️ using modern web technologies
