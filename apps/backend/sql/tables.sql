-- Database: node_admin (PostgreSQL)
CREATE DATABASE node_admin;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nickname VARCHAR(50),
    email VARCHAR(100),
    avatar VARCHAR(255),
    status SMALLINT DEFAULT 1, -- 1: Enabled, 0: Disabled
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL,
    role_code VARCHAR(50) NOT NULL UNIQUE, -- e.g., SUPER_ADMIN
    description VARCHAR(255),
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Permissions Table (Unified Management of Menus and Action Permissions)
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,           -- e.g., User Management, Delete User
    type SMALLINT NOT NULL,             -- 1: Directory, 2: Menu, 3: Button/Action
    parent_id INT DEFAULT 0,            -- ID of the parent permission
    
    -- Navigation related (for type 1 or 2)
    path VARCHAR(255),                  -- Route path / URL
    component VARCHAR(255),             -- Component source path
    sort_order INT DEFAULT 0,           -- Display order
    is_visible SMALLINT DEFAULT 1,      -- Whether to show in sidebar: 1: Show, 0: Hide
    
    -- Action related (for type 3)
    permission_code VARCHAR(50),        -- Permission Identifier (e.g., sys:user:delete)
    
    status SMALLINT DEFAULT 1,          -- Status of the resource itself
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. User-Role Junction Table
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 5. Role-Permission Junction Table
CREATE TABLE role_permissions (
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

---------------------------------------------------------
-- Initial Seed Data
---------------------------------------------------------

-- Insert Roles
INSERT INTO roles (id, role_name, role_code) VALUES 
(1, 'Super Admin', 'SUPER_ADMIN'),
(2, 'Regular User', 'USER');

-- Insert Permission Tree (Directories, Menus, Buttons)
-- Root Menus & Directories
INSERT INTO permissions (id, name, type, parent_id, path, component, sort_order, is_visible) VALUES 
(1, '控制台', 2, 0, '/', 'dashboard/index', 0, 1),
(2, '系统管理', 1, 0, '/system', NULL, 1, 1);

-- Level 2 Menus (type=2)
INSERT INTO permissions (id, name, type, parent_id, path, component, sort_order, is_visible) VALUES 
(3, '菜单管理', 2, 2, '/system/menu', 'system/menu/index', 1, 1),
(4, '角色管理', 2, 2, '/system/role', 'system/role/index', 2, 1),
(5, '用户管理', 2, 2, '/system/user', 'system/user/index', 3, 1),
(6, '权限管理', 2, 2, '/system/permission', 'system/permission/index', 4, 1);

-- Buttons / Action Permissions (type=3)
INSERT INTO permissions (id, name, type, parent_id, permission_code) VALUES 
(10, '新增菜单', 3, 3, 'sys:menu:add'),
(11, '编辑菜单', 3, 3, 'sys:menu:edit'),
(12, '删除菜单', 3, 3, 'sys:menu:delete'),
(13, '新增角色', 3, 4, 'sys:role:add'),
(14, '编辑角色', 3, 4, 'sys:role:edit'),
(15, '禁用角色', 3, 4, 'sys:role:disable'),
(16, '新增用户', 3, 5, 'sys:user:add'),
(17, '编辑用户', 3, 5, 'sys:user:edit'),
(18, '禁用用户', 3, 5, 'sys:user:disable'),
(19, '新增权限', 3, 6, 'sys:permission:add'),
(20, '编辑权限', 3, 6, 'sys:permission:edit'),
(21, '删除权限', 3, 6, 'sys:permission:delete'),
(22, '角色授权', 3, 6, 'sys:permission:assign');

-- Insert Users (Password: 123456)
INSERT INTO users (id, username, password, nickname) VALUES 
(1, 'admin', '$2a$10$76DxL0zNV2F.kP9mQ.Fp8uO5v/iI2yH.fBkJxYgP5O3rNnF2n6k6', 'Administrator'),
(2, 'test_user', '$2a$10$76DxL0zNV2F.kP9mQ.Fp8uO5v/iI2yH.fBkJxYgP5O3rNnF2n6k6', 'Test User');

-- Assign Roles
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1), (2, 2);

-- Assign Permissions
-- Super Admin gets everything
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(1, 10), (1, 11), (1, 12), (1, 13), (1, 14), (1, 15),
(1, 16), (1, 17), (1, 18), (1, 19), (1, 20), (1, 21), (1, 22);

-- Regular User gets dashboard + user management menus
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(2, 1), (2, 2), (2, 5), (2, 16), (2, 17);
