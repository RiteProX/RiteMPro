# Ritem Pro — polished starter

This repository contains a modern, mobile-friendly full-stack starter for RitemPro built with React + Express and designed to deploy to Render.com.

Quick start (local development):

1. copy .env.example to .env and set values
2. npm install
3. npm run dev

Server runs with tsx (TypeScript runtime). The server exposes simple API endpoints for auth and payments (Paystack stub) and serves the frontend in production.

Deploy notes for Render:
- Set environment variables from .env
- Build command: npm install && npm run build
- Start command: npm start
- Ensure Puppeteer/Chromium is supported in the chosen plan

