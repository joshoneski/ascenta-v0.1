# LLM Development Guidelines & Safety Procedures

## Table of Contents
- [Overview](#overview)
- [Defensive Development Strategy](#defensive-development-strategy)
- [Pre-Development Checklist](#pre-development-checklist)
- [Development Workflow](#development-workflow)
- [Safety Checkpoints](#safety-checkpoints)
- [Documentation Maintenance](#documentation-maintenance)
- [Error Recovery Procedures](#error-recovery-procedures)
- [Code Quality Standards](#code-quality-standards)

## Overview

This document provides safety guidelines for LLM-based development on the Little Phil Ignite platform. The primary goal is to **prevent code breakage** while maintaining development velocity through a defensive, checkpoint-based approach.

### Core Safety Principles
- **Never trust, always verify**: Test every change immediately
- **Atomic commits**: Each commit must be a complete, working change
- **Frequent checkpoints**: Create save points before any significant work
- **Documentation synchronization**: Keep docs current with code changes
- **Fail-safe approach**: Prefer working code over optimal code

## Defensive Development Strategy

### The Checkpoint System
Use a three-tier safety approach:

1. **Green State Checkpoints** - Verified working states
2. **Atomic Work Units** - Single-purpose changes with tests
3. **Immediate Rollback** - Quick recovery from any breakage

### Branch Strategy for LLM Development
```bash
# Create feature branch from known-good state
git checkout -b llm/feature-name

# Work in small atomic commits
git add . && git commit -m "feat: atomic change description"

# Test after EVERY commit
npm run test && npm run check-types && npm run lint

# Push frequently for backup
git push origin llm/feature-name
```

## Pre-Development Checklist

Before starting ANY development work, the LLM MUST:

### ✅ Environment Verification
- [ ] All environment variables configured (see [docs/environment-setup.md](docs/environment-setup.md))
- [ ] Development server starts successfully (`npm run dev`)
- [ ] Database connection working (`npm run db:migrate`)
- [ ] All tests passing (`npm run test`)
- [ ] TypeScript compilation clean (`npm run check-types`)
- [ ] Linting passes (`npm run lint`)

### ✅ Documentation Review
- [ ] Read [README.md](../README.md) for project overview
- [ ] Review [docs/development-workflows.md](docs/development-workflows.md) for coding standards
- [ ] Check [docs/api.md](docs/api.md) for API patterns
- [ ] Understand [docs/database.md](docs/database.md) for data model
- [ ] Review [docs/security.md](docs/security.md) for security requirements
- [ ] Check [docs/troubleshooting.md](docs/troubleshooting.md) for common issues

### ✅ Code Analysis
- [ ] Analyze the specific files to be modified
- [ ] Understand the business logic context
- [ ] Identify all dependencies and relationships
- [ ] Plan the change in small, atomic steps

## Development Workflow

### Phase 1: Analysis & Planning
```markdown
1. **Read Task Requirements**
   - Understand the exact requirements
   - Identify affected systems and files
   - Plan the approach in small steps

2. **Create Checkpoint**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b llm/task-name
   git push -u origin llm/task-name
   ```

3. **Document the Plan**
   - Create or update relevant documentation
   - Commit documentation changes first
   ```bash
   git add docs/
   git commit -m "docs: update for upcoming changes"
   ```
```

### Phase 2: Atomic Development
```markdown
1. **Single Change Implementation**
   - Make ONE focused change
   - Ensure change is complete and self-contained
   - Follow established patterns from existing code

2. **Immediate Testing**
   ```bash
   # After EVERY change, run:
   npm run test           # Unit tests
   npm run check-types    # TypeScript
   npm run lint          # Code style
   npm run dev           # Verify app starts
   ```

3. **Atomic Commit**
   ```bash
   git add .
   git commit -m "type: specific description of working change"
   git push origin llm/task-name
   ```

4. **Verification Checkpoint**
   - Manually test affected functionality
   - Check browser console for errors
   - Verify database operations work
   - Confirm API endpoints respond correctly
```

### Phase 3: Integration & Documentation
```markdown
1. **Integration Testing**
   - Test the complete feature end-to-end
   - Verify no regressions in existing functionality
   - Check multi-tenant data isolation

2. **Documentation Updates**
   - Update API documentation if endpoints changed
   - Update database schema docs if models changed
   - Update troubleshooting docs if new issues possible
   - Update security docs if permissions changed

3. **Final Verification**
   ```bash
   npm run build         # Production build test
   npm run test          # Full test suite
   ```
```

## Safety Checkpoints

### Before Starting Any Task
1. **Create Baseline Checkpoint**
   ```bash
   git checkout main && git pull origin main
   git checkout -b llm/safe-checkpoint-$(date +%Y%m%d-%H%M)
   git push -u origin llm/safe-checkpoint-$(date +%Y%m%d-%H%M)
   ```

2. **Verify Green State**
   - All tests pass
   - App runs without errors
   - Database migrations current

### After Each Atomic Change
1. **Run Full Test Suite**
   ```bash
   npm run test && npm run check-types && npm run lint
   ```

2. **Manual Verification**
   - Test affected functionality in browser
   - Check network requests in dev tools
   - Verify database queries work

3. **Commit Immediately**
   ```bash
   git add . && git commit -m "verified working change"
   ```

### Before Major Changes
1. **Create Recovery Point**
   ```bash
   git tag "before-major-change-$(date +%Y%m%d-%H%M)"
   git push origin --tags
   ```

2. **Document Rollback Plan**
   - Note exactly what will be changed
   - Identify rollback steps
   - List affected files and functions

## Documentation Maintenance

### Synchronization Requirements
The LLM MUST update documentation when making these changes:

#### API Changes
- **File**: [docs/api.md](docs/api.md)
- **When**: Adding/modifying/removing endpoints
- **What**: Request/response examples, error codes, authentication

#### Database Changes
- **File**: [docs/database.md](docs/database.md)
- **When**: Schema changes, new tables, relationship changes
- **What**: Table structures, relationships, migration notes

#### Security Changes
- **File**: [docs/security.md](docs/security.md)
- **When**: Authentication, authorization, data handling changes
- **What**: Security implications, new threats, mitigation strategies

#### New Features
- **File**: [README.md](../README.md)
- **When**: Major feature additions
- **What**: Feature overview, usage examples

#### Development Process Changes
- **File**: [docs/development-workflows.md](docs/development-workflows.md)
- **When**: New tools, processes, or standards
- **What**: Updated procedures, new conventions

### Documentation Update Process
1. **Before Code Changes**: Update docs to reflect planned changes
2. **During Development**: Keep docs in sync with implementation
3. **After Completion**: Verify docs accurately reflect final state

## Error Recovery Procedures

### When Tests Fail
```bash
# 1. Don't panic - this is expected
echo "Tests failed - analyzing..."

# 2. Check what broke
npm run test -- --verbose

# 3. Fix the immediate issue
# Make minimal fix to restore green state

# 4. If can't fix immediately, rollback
git reset --hard HEAD~1

# 5. Re-approach with smaller change
```

### When App Won't Start
```bash
# 1. Check for syntax errors
npm run check-types

# 2. Check for missing dependencies
npm install

# 3. Check environment variables
cp .env.example .env.local

# 4. If still broken, rollback
git reset --hard HEAD~1

# 5. Start over with smaller change
```

### When Database Issues Occur
```bash
# 1. Check migration status
npm run db:migrate

# 2. Check database connection
# Verify POSTGRES_URL in .env.local

# 3. If data corruption suspected
git reset --hard HEAD~1
npm run db:migrate

# 4. Report issue and get help
```

### Nuclear Option - Complete Rollback
```bash
# If everything is broken and unsalvageable:
git checkout main
git reset --hard origin/main
git clean -fd
npm install
npm run db:migrate
npm run dev

# Start over with better planning
```

## Code Quality Standards

### Before Every Commit
- [ ] Code follows TypeScript strict mode
- [ ] All imports use ES module syntax
- [ ] Interfaces defined for all API contracts
- [ ] Zod schemas for request validation
- [ ] Organization ownership checks for data access
- [ ] Error handling implemented
- [ ] Console.log statements removed
- [ ] Comments explain complex business logic

### Architecture Compliance
- [ ] Follows clean architecture patterns
- [ ] Domain logic separated from infrastructure
- [ ] Multi-tenant data isolation maintained
- [ ] Security best practices followed
- [ ] Performance considerations addressed

### Testing Requirements
- [ ] Unit tests for new functions
- [ ] Integration tests for API endpoints
- [ ] Error case testing
- [ ] Edge case validation
- [ ] Database transaction testing

This defensive approach prioritizes **code safety over development speed**, ensuring that the Little Phil Ignite platform remains stable and functional throughout LLM-assisted development.