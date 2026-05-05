# Cron job to fetch latest video from YouTube every 5 minutes


## Feature Description:
Implement a cron job in the backend that runs every 5 minutes to fetch the latest video from YouTube using the YouTube API. The cron job will check for new videos and if a new video is found, it will trigger the content generation process using Gemini and store the information in the database to avoid processing the same video multiple times. The cron job will be implemented using the node-cron framework and will be added to the `cron_jobs/` folder in the backend directory.

cron_job save into backend/cron_jobs/feature_cron_job_name/index.js
replace feature_cron_job_name with a descriptive name for the cron job, such as `fetch_latest_video`.
framework: node-cron

## File structure:
backend folder now split into 2 subfolders:
- cron_jobs/: for cron job code
- api/: for API code and other backend logic
- database/: for database related code and scripts

# CI/CD

- Separate Dockerfile for server and cron job, and add them to docker-compose.yml


