---------------------------------------------------
-------------- DB CONFIG --------------------
---------------------------------------------------

create schema app;

create role app
with
    password 'T3rR4b4se_4pP';
-- ALTER ROLE app WITH PASSWORD;

alter user app login;

-- Grant permission
grant connect on database "db_terrabase" to app;
grant all privileges on schema app to app;

---------------------------------------------------
-------------- DROP TABLES ------------------------
---------------------------------------------------

--------------------------------
--DROP: ADMIN TABLES
--------------------------------

DROP TABLE IF EXISTS app.user CASCADE;

DROP TABLE IF EXISTS app.parameter CASCADE;


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
    app.user (
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

ALTER TABLE app.user add Constraint fk_user_created_by foreign key (created_by) references app.user (id) ON DELETE CASCADE;

ALTER TABLE app.user add Constraint fk_user_updated_by foreign key (updated_by) references app.user (id) ON DELETE CASCADE;

---------------------------------------------------
-- Parameter table
---------------------------------------------------
CREATE TABLE
    app.parameter (
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

ALTER TABLE app.parameter add Constraint fk_parameter_user_created_by foreign key (created_by) references app.user (id) ON DELETE CASCADE;

ALTER TABLE app.parameter add Constraint fk_parameter_user_updated_by foreign key (updated_by) references app.user (id) ON DELETE CASCADE;

---------------------------------------------------
-------------- TABLES: BUSINESS -------------------
---------------------------------------------------




---------------------------------------------------
-- Privileges granting
---------------------------------------------------

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA app to app;

GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA app to app;



---------------------------------------------------
-------------- INSERTS: ADMIN ---------------------
---------------------------------------------------

---------------------------------------------------
-- Insert: User
---------------------------------------------------


INSERT INTO app."user" (
    "name",
    email,
    "password",
    enabled,
    created_at,
    updated_at,
    role
) VALUES (
        'SUPPORT',
        'support@terrabase.com.co',
        '$2b$10$jiw3J4IEv13ZII5v4Y7A6ueeP/hG.wb2fOJNw30MWrkZmHBSHFikm',
        true,
        now(),
        now(),
        'support'
    ),
    (
        'ADMIN',
        'admin@terrabase.com.co',
        '$2b$10$jiw3J4IEv13ZII5v4Y7A6ueeP/hG.wb2fOJNw30MWrkZmHBSHFikm',
        true,
        now(),
        now(),
        'admin'
);

-------------- INSERT: Parameters ----------------------
INSERT INTO
    app.parameter (key, value, description)
VALUES
    ('EMAIL_CC', 'julianrojasgeo@mayasoft.com.co', 'Email CC');


---------------------------------------------------
-------------- INSERTS: BUSSINESS -----------------
---------------------------------------------------