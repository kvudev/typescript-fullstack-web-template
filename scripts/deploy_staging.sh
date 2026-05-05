#!/usr/bin/env bash
set -e

if [ -z "$STAGING_HOST" ] || [ -z "$STAGING_USER" ]; then
  echo "STAGING_HOST or STAGING_USER is not defined. Skipping staging deployment."
  exit 0
fi

echo "Deploying Docker image news_summarizer:ci to staging host $STAGING_USER@$STAGING_HOST"
# Example deployment command:
# ssh "$STAGING_USER@$STAGING_HOST" "docker pull news_summarizer:ci && docker run -d --name news_summarizer -p 3000:3000 news_summarizer:ci"
