#!/usr/bin/env bash
# exit on error
set -o errexit

# Install dependencies
npm install

# Set production environment
export NODE_ENV=production

# Build the application
npm run build 