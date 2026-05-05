# CI/CD workflow

## Feature Description:

Each change to the codebase requires a commit and push to GitHub.
Create a Pull Request (PR) for each change, which auto-triggers the CI/CD workflow.
Once tests pass, await code review and approval, then merge the PR to the master branch.
Upon merge to master, auto build and deploy to staging environment via CI/CD.

## Implementation Options:

### GitHub Actions (Current)
- GitHub Actions workflow file `.github/workflows/ci-cd.yml` defines the pipeline
- Workflow triggered on push and pull_request events to the `master` branch
- Integrated directly in GitHub repository

### Jenkins (Recommended for Production)
- Comprehensive Jenkinsfile in repository root for declarative pipeline
- Parallel execution of independent stages
- Advanced credential management
- Multi-environment deployment support
- See `skills/features/12_jenkins_cicd_best_practices.md` for detailed implementation guide

## Test Execution:

- `backend/api/`: runs Jest via `npm test` with coverage
- `backend/workers/`: runs Jest via `npm test` with coverage  
- `frontend/`: runs Jest via `npm test` with coverage

## Build & Deploy:

- Docker build: uses `docker compose build` to build all services
- Staging deployment: runs `scripts/deploy_staging.sh` only on master merges
- Image tagging: uses commit SHA for traceability
- Registry: push to configured Docker registry

## Best Practices:

- Use parallel stages for independent tasks
- Publish coverage reports and test results
- Scan dependencies for vulnerabilities
- Implement conditional deployment gates
- Maintain separate credentials per environment
- Setup notifications (email, Slack) on build events
