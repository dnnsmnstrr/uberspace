# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in $

## Project Overview

This is a playground server running on the Uberspace service. The "asteroid" it is run$

## Development Commands

### Running the Application
```bash
node index.js
```
The server will start on the configured port (or PORT environment variable if set).

### Restarting the Service (Uberspace)
After making changes, restart the service using supervisord:
```bash
supervisorctl restart node
```

### Installing Dependencies
```bash
npm install
```

## Architecture

### Entry Point
- `index.js` - Main application file containing the Express server setup and all routes

### API Endpoints
- `GET /` - Test endpoint
- `GET /api` - API test endpoint
- `POST /api` - Echoes back request data
- `GET /advice` - Returns delightfully questionable life advice
- `GET /docs` - Swagger API documentation (interactive UI)

### API Documentation
The `/docs` endpoint provides interactive Swagger documentation for all API endpoints.$

### Server Configuration
- Port: Configurable via PORT environment variable
- Basic Express setup with minimal middleware

## Notes

- Single file architecture - all code in index.js
- No testing framework, linting, or build process configured
- Minimal Express setup suitable for experimentation
- always restart the service after making changes
