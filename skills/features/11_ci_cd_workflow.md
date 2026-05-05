# CI/CD workflow

## Feature Description:

Each change to the codebase requires a commit and push to GitHub.
Create a Pull Request (PR) for each change, which auto-triggers the CI/CD workflow.
Once tests pass, await code review and approval, then merge the PR to the master branch.
Upon merge to master, auto build and deploy to staging environment via CI/CD.

## Implementation: GitHub Actions (Recommended)

GitHub Actions is the primary CI/CD solution for this project:
- **Free**: Unlimited usage for public repositories
- **No maintenance**: GitHub handles infrastructure
- **Workflow file**: `.github/workflows/ci-cd.yml` in repository
- **Triggered on**: push to `master` and pull requests

## Workflow Stages:

1. **Checkout** - Clone repository code
2. **Setup** - Install Node.js 20
3. **Install Dependencies** (parallel):
   - `backend/server/`: `npm install`
   - `backend/workers/`: `npm install`
   - `frontend/`: `npm install`
4. **Test** (parallel):
   - `backend/server/`: `npm test`
   - `backend/workers/`: `npm test`
   - `frontend/`: `npm test`
5. **Build**: `docker compose build` all services
6. **Deploy** (master only): Run `scripts/deploy_staging.sh`

## GitHub Actions Features Used:

- **Parallel Jobs**: API, workers, frontend tests run simultaneously
- **Conditional Deployment**: Only deploy on master branch merges
- **Status Checks**: PR builds must pass before merging
- **Notifications**: Auto comments on PRs with build status

## Jenkins Alternative (Optional Reference)

See `skills/features/12_jenkins_cicd_best_practices.md` for enterprise Jenkins setup if needed for on-premise or complex orchestration requirements.
