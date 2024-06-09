---------------------------------------------------
-------------- DB CONFIG --------------------
---------------------------------------------------

--create database;  esto se crea en el docker-compose
create schema backend;

--Se crean los usuarios por microservicio, se debe asignar una clave, la clave se puede editar con el comando de mas abajo
create role backend
with
    password 'T3rR4b4se_B4ck3nD';

-- para cambiar el password del role backend 
-- ALTER ROLE backend WITH PASSWORD 'ver clave del archivo .env';
--Se permite la conexión general a postgres a los usuarios creados
alter user backend login;

--Se permite la conexion a la base de datos a los usuarios creados
grant connect on database "db_terrabase" to backend;

--Se asignan permisos sobre el respectivo esquema a los usuarios creados
grant all privileges on schema backend to backend;

---------------------------------------------------
-------------- DROP TABLES ------------------------
---------------------------------------------------

--------------------------------
--DROP: ADMIN TABLES
--------------------------------

DROP TABLE IF EXISTS backend.user CASCADE;

DROP TABLE IF EXISTS backend.user_role CASCADE;

DROP TABLE IF EXISTS backend.role_menu_permission CASCADE;

DROP TABLE IF EXISTS backend.permission CASCADE;

DROP TABLE IF EXISTS backend.role CASCADE;

DROP TABLE IF EXISTS backend.role_menu CASCADE;

DROP TABLE IF EXISTS backend.menu CASCADE;

--------------------------------
-- DROP: BUSSINESS TABLES
--------------------------------

---------------------------------------------------
-------------- TABLES: ADMIN ----------------------
---------------------------------------------------

---------------------------------------------------
-- User table
---------------------------------------------------
CREATE TABLE
    backend.user (
        id Serial NOT NULL,
        name Varchar(100) NOT NULL,
        last_name Varchar(100) NULL,
        email Varchar(100) NOT NULL unique,
        password Varchar(100) NULL,
        last_login_access timestamptz Default now () NULL,
        enabled boolean Default true NOT NULL,
        attempt Integer default 0 not null,
        mfa_code_password Varchar(6) null,
        mfa_code_login Varchar(6) null,
        created_at timestamptz Default now () NOT NULL,
        updated_at timestamptz NULL,
        deleted_at timestamptz NULL,
        created_by Integer NULL,
        updated_by Integer NULL,
        constraint pk_user primary key (id)
    );

ALTER TABLE backend.user add Constraint fk_user_created_by foreign key (created_by) references backend.user (id) ON DELETE CASCADE;

ALTER TABLE backend.user add Constraint fk_user_updated_by foreign key (updated_by) references backend.user (id) ON DELETE CASCADE;


---------------------------------------------------
-- Role table
---------------------------------------------------
CREATE TABLE
    backend.role (
        id Serial NOT NULL,
        name Varchar(100) NOT NULL,
        code Varchar(100) NOT NULL UNIQUE,
        enabled boolean Default true NOT NULL,
        created_at timestamptz Default now () NOT NULL,
        updated_at timestamptz NULL,
        deleted_at timestamptz NULL,
        created_by Integer NULL,
        updated_by Integer NULL,
        constraint pk_role primary key (id)
    );

ALTER TABLE backend.role add Constraint fk_role_user_created_by foreign key (created_by) references backend.user (id) ON DELETE CASCADE;

ALTER TABLE backend.role add Constraint fk_role_user_updated_by foreign key (updated_by) references backend.user (id) ON DELETE CASCADE;


---------------------------------------------------
-- Menu table
---------------------------------------------------
CREATE TABLE
    backend.menu (
        id Serial NOT NULL,
        title Varchar(100) NOT NULL,
        code Varchar(50) NOT NULL UNIQUE,
        "order" INTEGER NOT NULL,
        -- 01_01
        link Varchar(200),
        -- GROUP, SEPARATOR o   /tal.xhtml?cualquierparametro=123
        icon Varchar(50),
        home boolean Default false NOT NULL,
        -- este campo es para soportar el menu de angular / nebular
        "group" boolean Default false NOT NULL,
        -- este campo es para soportar el menu de angular / nebular
        enabled boolean Default true NOT NULL,
        parent INTEGER,
        CONSTRAINT fk_menu_id_menu FOREIGN KEY (parent) REFERENCES backend.menu (id),
        constraint pk_menu primary key (id)
    );


---------------------------------------------------
-- User_role table
---------------------------------------------------
CREATE TABLE
    backend.user_role (
        id Serial NOT NULL,
        user_id Integer NOT NULL,
        role_id Integer NOT NULL,
        constraint pk_user_role primary key (id)
    );

ALTER TABLE backend.user_role add Constraint fk_user_role_user foreign key (user_id) references backend.user (id) ON DELETE CASCADE;

ALTER TABLE backend.user_role add Constraint fk_user_role_role foreign key (role_id) references backend.role (id);

ALTER TABLE backend.user_role ADD CONSTRAINT unique_user_role UNIQUE (user_id, role_id);


---------------------------------------------------
-- Role_menu table
---------------------------------------------------
CREATE TABLE
    backend.role_menu (
        id Serial NOT NULL,
        role_id Integer NOT NULL,
        menu_id Integer NOT NULL,
        constraint pk_role_menu primary key (id)
    );

ALTER TABLE backend.role_menu add Constraint fk_role_menu_role foreign key (role_id) references backend.role (id);

ALTER TABLE backend.role_menu add Constraint fk_role_menu_menu foreign key (menu_id) references backend.menu (id);

ALTER TABLE backend.role_menu ADD CONSTRAINT unique_role_menu UNIQUE (role_id, menu_id);


---------------------------------------------------
-- Permission table
---------------------------------------------------
CREATE TABLE
    backend.permission (
        id Serial NOT NULL,
        name Varchar(100) NOT NULL,
        code Varchar(50) NOT NULL UNIQUE,
        enabled boolean Default true NOT NULL,
        constraint pk_permission primary key (id)
    );


---------------------------------------------------
-- Role_menu_permission table
---------------------------------------------------
CREATE TABLE
    backend.role_menu_permission (
        id Serial NOT NULL,
        role_menu_id Integer NOT NULL,
        permission_id Integer NOT NULL,
        constraint pk_role_menu_permission primary key (id)
    );

Alter TABLE backend.role_menu_permission add Constraint fk_role_menu_permission_role_menu foreign key (role_menu_id) references backend.role_menu (id);

Alter TABLE backend.role_menu_permission add Constraint fk_role_menu_permission_permission foreign key (permission_id) references backend.permission (id);

ALTER TABLE backend.role_menu_permission ADD CONSTRAINT unique_role_menu_permission UNIQUE (role_menu_id, permission_id);


---------------------------------------------------
-- Parameter table
---------------------------------------------------
CREATE TABLE
    backend.parameter (
        id Serial NOT NULL,
        key Varchar(100) NOT NULL,
        value Varchar(1000) NOT NULL,
        description Varchar(1000) NULL,
        created_at timestamptz Default now () NOT NULL,
        updated_at timestamptz NULL,
        deleted_at timestamptz NULL,
        created_by Integer NULL,
        updated_by Integer NULL,
        constraint pk_parameter primary key (id)
    );

ALTER TABLE backend.parameter add Constraint fk_parameter_user_created_by foreign key (created_by) references backend.user (id) ON DELETE CASCADE;

ALTER TABLE backend.parameter add Constraint fk_parameter_user_updated_by foreign key (updated_by) references backend.user (id) ON DELETE CASCADE;

---------------------------------------------------
-------------- TABLES: BUSINESS -------------------
---------------------------------------------------




---------------------------------------------------
-- Privileges granting
---------------------------------------------------

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA backend to backend;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA backend to backend;



---------------------------------------------------
-------------- INSERTS: ADMIN ---------------------
---------------------------------------------------

---------------------------------------------------
-- Insert: Role
---------------------------------------------------

INSERT INTO backend.role (name, code, enabled)
VALUES
    ('Support', 'ROLE_SUPPORT', true),
    ('Admin', 'ROLE_ADMIN', true);

---------------------------------------------------
-- Insert: User
---------------------------------------------------

INSERT INTO backend."user" (
    "name",
    email,
    "password",
    last_login_access,
    enabled,
    created_at,
    updated_at
) VALUES (
        'SUPPORT',
        'support@terrabase.com.co',
        '$2b$10$8WohJSgcnSmKO2GBG58qDOSSj1ZbeMnBJS0HdjEiUly8PTfxDFOWS',
        now(),
        true,
        now(),
        now()
    ),
    (
        'ADMIN',
        'admin@terrabase.com.co',
        '$2b$10$POMi2.BGGdLP50PLCSiS2ep84e3UC326QFRym269FehhQYjpQJvnO',
        now(),
        true,
        now(),
        now()
);


---------------------------------------------------
-- Insert: User-Rol
---------------------------------------------------
insert into
    backend.user_role (user_id, role_id)
values
    (
        (
            select
                id
            from
                backend.user
            where
                email = 'support@terrabase.com.co'
        ),
        (
            select
                id
            from
                backend.role
            where
                code = 'ROLE_SUPPORT'
        )
    );

insert into
    backend.user_role (user_id, role_id)
values
    (
        (
            select
                id
            from
                backend.user
            where
                email = 'admin@terrabase.com.co'
        ),
        (
            select
                id
            from
                backend.role
            where
                code = 'ROLE_ADMIN'
        )
    );


---------------------------------------------------
-- Insert: Menu
---------------------------------------------------
insert into
    backend.menu (
        title,
        code,
        "order",
        link,
        icon,
        home,
        enabled,
        parent
    )
VALUES
    (
        'Administration',
        'ADMINISTRATION',
        1,
        null,
        'Settings',
        false,
        true,
        null
    );
    
insert into
    backend.menu (
        title,
        code,
        "order",
        link,
        icon,
        home,
        enabled,
        parent
    ) VALUES
    (
        'Users',
        'USERS',
        1,
        '/administration/users',
        'Settings',
        false,
        true,
        (SELECT id FROM backend.menu WHERE code = 'ADMINISTRATION')
    ),
    (
        'Roles',
        'ROLES',
        2,
        '/administration/roles',
        'Settings',
        false,
        true,
        (SELECT id FROM backend.menu WHERE code = 'ADMINISTRATION')
    );

-------------- INSERT: role_menu ----------------------

INSERT INTO backend.role_menu (role_id, menu_id)
SELECT r.id, m.id
FROM backend.role r
JOIN backend.menu m ON 1 = 1  -- Force inclusion of all menus
WHERE r.code IN ('ROLE_SUPPORT', 'ROLE_ADMIN');


-------------- INSERT: permission ----------------------
INSERT INTO
    backend.permission (name, code, enabled)
VALUES
    ('List', 'LIST', true),
    ('Insert', 'INSERT', true),
    ('Edit', 'EDIT', true),
    ('Delete', 'DELETE', true),
    ('Export', 'EXPORT', true);

-------------- INSERT: role_menu_permissions ----------------------
-- all permissions for all the role_menu rows

INSERT INTO backend.role_menu_permission (role_menu_id, permission_id)
SELECT rm.id, p.id
FROM backend.role_menu rm
JOIN backend.permission p ON 1 = 1  -- Force inclusion of all
;


-------------- INSERT: Parameters ----------------------
INSERT INTO
    backend.parameter (key, value, description)
VALUES
    ('EMAIL_CC', 'julianrojasgeo@mayasoft.com.co', 'Email CC');


---------------------------------------------------
-------------- INSERTS: BUSSINESS -----------------
---------------------------------------------------