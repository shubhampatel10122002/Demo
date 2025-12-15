# ShopAI Demo

An AI-powered shopping search interface with intelligent filters, source preferences, and a conversational shopping assistant.

## Features

- **Smart Product Search**: Browse through curated product listings with multi-source ratings
- **Priority Filters**: Quick-access filters for comfort, cushioning, durability, and more
- **Advanced Filtering**: Price range, brands, retailers, colors, and return policies
- **Source Preferences**: Toggle between Reddit, YouTube, Quora, and blog reviews
- **Chat Assistant**: Interactive shopping assistant for refined searches
- **Mobile-First Design**: Optimized for mobile viewing

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: JavaScript/React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd Demo
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect Next.js and configure the build settings
5. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

## Build Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
Demo/
├── app/
│   ├── components/
│   │   └── SearchResultsPage.jsx    # Main component
│   ├── globals.css                   # Global styles + Tailwind
│   ├── layout.jsx                    # Root layout
│   └── page.jsx                      # Home page
├── public/                           # Static assets
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
└── tailwind.config.js
```

## Features Demo

### Interactive Elements

- **Priority Pills**: Toggle filters for product characteristics
- **Source Toggle**: Control which review sources influence scores
- **Advanced Filters**: Slide-in panel with comprehensive filtering options
- **Chat Interface**: Collapsible shopping assistant
- **Sort Options**: Sort products by match, score, or price

### Mobile Optimized

- Responsive design centered on mobile experience
- Touch-friendly interactions
- Smooth animations and transitions
- Optimized scrolling and navigation

## License

MIT
