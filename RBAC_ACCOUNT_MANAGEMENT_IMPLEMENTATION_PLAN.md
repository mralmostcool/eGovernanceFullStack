# RBAC & Account Management — Architecture & Implementation Plan

> **Status:** Approved / In Progress (Phase 0 completed)  
> **Last Updated:** 2026-11-06  
> **Target Release:** v0.4.0 (Phases 0–5)  

---

## 1. Project Context & Stack Additions

- **Repository Stack:**
  - Backend: Spring Boot 4.1.2 (WebMVC), Java 21, Spring Data JPA, Hibernate, Flyway, PostgreSQL 17, Redis 7, MinIO S3
  - Frontend: Next.js 16.4.5, React 19.3.0, Tailwind CSS v4, TypeScript 5
- **New Architecture & Security Additions:**
  - **Architecture:** Spring Modulith 2.1.2 (modular boundaries, test-time structural verification, decoupled events)
  - **Auth Tokens:** JWT (Access Token) + Refresh Token pair via `io.jsonwebtoken:jjwt` (0.12.6)
  - **Refresh Token Store:** Redis 7 (TTL automatic expiry, blacklisting, rapid revocation, rate limiting)
  - **Password Encryption:** Spring Security `BCryptPasswordEncoder`
  - **RBAC Model:** Fine-grained permissions and system roles: `User -> UserRole -> Role -> RolePermission -> Permission`
  - **Audit Logging:** Dedicated PostgreSQL schema (`audit`) recording login activity, security lifecycle events, and entity changes
  - **CORS / CSRF:** Handled in `SecurityConfig`. CSRF disabled due to stateless token-based authentication.

---

## 2. Multi-Schema PostgreSQL Strategy

To avoid coupling between authentication/governance core and future functional modules, tables are split into dedicated schemas:

| Schema | Purpose | Tables |
|---|---|---|
| `auth` | Credentials, roles, permissions | `users`, `roles`, `permissions`, `user_roles`, `role_permissions` |
| `audit` | Activity tracking, compliance logs | `login_activity`, `auth_events`, `entity_audit_log` |
| `public` | Business domain (future) | eGovernance reports, departments, workflows, etc. |

### Configuration Requirements:
In `application.yaml`:
```yaml
spring:
  jpa:
    properties:
      hibernate:
        default_schema: public
  flyway:
    schemas: auth, audit, public
    locations: classpath:db/migration
```

JPA entities map explicitly to their schema:
```java
@Entity
@Table(name = "users", schema = "auth")
public class User { ... }

@Entity
@Table(name = "login_activity", schema = "audit")
public class LoginActivity { ... }
```

---

## 3. Database Schema & Flyway Migrations (DDL)

### Migration Files
1. `V1__create_auth_schema.sql`
2. `V2__create_audit_schema.sql`
3. `V3__seed_default_roles_permissions.sql`

### `V1__create_auth_schema.sql`
```sql
CREATE SCHEMA IF NOT EXISTS auth;

-- Users table
CREATE TABLE auth.users (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email                 VARCHAR(255) NOT NULL,
    username              VARCHAR(100) NOT NULL,
    password_hash         VARCHAR(255) NOT NULL,
    first_name            VARCHAR(100),
    last_name             VARCHAR(100),
    phone                 VARCHAR(20),
    enabled               BOOLEAN NOT NULL DEFAULT TRUE,
    account_locked        BOOLEAN NOT NULL DEFAULT FALSE,
    failed_login_attempts SMALLINT NOT NULL DEFAULT 0,
    locked_until          TIMESTAMP WITH TIME ZONE,
    password_changed_at   TIMESTAMP WITH TIME ZONE,
    last_login_at         TIMESTAMP WITH TIME ZONE,
    created_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_users_email    UNIQUE (email),
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT chk_email_format  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Roles table
CREATE TABLE auth.roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    system_role BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_roles_name UNIQUE (name)
);

-- Permissions table
CREATE TABLE auth.permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL,
    module      VARCHAR(50),
    description VARCHAR(255),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_permissions_name UNIQUE (name)
);

-- Junction: user <-> role
CREATE TABLE auth.user_roles (
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (user_id, role_id)
);

-- Junction: role <-> permission
CREATE TABLE auth.role_permissions (
    role_id       UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES auth.permissions(id) ON DELETE CASCADE,
    granted_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    PRIMARY KEY (role_id, permission_id)
);

-- Indexes
CREATE INDEX idx_users_email          ON auth.users (email);
CREATE INDEX idx_users_username       ON auth.users (username);
CREATE INDEX idx_users_enabled        ON auth.users (enabled) WHERE enabled = TRUE;
CREATE INDEX idx_user_roles_user      ON auth.user_roles (user_id);
CREATE INDEX idx_user_roles_role      ON auth.user_roles (role_id);
CREATE INDEX idx_role_permissions_role ON auth.role_permissions (role_id);
```

### `V2__create_audit_schema.sql`
```sql
CREATE SCHEMA IF NOT EXISTS audit;

-- Login attempts (success, failure, lockout)
CREATE TABLE audit.login_activity (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email_attempted VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL,
    ip_address      VARCHAR(45),
    user_agent      VARCHAR(512),
    failure_reason  VARCHAR(100),
    session_id      VARCHAR(255), -- Refresh token JTI for forensics
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_login_status CHECK (status IN ('SUCCESS', 'FAILED', 'LOCKED_OUT'))
);

-- Auth lifecycle events
CREATE TABLE audit.auth_events (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type  VARCHAR(50) NOT NULL,
    ip_address  VARCHAR(45),
    metadata    JSONB DEFAULT '{}',
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_event_type CHECK (event_type IN (
        'LOGIN', 'LOGOUT', 'REFRESH', 'PASSWORD_CHANGE',
        'ROLE_ASSIGNED', 'ROLE_REVOKED',
        'ACCOUNT_LOCKED', 'ACCOUNT_UNLOCKED',
        'ACCOUNT_DISABLED', 'ACCOUNT_ENABLED'
    ))
);

-- Generic entity change audit log
CREATE TABLE audit.entity_audit_log (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action      VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id   VARCHAR(255) NOT NULL,
    old_value   JSONB,
    new_value   JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_action CHECK (action IN ('CREATE', 'UPDATE', 'DELETE'))
);

-- Indexes
CREATE INDEX idx_login_activity_user     ON audit.login_activity (user_id);
CREATE INDEX idx_login_activity_created  ON audit.login_activity (created_at DESC);
CREATE INDEX idx_login_activity_status   ON audit.login_activity (status);
CREATE INDEX idx_auth_events_user        ON audit.auth_events (user_id);
CREATE INDEX idx_auth_events_type        ON audit.auth_events (event_type);
CREATE INDEX idx_auth_events_created     ON audit.auth_events (created_at DESC);
CREATE INDEX idx_entity_audit_entity     ON audit.entity_audit_log (entity_type, entity_id);
CREATE INDEX idx_entity_audit_actor      ON audit.entity_audit_log (actor_id);
CREATE INDEX idx_entity_audit_created    ON audit.entity_audit_log (created_at DESC);
```

### `V3__seed_default_roles_permissions.sql`
```sql
-- Seed Permissions
INSERT INTO auth.permissions (name, module, description) VALUES
    ('user:read',       'user',   'View user profiles'),
    ('user:write',      'user',   'Create and update users'),
    ('user:delete',     'user',   'Disable/delete users'),
    ('role:read',       'role',   'View roles and permissions'),
    ('role:write',      'role',   'Create and modify roles'),
    ('role:assign',     'role',   'Assign/revoke roles to users'),
    ('report:read',     'report', 'View reports'),
    ('report:create',   'report', 'Submit new reports'),
    ('report:write',    'report', 'Edit reports'),
    ('report:approve',  'report', 'Approve/reject reports'),
    ('report:delete',   'report', 'Delete reports'),
    ('audit:read',      'audit',  'View audit logs');

-- Seed Roles
INSERT INTO auth.roles (name, description, system_role) VALUES
    ('SUPER_ADMIN', 'Full system access',          TRUE),
    ('DEPT_ADMIN',  'Department administrator',     TRUE),
    ('OFFICER',     'Government officer',           TRUE),
    ('CITIZEN',     'Public citizen',               TRUE);

-- Map SUPER_ADMIN to all permissions
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r CROSS JOIN auth.permissions p WHERE r.name = 'SUPER_ADMIN';

-- Map DEPT_ADMIN
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r
JOIN auth.permissions p ON p.name IN (
    'user:read', 'user:write', 'role:read',
    'report:read', 'report:create', 'report:write', 'report:approve',
    'audit:read'
) WHERE r.name = 'DEPT_ADMIN';

-- Map OFFICER
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r
JOIN auth.permissions p ON p.name IN (
    'report:read', 'report:create', 'report:write', 'report:approve'
) WHERE r.name = 'OFFICER';

-- Map CITIZEN
INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM auth.roles r
JOIN auth.permissions p ON p.name IN (
    'report:read', 'report:create'
) WHERE r.name = 'CITIZEN';
```

---

## 4. Token & Session Management Architecture

| Token Type | Lifespan | Client Location | Server Storage | Revocation Mechanism |
|---|---|---|---|---|
| **Access Token** | 15 minutes | In-memory only (React State/Context) | **Stateless** (Validated via signature) | Short TTL; blacklist JTI in Redis upon immediate logout |
| **Refresh Token** | 7 days | `httpOnly`, `Secure`, `SameSite=Strict` Cookie | **Redis** `refresh:{jti}` | Token deleted from Redis on refresh (rotation) or logout |

### Redis Key Patterns:
- `refresh:{jti}` -> JSON `{ userId, ipAddress, userAgent, issuedAt }`, TTL 7 days.
- `blacklist:{jti}` -> `"1"`, TTL remaining access token duration.
- `rate:login:{ip}` -> Counter, TTL 15 minutes (max 10 requests).
- `rate:register:{ip}` -> Counter, TTL 1 hour (max 5 requests).

---

## 5. Spring Modulith Architecture & Package Structure

```
egov/
├── EgovApplication.java                     # Spring Boot Main
│
├── auth/                                    # MODULE: Authentication & Security
│   ├── AuthController.java                  # Public REST endpoint: /api/v1/auth
│   ├── AuthService.java                     # Public service interface
│   ├── JwtAuthenticationFilter.java         # Public filter for SecurityConfig
│   ├── dto/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── AuthResponse.java
│   │   └── RefreshTokenRequest.java
│   ├── events/                              # Events published to ApplicationEventPublisher
│   │   ├── UserRegisteredEvent.java
│   │   ├── LoginSuccessEvent.java
│   │   └── LoginFailedEvent.java
│   └── internal/                            # Hidden from other modules
│       ├── User.java                        # JPA Entity (schema = "auth")
│       ├── UserRepository.java
│       ├── JwtTokenProvider.java
│       ├── RefreshTokenService.java         # Redis operations
│       └── PasswordService.java
│
├── account/                                 # MODULE: Profile & User Accounts
│   ├── ProfileController.java              # /api/v1/profile
│   ├── AdminUserController.java            # /api/v1/admin/users
│   ├── AccountService.java
│   ├── dto/
│   │   ├── UserResponse.java
│   │   ├── CreateUserRequest.java
│   │   ├── UpdateProfileRequest.java
│   │   └── ChangePasswordRequest.java
│   ├── events/
│   │   ├── AccountLockedEvent.java
│   │   ├── AccountUnlockedEvent.java
│   │   └── PasswordChangedEvent.java
│   └── internal/
│       └── AccountQueryRepository.java
│
├── rbac/                                   # MODULE: Roles & Permissions
│   ├── RoleController.java                 # /api/v1/admin/roles
│   ├── RoleService.java
│   ├── PermissionChecker.java              # Public bean for @PreAuthorize
│   ├── dto/
│   │   ├── RoleResponse.java
│   │   └── AssignRoleRequest.java
│   ├── events/
│   │   ├── RoleAssignedEvent.java
│   │   └── RoleRevokedEvent.java
│   └── internal/
│       ├── Role.java                        # JPA Entity (schema = "auth")
│       ├── Permission.java                  # JPA Entity (schema = "auth")
│       ├── RoleRepository.java
│       └── PermissionRepository.java
│
├── audit/                                  # MODULE: Compliance & Log Stream
│   ├── AuditQueryController.java           # /api/v1/admin/audit
│   ├── AuditService.java                   # Public interface + Event Listeners
│   ├── dto/
│   │   ├── AuditEntryResponse.java
│   │   └── AuditQueryRequest.java
│   └── internal/
│       ├── LoginActivity.java              # JPA Entity (schema = "audit")
│       ├── AuthEvent.java                  # JPA Entity (schema = "audit")
│       ├── EntityAuditLog.java             # JPA Entity (schema = "audit")
│       ├── LoginActivityRepository.java
│       ├── AuthEventRepository.java
│       └── EntityAuditLogRepository.java
│
└── common/                                 # Open Shared Kernel
    ├── config/
    │   ├── SecurityConfig.java
    │   └── RedisConfig.java
    ├── error/
    │   ├── GlobalExceptionHandler.java
    │   └── ErrorResponse.java
    └── logger/
        ├── CorrelationIdFilter.java
        └── ApiEndpointLogger.java
```

---

## 6. Git Rules & Release Workflow

1. **Active Branch:** Always work on `dev`.
2. **Commit Standard:** Conventional Commits (`type(scope): description`).
   - `feat`: new features
   - `fix`: bug fixes
   - `chore`: configuration/dependencies
   - `docs`: documentation
   - `test`: testing
3. **Merging to `main`:**
   - Merge `dev -> main` only when completing a MAJOR, MINOR, or PATCH release.
4. **Changelog & Releases:**
   - Update `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
   - Tag release `vX.Y.Z` on `main`.
   - Publish GitHub Release triggering existing GitHub Actions workflows.

---

## 7. Phased Implementation Roadmap

| Phase | Description | Release Target | Current Status |
|---|---|---|---|
| **Phase 0** | Add Modulith, JJWT, Redis dependencies to `pom.xml`; add `ApplicationModulesTests` | — | **Completed** |
| **Phase 1** | Flyway migrations (`V1`, `V2`, `V3`) creating `auth` and `audit` schemas and seeding default roles | — | Pending |
| **Phase 2** | JPA Entities & Repositories inside `internal/` packages with schema annotations | — | Pending |
| **Phase 3** | Redis configuration & `RefreshTokenService` | — | Pending |
| **Phase 4** | JWT Provider, `JwtAuthenticationFilter`, updated `SecurityConfig` | — | Pending |
| **Phase 5** | `AuthController` with login, register, token refresh, logout + Event Publishing | **v0.4.0** (merge to `main`, tag, release) | Pending |
| **Phase 6** | `audit` module: event listeners persisting to `audit.login_activity` and `audit.auth_events` | **v0.5.0** (merge to `main`, tag, release) | Pending |
| **Phase 7** | `account` module: profile self-service + admin user management | **v0.6.0** (merge to `main`, tag, release) | Pending |
| **Phase 8** | `rbac` module: dynamic role & permission assignment endpoints | **v0.7.0** (merge to `main`, tag, release) | Pending |
