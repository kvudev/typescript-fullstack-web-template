# Jenkins CI/CD Pipeline - Best Practices

## Overview
Setup a production-grade CI/CD pipeline using Jenkins that implements industry best practices for automated testing, building, and deployment.

## Core Requirements

### 1. Pipeline Architecture
- **Declarative Pipeline** (Jenkinsfile in repository root)
- **Stage-based execution** for clear visibility
- **Parallel stages** where independent tasks can run concurrently
- **Environment variables** for credentials and configuration
- **Build parameters** for flexibility (e.g., deploy target, skip tests)

### 2. Source Control Integration
- Trigger on push to `master` and `develop` branches
- Support pull request builds with automatic PR status updates
- Checkout with shallow clone for performance (depth: 1)
- Git commit SHA and branch name tracking

### 3. Multi-Service Architecture Support
- Parallel dependency installation for API, workers, frontend
- Independent test execution per service
- Service-specific coverage reports
- Modular build steps

### 4. Testing Strategy

#### Unit Tests
- Run Jest in each service directory with coverage
- Fail build on test failures
- Publish coverage reports as HTML artifacts
- Set coverage thresholds (e.g., 70% minimum)

#### Integration Tests
- Test API endpoints with actual database
- Mock external services (Gemini API, YouTube API)
- Run after unit tests pass

#### Linting & Code Quality
- Run ESLint/Prettier on code changes
- SonarQube integration for code quality metrics
- Fail on critical issues

### 5. Docker Build & Registry
- Build Docker images only on `master`, `develop`, and PRs
- Tag images with commit SHA for traceability
- Tag `latest` for main branches
- Push to private Docker registry (with credentials)
- Scan images for vulnerabilities before pushing
- Use `.dockerignore` to exclude unnecessary files

### 6. Artifact Management
- Publish test coverage reports (HTML format)
- Archive logs and reports
- Retain build artifacts based on branch:
  - `master`: 30 days
  - `develop`: 14 days
  - feature branches: 7 days
- Clean workspace after each build

### 7. Environment & Credentials
- Store secrets in Jenkins Credential Store (never hardcoded)
- Use credential bindings for sensitive data
- Separate credentials for dev, staging, production
- Rotate credentials regularly
- Environment-specific .env files

### 8. Deployment Strategy

#### Staging Deployment
- Deploy automatically on successful master builds
- Use blue-green deployment for zero downtime
- Health checks after deployment
- Automatic rollback on health check failure

#### Production Deployment
- Manual approval gate (require review)
- Deploy only from tagged releases
- Canary deployment (5% traffic initial)
- Monitor for 10 minutes before full rollout
- Keep previous version for quick rollback

### 9. Notifications & Monitoring
- Email notifications on build success/failure
- Slack integration for real-time alerts
- Build status badges in repository
- Performance metrics dashboard
- Build time trending

### 10. Security Best Practices
- Run builds in isolated containers
- Never log credentials or secrets
- Scan dependencies for vulnerabilities (`npm audit`)
- Use signed commits for production deployments
- Restrict build triggering to authorized users
- Regular security audits of pipeline

## Jenkinsfile Structure

```groovy
pipeline {
    agent any
    
    options {
        // Set build timeout
        timeout(time: 1, unit: 'HOURS')
        // Preserve timestamps in console logs
        timestamps()
        // Keep last N builds and discard old ones
        buildDiscarder(logRotator(numToKeepStr: '10', daysToKeepStr: '30'))
    }
    
    environment {
        // Define environment variables
        NODE_VERSION = '20'
        DOCKER_REGISTRY = credentials('docker-registry-url')
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout code from repository
            }
        }
        
        stage('Install Dependencies') {
            parallel {
                // Parallel installation for multiple services
            }
        }
        
        stage('Test') {
            parallel {
                // Parallel testing for multiple services
            }
        }
        
        stage('Build') {
            steps {
                // Build Docker images
            }
        }
        
        stage('Deploy') {
            when {
                // Conditional deployment based on branch
            }
            steps {
                // Execute deployment
            }
        }
    }
    
    post {
        // Cleanup and notifications
    }
}
```

## Implementation Checklist

- [ ] Create Jenkinsfile in repository root
- [ ] Configure Jenkins server with Node.js and Docker
- [ ] Install Jenkins plugins:
  - Pipeline
  - Git
  - Email Extension
  - Slack Notification
  - HTML Publisher
  - Docker Pipeline
  - SonarQube Scanner
- [ ] Setup credentials in Jenkins:
  - Docker registry credentials
  - SSH keys for deployment
  - Email configuration
  - Slack webhook
  - SonarQube token
- [ ] Create Jenkins job pointing to repository
- [ ] Configure webhooks in GitHub for automatic triggers
- [ ] Setup email/Slack notifications
- [ ] Create separate pipelines for staging/production
- [ ] Document deployment procedures
- [ ] Setup monitoring dashboards

## Branch Strategy

| Branch | Trigger | Test | Build | Deploy |
|--------|---------|------|-------|--------|
| `master` | Automatic | Full | Yes | Staging (auto) |
| `develop` | Automatic | Full | Yes | Dev (manual) |
| `feature/*` | PR | Full | Optional | None |
| `release/*` | Manual | Full | Yes | Staging (manual) |
| `hotfix/*` | Manual | Full | Yes | Staging (manual) |

## Performance Optimization

- Use `npm ci` instead of `npm install` for consistency
- Cache npm dependencies between builds
- Use Docker layer caching for image builds
- Run tests in parallel where possible
- Skip non-essential stages for certain branches
- Use shallow clone (depth: 1) for git operations

## Rollback Strategy

- Keep last 3 successful production releases
- Store deployment manifests in artifact repository
- Document rollback procedures
- Test rollback procedures regularly
- Alert on-call team for rollbacks

## Monitoring & Alerts

- Track pipeline execution time
- Monitor stage failures by type
- Alert on repeated failures
- Dashboard with build success rate
- Track deployment frequency and lead time
- Monitor production health post-deployment
