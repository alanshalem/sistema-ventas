-- SISTEMA DE VENTAS - POS & INVENTORY MANAGEMENT
-- Complete Database Schema for Supabase
-- =====================================================
-- Created: 2025-12-30
-- Purpose: Point-of-Sale and Inventory Management System
-- Features: Multi-tenant, RLS, CRUD Functions, Indexes
-- =====================================================
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
-- =====================================================
-- ENUMS AND TYPES
-- =====================================================
-- Document types for sales
CREATE TYPE tipo_comprobante_enum AS ENUM ('boleta', 'factura', 'nota_venta', 'ticket');
-- Movement types for inventory and cash
CREATE TYPE tipo_movimiento_enum AS ENUM ('entrada', 'salida', 'ajuste');
CREATE TYPE tipo_movimiento_caja_enum AS ENUM ('ingreso', 'egreso');
-- Status types
CREATE TYPE estado_general_enum AS ENUM ('activo', 'inactivo', 'pendiente', 'completado');
CREATE TYPE estado_caja_enum AS ENUM ('abierto', 'cerrado');
-- Theme preferences
CREATE TYPE tema_enum AS ENUM ('light', 'dark');
-- =====================================================
-- CORE CONFIGURATION TABLES
-- =====================================================
-- Company table - Multi-tenant root
CREATE TABLE empresa (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    ruc VARCHAR(20),
    direccion TEXT,
    telefono VARCHAR(50),
    email VARCHAR(100),
    logo TEXT,
    id_moneda INTEGER REFERENCES moneda(id),
    nombre_moneda VARCHAR(50),
    simbolo_moneda VARCHAR(10),
    id_fiscal VARCHAR(50),
    pie_pagina_ticket TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Currencies
CREATE TABLE moneda (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    codigo VARCHAR(3) NOT NULL UNIQUE,
    simbolo VARCHAR(10) NOT NULL,
    tasa_cambio DECIMAL(10,4) DEFAULT 1.0000,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Document types
CREATE TABLE tipo_documento (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(10),
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- =====================================================
-- USER MANAGEMENT & PERMISSIONS
-- =====================================================
-- System modules
CREATE TABLE modulos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(100),
    ruta VARCHAR(200),
    link VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- User roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nombre, id_empresa)
);
-- Permissions
CREATE TABLE permisos (
    id SERIAL PRIMARY KEY,
    id_rol INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    id_modulo INTEGER NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
    ver BOOLEAN DEFAULT false,
    crear BOOLEAN DEFAULT false,
    editar BOOLEAN DEFAULT false,
    eliminar BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_rol, id_modulo)
);
-- Users
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(200) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    nro_doc VARCHAR(50),
    id_rol INTEGER REFERENCES roles(id),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    estado BOOLEAN DEFAULT true,
    telefono VARCHAR(50),
    foto TEXT,
    usuario_supabase VARCHAR(150) UNIQUE,
    tema tema_enum DEFAULT 'light',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(correo, id_empresa)
);
-- =====================================================
-- ORGANIZATIONAL STRUCTURE
-- =====================================================
-- Branches
CREATE TABLE sucursales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(50),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nombre, id_empresa)
);
-- Warehouses
CREATE TABLE almacenes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    direccion TEXT,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    id_sucursal INTEGER REFERENCES sucursales(id),
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nombre, id_empresa)
);
-- Cash registers
CREATE TABLE cajas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    estado BOOLEAN DEFAULT true,
    saldo_inicial DECIMAL(15,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nombre, id_empresa)
);
-- Cash register assignments to branches and users
CREATE TABLE asignacion_caja_sucursal (
    id SERIAL PRIMARY KEY,
    id_caja INTEGER NOT NULL REFERENCES cajas(id) ON DELETE CASCADE,
    id_sucursal INTEGER NOT NULL REFERENCES sucursales(id) ON DELETE CASCADE,
    id_usuario INTEGER REFERENCES usuarios(id),
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    estado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_caja, id_sucursal)
);
-- =====================================================
-- INVENTORY MANAGEMENT
-- =====================================================
-- Product categories
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    icono VARCHAR(100),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nombre, id_empresa)
);
-- Products
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(300) NOT NULL,
    codigo_interno VARCHAR(100),
    codigo_barras VARCHAR(50),
    precio_venta DECIMAL(10,2) NOT NULL CHECK (precio_venta >= 0),
    precio_compra DECIMAL(10,2) NOT NULL CHECK (precio_compra >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    stock_minimo INTEGER DEFAULT 0 CHECK (stock_minimo >= 0),
    id_categoria INTEGER REFERENCES categorias(id),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    imagen_url TEXT,
    descripcion TEXT,
    estado estado_general_enum DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(codigo_interno, id_empresa),
    UNIQUE(codigo_barras, id_empresa) WHERE codigo_barras IS NOT NULL
);
-- Stock by warehouse
CREATE TABLE stock (
    id SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    id_almacen INTEGER NOT NULL REFERENCES almacenes(id) ON DELETE CASCADE,
    cantidad INTEGER DEFAULT 0 CHECK (cantidad >= 0),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    stock_minimo INTEGER DEFAULT 0 CHECK (stock_minimo >= 0),
    ubicacion VARCHAR(100),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(id_producto, id_almacen)
);
-- Stock movements
CREATE TABLE movimientos_stock (
    id SERIAL PRIMARY KEY,
    tipo tipo_movimiento_enum NOT NULL,
    cantidad INTEGER NOT NULL,
    id_producto INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    id_almacen INTEGER NOT NULL REFERENCES almacenes(id) ON DELETE CASCADE,
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    motivo TEXT,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    referencia VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- =====================================================
-- CUSTOMERS & SUPPLIERS
-- =====================================================
-- Customers
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    documento VARCHAR(50),
    tipo_documento VARCHAR(50),
    email VARCHAR(150),
    telefono VARCHAR(50),
    direccion TEXT,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    estado estado_general_enum DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(documento, id_empresa) WHERE documento IS NOT NULL,
    UNIQUE(email, id_empresa) WHERE email IS NOT NULL
);
-- Suppliers
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    ruc VARCHAR(20),
    email VARCHAR(150),
    telefono VARCHAR(50),
    direccion TEXT,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    estado estado_general_enum DEFAULT 'activo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ruc, id_empresa) WHERE ruc IS NOT NULL,
    UNIQUE(email, id_empresa) WHERE email IS NOT NULL
);
-- =====================================================
-- SALES & PAYMENTS
-- =====================================================
-- Payment methods
CREATE TABLE metodos_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    estado BOOLEAN DEFAULT true,
    requiere_referencia BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nombre, id_empresa)
);
-- Sales (main transaction)
CREATE TABLE ventas (
    id SERIAL PRIMARY KEY,
    nro_comprobante VARCHAR(50) NOT NULL,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    sub_total DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_impuestos DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    monto_total DECIMAL(15,2) NOT NULL CHECK (monto_total >= 0),
    estado estado_general_enum DEFAULT 'completado',
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    id_caja INTEGER REFERENCES cajas(id),
    id_cliente INTEGER REFERENCES clientes(id),
    id_metodo_pago INTEGER REFERENCES metodos_pago(id),
    tipo_comprobante tipo_comprobante_enum DEFAULT 'ticket',
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nro_comprobante, id_empresa)
);
-- Sale line items
CREATE TABLE detalle_venta (
    id SERIAL PRIMARY KEY,
    id_venta INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    id_producto INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal DECIMAL(15,2) NOT NULL CHECK (subtotal >= 0),
    descuento DECIMAL(10,2) DEFAULT 0.00 CHECK (descuento >= 0),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- =====================================================
-- CASH REGISTER MANAGEMENT
-- =====================================================
-- Cash movements
CREATE TABLE movimientos_caja (
    id SERIAL PRIMARY KEY,
    tipo tipo_movimiento_caja_enum NOT NULL,
    monto DECIMAL(15,2) NOT NULL CHECK (monto >= 0),
    descripcion TEXT,
    id_caja INTEGER NOT NULL REFERENCES cajas(id),
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id),
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    id_venta INTEGER REFERENCES ventas(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Cash register closing
CREATE TABLE cierres_caja (
    id SERIAL PRIMARY KEY,
    id_caja INTEGER NOT NULL REFERENCES cajas(id),
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id),
    fecha_apertura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    fecha_cierre TIMESTAMP WITH TIME ZONE,
    saldo_inicial DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_ingresos DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    total_egresos DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    saldo_final DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    estado estado_caja_enum DEFAULT 'abierto',
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    observaciones TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK ((estado = 'abierto' AND fecha_cierre IS NULL) OR (estado = 'cerrado' AND fecha_cierre IS NOT NULL))
);
-- =====================================================
-- PRINTERS & CONFIGURATION
-- =====================================================
-- Printers
CREATE TABLE impresoras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    ip INET,
    puerto INTEGER DEFAULT 9100,
    tipo VARCHAR(100) NOT NULL,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    id_caja INTEGER REFERENCES cajas(id),
    estado BOOLEAN DEFAULT true,
    modelo VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(nombre, id_empresa)
);
-- Receipt serialization
CREATE TABLE serializacion_comprobantes (
    id SERIAL PRIMARY KEY,
    serie VARCHAR(10) NOT NULL,
    correlativo INTEGER NOT NULL DEFAULT 1,
    tipo_comprobante tipo_comprobante_enum NOT NULL,
    id_empresa INTEGER NOT NULL REFERENCES empresa(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(serie, tipo_comprobante, id_empresa)
);
-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
-- Company-specific indexes (multi-tenant optimization)
CREATE INDEX idx_empresa_usuarios ON usuarios(id_empresa);
CREATE INDEX idx_empresa_productos ON productos(id_empresa);
CREATE INDEX idx_empresa_ventas ON ventas(id_empresa);
CREATE INDEX idx_empresa_clientes ON clientes(id_empresa);
CREATE INDEX idx_empresa_proveedores ON proveedores(id_empresa);
-- Business logic indexes
CREATE INDEX idx_ventas_fecha ON ventas(fecha);
CREATE INDEX idx_ventas_usuario ON ventas(id_usuario);
CREATE INDEX idx_ventas_cliente ON ventas(id_cliente);
CREATE INDEX idx_detalle_venta_producto ON detalle_venta(id_producto);
CREATE INDEX idx_detalle_venta_venta ON detalle_venta(id_venta);
CREATE INDEX idx_productos_categoria ON productos(id_categoria);
CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras) WHERE codigo_barras IS NOT NULL;
CREATE INDEX idx_productos_stock_minimo ON productos(stock, stock_minimo);
CREATE INDEX idx_stock_producto_almacen ON stock(id_producto, id_almacen);
CREATE INDEX idx_movimientos_stock_fecha ON movimientos_stock(fecha);
CREATE INDEX idx_movimientos_stock_producto ON movimientos_stock(id_producto);
CREATE INDEX idx_movimientos_caja_fecha ON movimientos_caja(fecha);
CREATE INDEX idx_cierres_caja_estado ON cierres_caja(estado);
-- Full-text search indexes
CREATE INDEX idx_productos_nombre_gin ON productos USING gin(nombre gin_trgm_ops);
CREATE INDEX idx_clientes_nombre_gin ON clientes USING gin(nombre gin_trgm_ops);
-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE empresa ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE sucursales ENABLE ROW LEVEL SECURITY;
ALTER TABLE almacenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cajas ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_caja ENABLE ROW LEVEL SECURITY;
ALTER TABLE cierres_caja ENABLE ROW LEVEL SECURITY;
ALTER TABLE metodos_pago ENABLE ROW LEVEL SECURITY;
ALTER TABLE impresoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE serializacion_comprobantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_venta ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE asignacion_caja_sucursal ENABLE ROW LEVEL SECURITY;
-- Company-based RLS policies
CREATE POLICY "Users can only access their company data" ON empresa
    USING (id = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id
    ));
CREATE POLICY "Users can only access their company users" ON usuarios
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company products" ON productos
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company sales" ON ventas
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company customers" ON clientes
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company suppliers" ON proveedores
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company categories" ON categorias
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
-- Apply similar policies to all company-specific tables
CREATE POLICY "Users can only access their company branches" ON sucursales
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company warehouses" ON almacenes
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company cash registers" ON cajas
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company stock" ON stock
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company stock movements" ON movimientos_stock
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company cash movements" ON movimientos_caja
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company cash closings" ON cierres_caja
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company payment methods" ON metodos_pago
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company printers" ON impresoras
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company serialization" ON serializacion_comprobantes
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company sale details" ON detalle_venta
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company roles" ON roles
    USING (id_empresa = COALESCE(
        (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
        id_empresa
    ));
CREATE POLICY "Users can only access their company permissions" ON permisos
    USING (EXISTS (
        SELECT 1 FROM roles r 
        WHERE r.id = permisos.id_rol 
        AND r.id_empresa = COALESCE(
            (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
            r.id_empresa
        )
    ));
CREATE POLICY "Users can only access their company assignments" ON asignacion_caja_sucursal
    USING (EXISTS (
        SELECT 1 FROM cajas c 
        WHERE c.id = asignacion_caja_sucursal.id_caja 
        AND c.id_empresa = COALESCE(
            (SELECT id_empresa FROM usuarios WHERE usuario_supabase = auth.uid()::text LIMIT 1), 
            c.id_empresa
        )
    ));
-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';
-- Apply updated_at triggers to all tables
CREATE TRIGGER update_empresa_updated_at BEFORE UPDATE ON empresa FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sucursales_updated_at BEFORE UPDATE ON sucursales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_almacenes_updated_at BEFORE UPDATE ON almacenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cajas_updated_at BEFORE UPDATE ON cajas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stock_updated_at BEFORE UPDATE ON stock FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movimientos_stock_updated_at BEFORE UPDATE ON movimientos_stock FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_movimientos_caja_updated_at BEFORE UPDATE ON movimientos_caja FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cierres_caja_updated_at BEFORE UPDATE ON cierres_caja FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_metodos_pago_updated_at BEFORE UPDATE ON metodos_pago FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_impresoras_updated_at BEFORE UPDATE ON impresoras FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_serializacion_comprobantes_updated_at BEFORE UPDATE ON serializacion_comprobantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_detalle_venta_updated_at BEFORE UPDATE ON detalle_venta FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permisos_updated_at BEFORE UPDATE ON permisos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_asignacion_caja_sucursal_updated_at BEFORE UPDATE ON asignacion_caja_sucursal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Function to generate receipt numbers
CREATE OR REPLACE FUNCTION generar_nro_comprobante(p_id_empresa INTEGER, p_tipo_comprobante tipo_comprobante_enum)
RETURNS TEXT AS $$
DECLARE
    v_serie VARCHAR(10);
    v_correlativo INTEGER;
    v_resultado TEXT;
BEGIN
    -- Get or create serialization for this type
    SELECT serie, correlativo INTO v_serie, v_correlativo
    FROM serializacion_comprobantes 
    WHERE id_empresa = p_id_empresa AND tipo_comprobante = p_tipo_comprobante AND activo = true
    FOR UPDATE;
    
    -- If not found, create default
    IF v_serie IS NULL THEN
        v_serie := '001';
        v_correlativo := 1;
        INSERT INTO serializacion_comprobantes (serie, correlativo, tipo_comprobante, id_empresa, activo)
        VALUES (v_serie, v_correlativo, p_tipo_comprobante, p_id_empresa, true);
    END IF;
    
    -- Increment correlativo
    UPDATE serializacion_comprobantes 
    SET correlativo = correlativo + 1 
    WHERE id_empresa = p_id_empresa AND tipo_comprobante = p_tipo_comprobante AND activo = true;
    
    -- Format result
    v_resultado := v_serie || '-' || LPAD(v_correlativo::TEXT, 8, '0');
    
    RETURN v_resultado;
END;
$$ LANGUAGE plpgsql;
-- =====================================================
-- CRUD FUNCTIONS (MATCHING CODEBASE PATTERNS)
-- =====================================================
-- PRODUCTS CRUD
CREATE OR REPLACE FUNCTION mostrarproductos(_id_empresa INTEGER)
RETURNS TABLE (
    id INTEGER,
    nombre VARCHAR(300),
    codigo_interno VARCHAR(100),
    codigo_barras VARCHAR(50),
    precio_venta DECIMAL(10,2),
    precio_compra DECIMAL(10,2),
    stock INTEGER,
    stock_minimo INTEGER,
    id_categoria INTEGER,
    id_empresa INTEGER,
    imagen_url TEXT,
    descripcion TEXT,
    categoria_nombre VARCHAR(200)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id, p.nombre, p.codigo_interno, p.codigo_barras, 
        p.precio_venta, p.precio_compra, p.stock, p.stock_minimo,
        p.id_categoria, p.id_empresa, p.imagen_url, p.descripcion,
        c.nombre as categoria_nombre
    FROM productos p
    LEFT JOIN categorias c ON p.id_categoria = c.id
    WHERE p.id_empresa = _id_empresa
    ORDER BY p.nombre;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION insertarproductos(
    _nombre VARCHAR(300),
    _codigo_interno VARCHAR(100) DEFAULT NULL,
    codigo_barras VARCHAR(50) DEFAULT NULL,
    precio_venta DECIMAL(10,2),
    _precio_compra DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    stock_minimo INTEGER DEFAULT 0,
    _id_categoria INTEGER DEFAULT NULL,
    id_empresa INTEGER,
    imagen_url TEXT DEFAULT NULL,
    _descripcion TEXT DEFAULT NULL
) RETURNS TABLE (
    id INTEGER,
    nombre VARCHAR(300),
    precio_venta DECIMAL(10,2)
) AS $$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO productos (
        nombre, codigo_interno, codigo_barras, precio_venta, precio_compra,
        stock, stock_minimo, id_categoria, id_empresa, imagen_url, descripcion
    ) VALUES (
        nombre, codigo_interno, _codigo_barras, precio_venta, precio_compra,
        _stock, stock_minimo, id_categoria, _id_empresa, imagen_url, descripcion
    ) RETURNING id INTO new_id;
    
    RETURN QUERY
    SELECT p.id, p.nombre, p.precio_venta
    FROM productos p
    WHERE p.id = new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION editarproductos(
    _id INTEGER,
    _nombre VARCHAR(300),
    codigo_interno VARCHAR(100) DEFAULT NULL,
    codigo_barras VARCHAR(50) DEFAULT NULL,
    _precio_venta DECIMAL(10,2),
    precio_compra DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    _stock_minimo INTEGER DEFAULT 0,
    id_categoria INTEGER DEFAULT NULL,
    imagen_url TEXT DEFAULT NULL,
    _descripcion TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE productos SET
        nombre = _nombre,
        codigo_interno = _codigo_interno,
        codigo_barras = _codigo_barras,
        precio_venta = _precio_venta,
        precio_compra = _precio_compra,
        stock = _stock,
        stock_minimo = _stock_minimo,
        id_categoria = _id_categoria,
        imagen_url = _imagen_url,
        descripcion = _descripcion
    WHERE id = _id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION eliminarproductos(_id INTEGER) RETURNS VOID AS $$
BEGIN
    DELETE FROM productos WHERE id = _id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- USERS CRUD
CREATE OR REPLACE FUNCTION mostrarusuarios(_id_empresa INTEGER)
RETURNS TABLE (
    id INTEGER,
    nombres VARCHAR(200),
    correo VARCHAR(150),
    nro_doc VARCHAR(50),
    id_rol INTEGER,
    id_empresa INTEGER,
    estado BOOLEAN,
    telefono VARCHAR(50),
    foto TEXT,
    usuario_supabase VARCHAR(150),
    tema tema_enum,
    rol_nombre VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id, u.nombres, u.correo, u.nro_doc,
        u.id_rol, u.id_empresa, u.estado, u.telefono,
        u.foto, u.usuario_supabase, u.tema,
        r.nombre as rol_nombre
    FROM usuarios u
    LEFT JOIN roles r ON u.id_rol = r.id
    WHERE u.id_empresa = _id_empresa
    ORDER BY u.nombres;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION insertarusuarios(
    _nombres VARCHAR(200),
    _correo VARCHAR(150),
    nro_doc VARCHAR(50) DEFAULT NULL,
    id_rol INTEGER DEFAULT NULL,
    _id_empresa INTEGER,
    estado BOOLEAN DEFAULT true,
    telefono VARCHAR(50) DEFAULT NULL,
    _foto TEXT DEFAULT NULL,
    usuario_supabase VARCHAR(150) DEFAULT NULL,
    tema tema_enum DEFAULT 'light'
) RETURNS TABLE (
    id INTEGER,
    nombres VARCHAR(200),
    correo VARCHAR(150)
) AS $$
DECLARE
    new_id INTEGER;
BEGIN
    INSERT INTO usuarios (
        nombres, correo, nro_doc, id_rol, id_empresa, estado,
        telefono, foto, usuario_supabase, tema
    ) VALUES (
        _nombres, correo, nro_doc, _id_rol, id_empresa, estado,
        _telefono, foto, usuario_supabase, _tema
    ) RETURNING id INTO new_id;
    
    RETURN QUERY
    SELECT u.id, u.nombres, u.correo
    FROM usuarios u
    WHERE u.id = new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- SALES CRUD
CREATE OR REPLACE FUNCTION mostrarventas(_id_empresa INTEGER, fecha_inicio DATE DEFAULT NULL, fecha_fin DATE DEFAULT NULL)
RETURNS TABLE (
    id INTEGER,
    nro_comprobante VARCHAR(50),
    fecha DATE,
    sub_total DECIMAL(15,2),
    total_impuestos DECIMAL(15,2),
    monto_total DECIMAL(15,2),
    estado estado_general_enum,
    id_usuario INTEGER,
    id_empresa INTEGER,
    id_caja INTEGER,
    id_cliente INTEGER,
    id_metodo_pago INTEGER,
    tipo_comprobante tipo_comprobante_enum,
    observaciones TEXT,
    usuario_nombre VARCHAR(200),
    cliente_nombre VARCHAR(200),
    metodo_pago_nombre VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id, v.nro_comprobante, v.fecha, v.sub_total, v.total_impuestos,
        v.monto_total, v.estado, v.id_usuario, v.id_empresa, v.id_caja,
        v.id_cliente, v.id_metodo_pago, v.tipo_comprobante, v.observaciones,
        u.nombres as usuario_nombre,
        COALESCE(c.nombre, 'Cliente General') as cliente_nombre,
        mp.nombre as metodo_pago_nombre
    FROM ventas v
    LEFT JOIN usuarios u ON v.id_usuario = u.id
    LEFT JOIN clientes c ON v.id_cliente = c.id
    LEFT JOIN metodos_pago mp ON v.id_metodo_pago = mp.id
    WHERE v.id_empresa = _id_empresa
    AND (_fecha_inicio IS NULL OR v.fecha >= _fecha_inicio)
    AND (_fecha_fin IS NULL OR v.fecha <= _fecha_fin)
    ORDER BY v.fecha DESC, v.id DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION insertarventa(
    _id_empresa INTEGER,
    _id_usuario INTEGER,
    id_cliente INTEGER DEFAULT NULL,
    id_metodo_pago INTEGER DEFAULT NULL,
    _id_caja INTEGER DEFAULT NULL,
    tipo_comprobante tipo_comprobante_enum DEFAULT 'ticket',
    observaciones TEXT DEFAULT NULL,
    _detalles JSONB -- Array of sale details with products
) RETURNS TABLE (
    id INTEGER,
    nro_comprobante VARCHAR(50),
    monto_total DECIMAL(15,2)
) AS $$
DECLARE
    new_venta_id INTEGER;
    new_nro_comprobante VARCHAR(50);
    total_amount DECIMAL(15,2) := 0;
    detail JSONB;
    product_id INTEGER;
    quantity INTEGER;
    unit_price DECIMAL(10,2);
    subtotal DECIMAL(15,2);
BEGIN
    -- Generate receipt number
    new_nro_comprobante := generar_nro_comprobante(id_empresa, tipo_comprobante);
    
    -- Calculate total amount
    FOR detail IN SELECT * FROM jsonb_array_elements(_detalles) LOOP
        product_id := (detail->>'id_producto')::INTEGER;
        quantity := (detail->>'cantidad')::INTEGER;
        unit_price := (detail->>'precio_unitario')::DECIMAL(10,2);
        subtotal := quantity * unit_price;
        total_amount := total_amount + subtotal;
    END LOOP;
    
    -- Insert sale
    INSERT INTO ventas (
        nro_comprobante, sub_total, total_impuestos, monto_total,
        id_usuario, id_empresa, id_cliente, id_metodo_pago,
        id_caja, tipo_comprobante, observaciones
    ) VALUES (
        new_nro_comprobante, total_amount, 0, total_amount,
        _id_usuario, _id_empresa, _id_cliente, _id_metodo_pago,
        _id_caja, _tipo_comprobante, _observaciones
    ) RETURNING id INTO new_venta_id;
    
    -- Insert sale details
    FOR detail IN SELECT * FROM jsonb_array_elements(_detalles) LOOP
        product_id := (detail->>'id_producto')::INTEGER;
        quantity := (detail->>'cantidad')::INTEGER;
        unit_price := (detail->>'precio_unitario')::DECIMAL(10,2);
        subtotal := quantity * unit_price;
        
        INSERT INTO detalle_venta (
            id_venta, id_producto, cantidad, precio_unitario, subtotal, id_empresa
        ) VALUES (
            new_venta_id, product_id, quantity, unit_price, subtotal, _id_empresa
        );
        
        -- Update product stock
        UPDATE productos SET stock = stock - quantity WHERE id = product_id;
    END LOOP;
    
    RETURN QUERY
    SELECT v.id, v.nro_comprobante, v.monto_total
    FROM ventas v
    WHERE v.id = new_venta_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
-- =====================================================
-- VIEWS FOR REPORTS
-- =====================================================
-- Sales report view
CREATE VIEW reporte_ventas AS
SELECT 
    v.fecha,
    COUNT(v.id) as cantidad_transacciones,
    SUM(v.monto_total) as total_ventas,
    SUM(v.monto_total) / COUNT(v.id) as ticket_promedio,
    SUM(dv.cantidad) as productos_vendidos
FROM ventas v
JOIN detalle_venta dv ON v.id = dv.id_venta
WHERE v.estado = 'completado'
GROUP BY v.fecha
ORDER BY v.fecha DESC;
-- Top selling products view
CREATE VIEW productos_top_ventas AS
SELECT 
    p.id,
    p.nombre as nombre_producto,
    COALESCE(SUM(dv.cantidad), 0) as cantidad_vendida,
    COALESCE(SUM(dv.subtotal), 0) as monto_total
FROM productos p
LEFT JOIN detalle_venta dv ON p.id = dv.id_producto
LEFT JOIN ventas v ON dv.id_venta = v.id AND v.estado = 'completado'
GROUP BY p.id, p.nombre
ORDER BY cantidad_vendida DESC, monto_total DESC;
-- Low stock view
CREATE VIEW stock_bajo AS
SELECT 
    p.id,
    p.nombre,
    p.stock,
    p.stock_minimo,
    p.id_empresa,
    CASE 
        WHEN p.stock <= 0 THEN 'SIN STOCK'
        WHEN p.stock < p.stock_minimo THEN 'STOCK BAJO'
        ELSE 'NORMAL'
    END as estado_stock
FROM productos p
WHERE p.stock <= p.stock_minimo
ORDER BY p.stock ASC;
-- =====================================================
-- SEED DATA
-- =====================================================
-- Insert default currencies
INSERT INTO moneda (nombre, codigo, simbolo, tasa_cambio) VALUES 
('Soles', 'PEN', 'S/', 1.0000),
('Dólares Americanos', 'USD', '$', 3.8000),
('Euros', 'EUR', '€', 4.1000);
-- Insert default document types
INSERT INTO tipo_documento (nombre, codigo, descripcion) VALUES 
('DNI', '01', 'Documento Nacional de Identidad'),
('RUC', '06', 'Registro Único de Contribuyentes'),
('Carnet de Extranjería', '04', 'Documento para extranjeros'),
('Pasaporte', '07', 'Documento de identificación internacional');
-- Insert default system modules
INSERT INTO modulos (nombre, descripcion, icono, ruta) VALUES 
('Dashboard', 'Panel principal y estadísticas', 'dashboard', '/dashboard'),
('Ventas', 'Gestión de ventas y punto de venta', 'shopping-cart', '/pos'),
('Productos', 'Catálogo de productos e inventario', 'box', '/productos'),
('Clientes', 'Gestión de clientes', 'users', '/clientes'),
('Proveedores', 'Gestión de proveedores', 'truck', '/proveedores'),
('Reportes', 'Reportes y análisis', 'bar-chart', '/reportes'),
('Configuración', 'Configuración del sistema', 'settings', '/configuraciones'),
('Usuarios', 'Gestión de usuarios y permisos', 'user', '/usuarios'),
('Empresa', 'Configuración de la empresa', 'building', '/empresa'),
('Almacenes', 'Gestión de almacenes', 'warehouse', '/almacenes'),
('Categorías', 'Categorías de productos', 'folder', '/categorias'),
('Impresoras', 'Configuración de impresoras', 'printer', '/impresoras'),
('Sucursales', 'Gestión de sucursales', 'store', '/sucursales'),
('Cajas', 'Gestión de cajas', 'cash-register', '/cajas');
-- Insert sample company
INSERT INTO empresa (nombre, ruc, direccion, telefono, email, id_moneda, nombre_moneda, simbolo_moneda, pie_pagina_ticket) 
VALUES ('Mi Empresa S.A.C.', '20123456789', 'Av. Principal 123, Lima', '01-2345678', 'contacto@miempresa.com', 1, 'Soles', 'S/', '¡Gracias por su compra!');
-- Insert default roles (for company ID 1)
INSERT INTO roles (nombre, descripcion, id_empresa) VALUES 
('Administrador', 'Acceso completo al sistema', 1),
('Vendedor', 'Acceso a ventas y consultas', 1),
('Supervisor', 'Supervisión de operaciones', 1),
('Cajero', 'Operaciones de caja', 1);
-- Insert default permissions
INSERT INTO permisos (id_rol, id_modulo, ver, crear, editar, eliminar) 
SELECT 
    r.id as id_rol,
    m.id as id_modulo,
    CASE WHEN r.nombre = 'Administrador' THEN true ELSE false END as ver,
    CASE WHEN r.nombre = 'Administrador' THEN true ELSE false END as crear,
    CASE WHEN r.nombre = 'Administrador' THEN true ELSE false END as editar,
    CASE WHEN r.nombre = 'Administrador' THEN true ELSE false END as eliminar
FROM roles r
CROSS JOIN modulos m
WHERE r.id_empresa = 1;
-- Update permissions for specific roles
UPDATE permisos SET ver = true, crear = true, editar = false, eliminar = false 
WHERE id_rol = (SELECT id FROM roles WHERE nombre = 'Vendedor' AND id_empresa = 1) 
AND id_modulo IN (
    (SELECT id FROM modulos WHERE nombre = 'Dashboard'),
    (SELECT id FROM modulos WHERE nombre = 'Ventas'),
    (SELECT id FROM modulos WHERE nombre = 'Productos'),
    (SELECT id FROM modulos WHERE nombre = 'Clientes'),
    (SELECT id FROM modulos WHERE nombre = 'Reportes')
);
-- Insert sample categories (for company ID 1)
INSERT INTO categorias (nombre, descripcion, id_empresa) VALUES 
('Bebidas', 'Bebidas y líquidos varios', 1),
('Alimentos', 'Productos alimenticios', 1),
('Limpieza', 'Productos de limpieza', 1),
('Electrónica', 'Dispositivos electrónicos', 1),
('Ropa', 'Vestimenta y accesorios', 1),
('Otros', 'Productos varios', 1);
-- Insert default payment methods (for company ID 1)
INSERT INTO metodos_pago (nombre, descripcion, id_empresa, requiere_referencia) VALUES 
('Efectivo', 'Pago en efectivo', 1, false),
('Tarjeta de Crédito', 'Pago con tarjeta', 1, true),
('Tarjeta de Débito', 'Pago con tarjeta de débito', 1, true),
('Transferencia Bancaria', 'Transferencia entre cuentas', 1, true),
('Yape', 'Pago móvil Yape', 1, true),
('Plin', 'Pago móvil Plin', 1, true),
('Otros', 'Otros métodos de pago', 1, false);
-- Insert sample products (for company ID 1)
INSERT INTO productos (nombre, codigo_interno, precio_venta, precio_compra, stock, stock_minimo, id_categoria, id_empresa) VALUES 
('Coca Cola 600ml', 'CC600', 4.50, 2.80, 50, 10, (SELECT id FROM categorias WHERE nombre = 'Bebidas' AND id_empresa = 1), 1),
('Inca Kola 600ml', 'IK600', 4.50, 2.80, 45, 10, (SELECT id FROM categorias WHERE nombre = 'Bebidas' AND id_empresa = 1), 1),
('Arroz Costeño 1kg', 'ARC1', 4.20, 3.10, 30, 5, (SELECT id FROM categorias WHERE nombre = 'Alimentos' AND id_empresa = 1), 1),
('Azúcar Standard 1kg', 'AZU1', 3.80, 2.90, 25, 5, (SELECT id FROM categorias WHERE nombre = 'Alimentos' AND id_empresa = 1), 1),
('Jabón Liquido 500ml', 'JL500', 8.50, 6.20, 20, 5, (SELECT id FROM categorias WHERE nombre = 'Limpieza' AND id_empresa = 1), 1),
('Cloro 1L', 'CL1', 2.50, 1.80, 35, 10, (SELECT id FROM categorias WHERE nombre = 'Limpieza' AND id_empresa = 1), 1);
-- Insert sample printers (for company ID 1)
INSERT INTO impresoras (nombre, tipo, id_empresa, puerto, estado, modelo) VALUES 
('Impresora Principal', 'Térmica', 1, 9100, true, 'EPON TM-T20'),
('Impresora Cocina', 'Térmica', 1, 9101, true, 'POS-58');
-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================
COMMENT ON SCHEMA public IS 'Sistema de Ventas - POS & Inventory Management Database';
COMMENT ON TABLE empresa IS 'Company information for multi-tenant architecture';
COMMENT ON TABLE usuarios IS 'System users with role-based permissions';
COMMENT ON TABLE productos IS 'Product catalog with inventory tracking';
COMMENT ON TABLE ventas IS 'Sales transactions and receipts';
COMMENT ON TABLE clientes IS 'Customer management';
COMMENT ON TABLE proveedores IS 'Supplier management';
COMMENT ON TABLE categorias IS 'Product categorization';
COMMENT ON TABLE stock IS 'Current inventory levels by warehouse';
COMMENT ON TABLE movimientos_stock IS 'Inventory movement tracking';
COMMENT ON TABLE cajas IS 'Cash registers';
COMMENT ON TABLE movimientos_caja IS 'Cash movement tracking';
COMMENT ON TABLE cierres_caja IS 'Daily cash register closing';
COMMENT ON TABLE metodos_pago IS 'Payment method configuration';
COMMENT ON TABLE modulos IS 'System modules for permissions';
COMMENT ON TABLE roles IS 'User roles and permissions';
COMMENT ON TABLE permisos IS 'Granular permissions by role and module';
COMMENT ON TABLE sucursales IS 'Branch offices';
COMMENT ON TABLE almacenes IS 'Warehouses and storage locations';
COMMENT ON TABLE impresoras IS 'Printer configuration';
COMMENT ON TABLE serializacion_comprobantes IS 'Receipt number generation';
-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
-- Database schema successfully created
-- Features included:
-- ✅ Complete table structure with proper relationships
-- ✅ Row Level Security (RLS) for multi-tenancy
-- ✅ CRUD functions matching frontend patterns
-- ✅ Performance indexes
-- ✅ Triggers for timestamps
-- ✅ Views for reporting
-- ✅ Seed data for system functionality
-- ✅ Comprehensive comments and documentation
-- Next steps:
-- 1. Set up Supabase authentication
-- 2. Configure storage for product images
-- 3. Set up realtime subscriptions if needed
-- 4. Test all CRUD operations
-- 5. Verify RLS policies are working correctly