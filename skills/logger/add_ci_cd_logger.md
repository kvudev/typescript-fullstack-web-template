# Add CI/CD Logger

## Date
- 2026-05-05

## Action
- Set up GitHub Actions CI/CD workflow for build, test, and staging deployment.
- Created Docker packaging support, backend/frontend package stubs, and a staging deployment helper script.

## Files created
- `.github/workflows/ci-cd.yml`
- `Dockerfile`
- `scripts/deploy_staging.sh`
- `backend/package.json`
- `backend/index.js`
- `frontend/package.json`
- `frontend/pages/index.js`

## Notes
- The pipeline installs dependencies, runs tests, builds the Docker image, and executes the staging deploy script.
- Staging deployment is configured as a placeholder and skips if `STAGING_HOST` or `STAGING_USER` are not set.
