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

-- Insert Permission Tree (Directories, Menus, Hidden Menus, Buttons)
-- Level 1 Directory (type=1)
INSERT INTO permissions (id, name, type, parent_id, path, sort_order) VALUES 
(1, 'System Management', 1, 0, '/system', 1);

-- Level 2 Menus (type=2)
INSERT INTO permissions (id, name, type, parent_id, path, component, sort_order, is_visible) VALUES 
(2, 'User Management', 2, 1, '/system/user', 'system/user/index', 1, 1),
(3, 'Role Management', 2, 1, '/system/role', 'system/role/index', 2, 1),
(4, 'System Logs', 2, 1, '/system/log', 'system/log/index', 3, 1),
-- Profile page: accessible but hidden from sidebar
(5, 'Profile', 2, 0, '/profile', 'system/profile/index', 99, 0);

-- Buttons / Action Permissions (type=3)
INSERT INTO permissions (id, name, type, parent_id, permission_code) VALUES 
(10, 'Create User', 3, 2, 'sys:user:add'),
(11, 'Delete User', 3, 2, 'sys:user:delete'),
(12, 'View Log Detail', 3, 4, 'sys:log:detail');

-- Insert Users (Password: 123456)
INSERT INTO users (id, username, password, nickname) VALUES 
(1, 'admin', '$2a$10$76DxL0zNV2F.kP9mQ.Fp8uO5v/iI2yH.fBkJxYgP5O3rNnF2n6k6', 'Administrator'),
(2, 'test_user', '$2a$10$76DxL0zNV2F.kP9mQ.Fp8uO5v/iI2yH.fBkJxYgP5O3rNnF2n6k6', 'Test User');

-- Assign Roles
INSERT INTO user_roles (user_id, role_id) VALUES (1, 1), (2, 2);

-- Assign Permissions
-- Super Admin gets everything (1,2,3,4,5,10,11,12)
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 10), (1, 11), (1, 12);

-- Regular User gets System Logs and Profile Only (1,4,5,12)
INSERT INTO role_permissions (role_id, permission_id) VALUES 
(2, 1), (2, 4), (2, 5), (2, 12);
