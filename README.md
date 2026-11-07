# CueFlow AI

**Your AI Scriptwriter & Teleprompter** — a Zelven Labs project.

## Stack
- React + TypeScript + Vite (interface)
- Vercel Serverless Function (secure AI endpoint)
- Google Gemini 2.5 Flash (script generation)

## Features in this milestone
- Founder-approved dark navy/orange Script Writer UI
- Topic/idea, script length, and tone inputs
- Real Gemini-generated scripts (when API key + Vercel deployment are configured)
- Editable generated script, Copy and Clear actions
- Loading state and readable API errors

## Setup and deployment

### 1. Deploy the repository to Vercel
Import **DennisLeal/CueFlowAi** into Vercel. Vercel automatically detects Vite and the `api/generate.ts` serverless function.

### 2. Add your Gemini API key securely
In Vercel → CueFlowAi project → **Settings → Environment Variables**, add:

- Name: `GEMINI_API_KEY`
- Value: your Google AI Studio API key
- Environments: Production, Preview, and Development as needed

Save, then redeploy. **Never put this key in frontend code, GitHub, or a public file.**

Get a key from Google AI Studio: https://aistudio.google.com/app/apikey

### 3. Run locally
Install Node.js, then:
```bash
npm install
npm run dev
```
The Vite-only dev server serves the UI but not Vercel API routes. To test AI locally, install the Vercel CLI and run:
```bash
vercel dev
```
Make sure the local environment has `GEMINI_API_KEY` configured.

## Security notes
The browser calls `/api/generate`; the Gemini key is read only on the server. The API validates required input and returns provider errors without exposing the key.

## Roadmap
The teleprompter, camera recording, and video export/save workflow will follow in later founder-approved milestones.
