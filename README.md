## Introduction  

**Async Interview** is an AI-powered interview application designed to facilitate seamless and efficient interviews. In today's competitive job market, where employers seek the best candidates and job seekers strive to find roles that align with their skills, Async Interview addresses several key challenges:  

1. **Lack of feedback after interviews**  
2. **Extracting key insights efficiently and affordably**  
3. **Saving time for both employers and candidates**  

The application leverages **AssemblyAI's powerful LLM-powered speech-to-text capabilities** to generate accurate transcripts and insightful post-interview reports. This innovation benefits job seekers by providing constructive feedback on their strengths and weaknesses, ultimately improving their chances in the job market.  

Async Interview is built with fault tolerance and a strong focus on user experience. Thanks to **resilient background job processing**, the app ensures smooth performance and reliable results for all users.

---

## Getting Started  

To start the development server, use one of the following commands:  

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```  

Then, open [http://localhost:3000](http://localhost:3000) in your browser to view the application.  

You can begin editing the code by modifying `app/page.tsx`. The page will automatically update as you make changes.  

This project utilizes [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) for font optimization and includes [Geist](https://vercel.com/font), a modern font family by Vercel.

---

## Environment Variables  

To properly test and deploy the application, configure the necessary environment variables. Copy `.env.example` to `.env.local` in both the root folder and the backend folder. Below is the list of required variables:  

```bash
# Superviz
NEXT_PUBLIC_SUPERVIZ_DEVELOPER_TOKEN=""
SUPERVIZ_CLIENT_ID=""
SUPERVIZ_SECRET_KEY=""

# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT="" # team: infinite-loop, project: live-interviewer
NEXT_PUBLIC_CONVEX_URL=""

# AssemblyAI
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

---

## Technologies  

The following technologies were integral to the development of Async Interview:  

- **AssemblyAI**: Speech-to-text processing, transcripts, and AI-powered insights.  
- **Kinde Auth**: Secure and efficient authentication.  
- **Inngest.dev**: Background job processing for reliability and scalability.  
- **Convex.dev**: Real-time database management.  
- **Superviz**: Real-time video conferencing capabilities.  
- **Resend**: Email delivery service.