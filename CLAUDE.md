# AI Agent Guide - Sistema de Ventas

This document helps AI assistants (Claude, Gemini, ChatGPT, etc.) understand the codebase architecture, patterns, and conventions to provide better assistance when working with this project.

## 📌 Project Overview

**Sistema de Ventas** is a comprehensive point-of-sale (POS) and inventory management system for retail businesses. It follows modern React best practices with TypeScript strict mode, functional components, and modular architecture.

### Tech Stack Summary
- **Frontend**: React 19 + TypeScript 5.9 (strict)
- **Build**: Vite 7.3
- **State**: Zustand 5.0 (30 stores) + TanStack Query 5.90
- **Backend**: Supabase (PostgreSQL + REST + Realtime)
- **Styling**: Styled Components 6.1 + Ant Design 5.29
- **Package Manager**: **pnpm** (important!)

## 🏗️ Architecture Patterns

### 1. Atomic Design Structure

Components follow Atomic Design methodology:

```
components/
├── atomos/         # Atoms - smallest UI elements (buttons, icons, inputs)
├── moleculas/      # Molecules - simple combinations of atoms
├── organismos/     # Organisms - complex components (forms, tables, headers)
├── templates/      # Templates - page layouts
└── ui/             # Shared UI components (lists, toggles, messages)
```

**When creating components:**
- Start with atoms for reusable UI elements
- Build molecules by combining atoms
- Create organisms for feature-specific functionality
- Use templates for page-level layouts

### 2. State Management Pattern

**Zustand Stores** (30 stores in `src/store/`):

Each entity has its own dedicated store following this pattern:

```typescript
// Example: ProductosStore.ts
import { create } from "zustand"

interface ProductosState {
  data: Producto[]
  itemSelect: Producto | null
  buscador: string
  parametros: Record<string, unknown>
}

interface ProductosActions {
  mostrar: (params: MostrarParams) => Promise<Producto[]>
  insertar: (data: InsertParams) => Promise<Producto>
  editar: (data: Producto) => Promise<void>
  eliminar: (id: number) => Promise<void>
  select: (item: Producto) => void
  setBuscador: (text: string) => void
}

type ProductosStore = ProductosState & ProductosActions

export const useProductosStore = create<ProductosStore>((set, get) => ({
  // State
  data: [],
  itemSelect: null,
  buscador: "",
  parametros: {},

  // Actions
  mostrar: async (p) => {
    const response = await MostrarProductos(p)
    set({ data: response, itemSelect: response[0] ?? null, parametros: p })
    return response
  },
  insertar: async (p) => {
    const response = await InsertarProductos(p)
    const { mostrar, parametros } = get()
    await mostrar(parametros)
    return response
  },
  // ... other actions
}))
```

**Key Patterns:**
- Separate state interface from actions interface
- Combine with intersection type (`State & Actions`)
- CRUD operations call Supabase functions
- After mutations, refetch data using stored `parametros`
- Always handle null cases (strict mode requirement)

### 3. Supabase CRUD Pattern

All database operations are in `src/supabase/crud*.ts` files (22 CRUD modules):

```typescript
// Example: crudProductos.ts
import { supabase } from './supabase.config'
import type { Producto, MostrarProductosParams } from '../types'

export async function MostrarProductos(params: MostrarProductosParams): Promise<Producto[]> {
  const { data, error } = await supabase.rpc("mostrarproductos", {
    _id_empresa: params.id_empresa
  })

  if (error) throw new Error(error.message)
  return data as Producto[]
}

export async function InsertarProductos(params: InsertProductoParams): Promise<Producto> {
  const { data, error } = await supabase.rpc("insertarproductos", params)
  if (error) throw new Error(error.message)
  return data as Producto
}
```

**Pattern:**
- Use RPC functions for complex operations (mostrar, insertar, editar)
- Use direct table operations for simple queries (eliminar)
- Always check for errors and throw meaningful messages
- Type parameters and return values explicitly
- **Function names are in Spanish** (legacy, keep consistent)

### 4. Component Patterns

**Functional Components with TypeScript:**

```typescript
import type { ReactNode } from 'react'
import styled from 'styled-components'

interface MyComponentProps {
  title: string
  onSave?: (data: FormData) => void
  children?: ReactNode
}

export function MyComponent({ title, onSave, children }: MyComponentProps) {
  const [state, setState] = useState<string>("")
  const store = useMyStore()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave?.(data)
  }

  return (
    <Container>
      <h1>{title}</h1>
      {children}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* styles */
`
```

**Key Points:**
- Use **named exports** (not default)
- Props interface before component
- Optional props with `?`
- Event handlers use React types (`React.MouseEvent`, `React.ChangeEvent`, etc.)
- Styled components at bottom of file
- Use transient props `$propName` for styled-components to avoid DOM warnings

### 5. Form Handling

Forms use **React Hook Form**:

```typescript
import { useForm } from "react-hook-form"

interface FormData {
  nombre: string
  precio: number
}

export function FormComponent() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()
  const store = useProductosStore()

  const onSubmit = async (data: FormData) => {
    await store.insertar(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("nombre", { required: true })} />
      {errors.nombre && <span>Campo requerido</span>}
      <button type="submit">Guardar</button>
    </form>
  )
}
```

### 6. Data Fetching with TanStack Query

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

function ProductList() {
  const queryClient = useQueryClient()
  const { data: productos, isLoading } = useQuery({
    queryKey: ["productos", empresaId],
    queryFn: () => useProductosStore.getState().mostrar({ id_empresa: empresaId })
  })

  const mutation = useMutation({
    mutationFn: insertarProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] })
    }
  })
}
```

## 📁 File Naming Conventions

- **Components**: PascalCase + `.tsx` (e.g., `ProductosTemplate.tsx`)
- **Stores**: PascalCase + "Store" + `.ts` (e.g., `ProductosStore.ts`)
- **CRUD files**: camelCase + "crud" prefix + `.ts` (e.g., `crudProductos.ts`)
- **Types**: PascalCase (e.g., `Producto`, `InsertProductoParams`)
- **Utilities**: camelCase + `.ts` (e.g., `formatCurrency.ts`)
- **Hooks**: camelCase + "use" prefix + `.tsx` (e.g., `useFormattedDate.tsx`)

## 📂 TypeScript Conventions

### Strict Mode Enabled

This project uses **TypeScript strict mode**. Always:

- ✅ Avoid `any` (use `unknown` if type is truly unknown)
- ✅ Check for `null`/`undefined` before accessing properties
- ✅ Type all function parameters and returns
- ✅ Use type guards for narrowing
- ✅ Handle optional chaining (`?.`) and nullish coalescing (`??`)

### Type Organization

```
src/types/
├── index.ts          # Re-exports all types
├── database.ts       # Database table types (Producto, Cliente, etc.)
├── crud.ts           # CRUD parameter types
├── stores.ts         # Zustand store types
└── supabase.ts       # Supabase-specific types
```

### Common Type Patterns

```typescript
// Database entities
interface Producto {
  id: number
  nombre: string
  precio_venta: number
  precio_compra: number
  stock: number
  id_empresa: number
  created_at?: string
}

// CRUD parameters
interface InsertProductoParams {
  nombre: string
  precio_venta: number
  precio_compra: number
  id_empresa: number
}

// Store types
interface ProductosStore {
  data: Producto[]
  itemSelect: Producto | null
  mostrar: (params: MostrarParams) => Promise<Producto[]>
}
```

## 🗂️ Critical Files to Know

| File Path | Purpose |
|-----------|---------|
| `src/index.ts` | Barrel export file (re-exports all modules) |
| `src/main.tsx` | App entry point, React root, providers |
| `src/App.tsx` | Root component, routing setup |
| `src/routers/routes.tsx` | Route definitions |
| `src/supabase/supabase.config.ts` | Supabase client configuration |
| `src/styles/variables.ts` | Global variables (colors, icons, spacing) |
| `src/styles/GlobalStyles.ts` | Global CSS styles |
| `src/styles/themes.ts` | Theme definitions (light/dark) |
| `src/types/index.ts` | All TypeScript type definitions |

## 🛠️ Common Tasks

### Adding a New Feature

1. **Create database table** in Supabase (if needed)
2. **Add types** in `src/types/database.ts`
3. **Create CRUD functions** in `src/supabase/crudNewFeature.ts`
4. **Create Zustand store** in `src/store/NewFeatureStore.ts`
5. **Build components** using Atomic Design pattern
6. **Add routes** in `src/routers/routes.tsx`
7. **Update exports** in `src/index.ts`

### Modifying Existing Components

1. Check if component uses Zustand store
2. Update types first if props change
3. Ensure TypeScript compilation passes (`pnpm type-check`)
4. Test in dev mode (`pnpm dev`)
5. Check responsive design on mobile

### Working with Supabase

- **RPC functions** are defined in Supabase SQL Editor
- **Row Level Security (RLS)** is enabled - users can only access their company's data (`id_empresa`)
- **Realtime subscriptions** available but not heavily used
- Use `supabase.rpc()` for complex queries
- Use `supabase.from().select()` for simple queries

## 💡 Code Style Preferences

- **No semicolons** (except where required by ASI)
- **Double quotes** for strings
- **2 spaces** for indentation
- **Named exports** over default exports
- **Functional components** only (no class components)
- **Arrow functions** for most cases
- **Spanish** for database-related names (legacy)
- **English** for UI components and new code

## ⚠️ Common Pitfalls

1. **Forgetting null checks** - Strict mode requires null handling
   ```typescript
   // ❌ Bad
   const item = items[0]
   item.name // Error if items is empty

   // ✅ Good
   const item = items[0] ?? defaultItem
   const item = items[0]
   if (!item) return null
   ```

2. **Not typing Zustand stores** - Always use `create<StoreType>`
   ```typescript
   // ❌ Bad
   const useStore = create((set) => ({ ... }))

   // ✅ Good
   const useStore = create<MyStore>((set, get) => ({ ... }))
   ```

3. **Mutating state directly** - Use Zustand's `set()` function
   ```typescript
   // ❌ Bad
   state.data.push(newItem)

   // ✅ Good
   set({ data: [...state.data, newItem] })
   ```

4. **Not handling Supabase errors** - Always check error and throw
   ```typescript
   // ❌ Bad
   const { data } = await supabase.from('table').select()

   // ✅ Good
   const { data, error } = await supabase.from('table').select()
   if (error) throw new Error(error.message)
   ```

5. **Using npm instead of pnpm** - This project uses pnpm!
   ```bash
   # ❌ Bad
   npm install
   npm run dev

   # ✅ Good
   pnpm install
   pnpm dev
   ```

## 🧪 Testing Workflow

Currently, no formal testing framework is set up. Manual testing workflow:

1. Start dev server: `pnpm dev`
2. Test feature in browser (Chrome DevTools)
3. Check console for errors
4. Test on mobile (responsive design with DevTools)
5. Test CRUD operations (create, read, update, delete)
6. Verify TypeScript types: `pnpm type-check`

## 🚀 Deployment

- Build: `pnpm build` (includes TypeScript checking)
- Output: `dist/` directory
- Hosting: Firebase Hosting (configured in `firebase.json`)
- Environment variables via `.env` file (not committed to git)

## 🤖 AI Assistant Guidelines

When helping with this codebase:

1. **Follow existing patterns** - Don't introduce new patterns without discussion
2. **Maintain type safety** - No `any` types, use strict mode
3. **Keep Spanish naming** for database/Supabase layer (legacy)
4. **Use English naming** for UI components and new features
5. **Follow Atomic Design** - Put components in correct folder
6. **Update barrel exports** - Don't forget `src/index.ts`
7. **Consider mobile** - Responsive design is critical
8. **Respect Zustand store patterns** - Don't mix with other state libraries
9. **Type everything** - Parameters, returns, props, state, events
10. **Check null/undefined** - Strict mode requires it
11. **Use pnpm** - Not npm or yarn
12. **Test before committing** - Run `pnpm type-check` and `pnpm dev`

## 📝 Recent Major Changes

- ✅ **Migrated from JavaScript to TypeScript** (strict mode) - 217 files
- ✅ **Updated from npm to pnpm** - better performance
- ✅ **Removed codigo369/ada369 branding** - now generic "Sistema de Ventas"
- ✅ **Updated all packages to latest** - React 19, Vite 7, Router 7, Zustand 5, Firebase 12
- ✅ **ESLint configured for TypeScript** - with React best practices

## 📞 Getting Help

For questions about:
- **React patterns**: Check official React 19 docs
- **TypeScript**: Check TypeScript handbook
- **Zustand**: Check Zustand docs (v5)
- **Supabase**: Check Supabase docs
- **Styled Components**: Check styled-components docs (v6)
- **This codebase**: Read this file + README.md

## 🎯 Quick Reference

### Package Manager Commands
```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm type-check       # Check TypeScript types
pnpm lint             # Lint code
```

### Important Directories
- `src/store/` - Zustand stores (30 files)
- `src/supabase/` - Database CRUD (22 files)
- `src/components/` - React components (Atomic Design)
- `src/types/` - TypeScript definitions
- `src/pages/` - Page components (19 files)

### Naming Patterns
- Components: `PascalCase.tsx`
- Stores: `NameStore.ts`
- CRUD: `crudName.ts`
- Hooks: `useName.tsx`
- Types: `PascalCase` interface/type
- Functions: `camelCase`

---

**Remember**: This is a TypeScript-strict, pnpm-based, Zustand-powered React 19 application with Supabase backend. Follow the patterns, keep types strict, and use pnpm!
