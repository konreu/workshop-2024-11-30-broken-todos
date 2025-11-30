#!/bin/bash
set -e

# node
npm install

# playwright - install browsers and system dependencies for E2E testing
# This ensures Chromium is ready to use for `npm run test:e2e`
if npm ls @playwright/test &>/dev/null; then
  echo "Installing Playwright browsers and dependencies..."
  npx playwright install --with-deps chromium
fi

# spec-kit
curl -LsSf https://astral.sh/uv/install.sh | sh
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
