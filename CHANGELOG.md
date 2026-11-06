# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-06

### Added
- **Frontend Dashboard**:
  - `Sidebar` component with active navigation sections and quick actions.
  - `LiveAgentMonitoring` component with real-time process indicators, filtering, and status badges.
  - `RiskHeatmap` component featuring interactive weekly cell hover inspection and risk scoring.
  - `PerformanceMetrics` stepped timeline SVG visualization for memory/CPU resource tracking.
  - `IncidentFeed` component detailing event logs with severity spectrum bars and statistics.
  - `AuditLog` component displaying system administrator timeline events.
- **Custom Theme & Typography**:
  - Integrated custom color palette: Hunter Green (`#386641`), Sage Green (`#6a994e`), Yellow Green (`#a7c957`), Vanilla Cream (`#f2e8cf`), Blushed Brick (`#bc4749`).
  - Integrated Geist font typography globally.
- **Infrastructure & Containerization**:
  - Docker Compose service definition with MinIO (`pgsty/silo`), PostgreSQL, Redis, and Next.js frontend container.
  - Multi-stage Dockerfile for Next.js frontend image builds.
- **CI/CD Automation**:
  - GitHub Actions CI workflow for frontend linting, tests, and Docker builds.
  - GitHub Actions Publish workflow for container image releases to GitHub Container Registry (`ghcr.io`).
  - GitHub Actions Release workflow with automated changelog and tag handling.
