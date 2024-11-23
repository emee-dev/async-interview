## Introduction

Async interview is an AI interview application, built to facilite easy and efficient interviews. Given the current needs of the job market employers seeking for the best candidates and job seekers searching for suitable jobs that fit that skill levels, this application addresses issues such as lack of feedback after interview, efficient way to simply extract some key insights from the interview without breaking bank and wasting time. The application makes use of AssemblyAI powerful LLM powered speech to text to generate transcripts, post interview reports. This is very powerful because now job seekers are able to get some sort of feedback on potential strengths and weaknesses thanks to the resilient nature of the application thanks to background jobs resulting in an improvement on their overall chances in the job hunt. It is very fault tolerant, with a focus on user experience.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

The following variables are necessary to be able to properly test and deploy the application. Please copy `.env.example` to `.env.local` into the root folder and backend folder.

```sh
    # Superviz
    NEXT_PUBLIC_SUPERVIZ_DEVELOPER_TOKEN=""
    SUPERVIZ_CLIENT_ID=""
    SUPERVIZ_SECRET_KEY=""


    # Deployment used by `npx convex dev`
    CONVEX_DEPLOYMENT="" # team: infinite-loop, project: live-interviewer

    NEXT_PUBLIC_CONVEX_URL=""


    # Assembly AI
    ASSEMBLYAI_API_KEY=""


    # Kinde API
    KINDE_CLIENT_ID=""
    KINDE_CLIENT_SECRET=""
    KINDE_ISSUER_URL="https://<issuer_url>.kinde.com"
    KINDE_SITE_URL=http://localhost:3000
    KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
    KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/dashboard


    # Resend
    RESEND_API_KEY=""
```

## Technologies

The following technologies facilited the making of this app.

- AssemblyAI: transcripts, speech to text, AI insights (markdown)
- Kinde Auth: Authentication
- Inngest.dev: Background jobs.
- Convex.dev: Database
- Superviz: Realtime video conferencing
- Resend: Email
