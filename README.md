# OpenAuto MVP

A modern AI-powered car diagnostics interface built with Next.js, TailwindCSS, and Framer Motion.

## Features

- 🚗 **Vehicle Input**: Enter your car's make, model, and year
- 🔍 **Symptom Search**: Describe your car's symptoms in natural language
- 🧠 **AI Diagnosis**: Get 5 possible diagnoses with probability scores
- 📊 **Interactive Feedback**: Thumbs up/down on each diagnosis
- 📱 **Detailed Sidebar**: Click any diagnosis to see:
  - Step-by-step repair instructions
  - Technical diagrams
  - Specifications
  - Required parts with links

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file (not committed) with the OpenAI credential that powers the `/api/chat` route:

```
OPENAI_API_KEY=sk-your-openai-key
```

### Deploying to Vercel

1. Install the Vercel CLI and log in if you have not already:

   ```bash
   npm install -g vercel
   vercel login
   ```
2. From the `OpenAuto` directory run `vercel` to link or create a project. The provided `vercel.json` already pins the build, install, and dev commands to match `package.json`.
3. In the Vercel dashboard (or via `vercel env`), add `OPENAI_API_KEY` under the Production, Preview, and Development environments.
4. Trigger a deployment with `vercel --prod` (or let Git integrations do it). Vercel will run `npm install` and `npm run build`, producing the same optimized bundle verified locally.

> The `app/api/chat` route is explicitly configured to run on the Node.js 20 runtime to maintain compatibility with the OpenAI SDK.

## Design System

- **Background**: Black (#000)
- **Accent**: Bright Yellow (#FFD000)
- **Text**: White (#FFF)
- **Cards**: Zinc-900 with subtle borders
- **Animations**: Smooth fade/slide transitions

## Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
└── components/
    ├── VehicleInputs.tsx    # Make/Model/Year inputs
    ├── SearchBar.tsx        # Symptom search
    ├── DiagnosisCard.tsx    # Individual diagnosis card
    └── DetailsSidebar.tsx   # Sliding detail panel
```

## Future Enhancements

- Connect to real AI diagnostic API
- User authentication and history
- Save favorite diagnoses
- Share diagnoses with mechanics
- Video tutorials for repairs
- AR-powered part identification

## License

MIT
