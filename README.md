# Virtual Design and Construction Survey Application

A modern web application for collecting feedback on Virtual Design and Construction (VDC) technology needs and preferences, with a focus on environments outside of Navisworks.

## Recent Updates

### Terminology Updates
- Replaced "BIM" references with "Virtual Design and Construction" to better reflect industry terminology
- Updated "Unreal Engine" references to "Environment Outside of Navisworks" for broader applicability
- Modified UI text throughout to maintain consistency with VDC terminology

### Survey Structure Changes
- Personal Information section remains at the top and required to ensure data quality and follow-up capabilities
- Current VDC Usage section includes new questions:
  - "Have you imported your model out of Navisworks into another tool?"
  - "What are you currently using Virtual Construction Design / 3D modeling for?"
- Added more specific options for model usage including:
  - Clash Detection and Subcontractor Coordination
  - Phasing, Sequencing Logistics Planning
  - Claim Support
  - Marketing Videos

### Form Design Decisions
The Personal Information section is intentionally kept at the top and required rather than optional at the bottom because:
1. It helps establish the respondent's context before they provide technical feedback
2. Required contact information ensures we can follow up on valuable insights
3. Having it at the top sets clear expectations for the survey process
4. Maintains data quality by collecting verified professional responses

## Features

- Interactive survey form for collecting industry feedback
- Beautiful UI with a modern dark theme and teal accents
- Animated background with Three.js shooting stars effect
- Supabase integration for data storage
- Responsive design for all device sizes

## Tech Stack

- React with TypeScript
- Tailwind CSS for styling
- Three.js for 3D animations
- Supabase for backend database
- Vite for fast development and building

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works fine)

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/a-laz/davin_survey.git
cd davin_survey
```

2. Install dependencies:
```bash
npm install
```

3. Environment setup:
   The repository includes the `.env` file with the following Supabase configuration:
   ```
   VITE_SUPABASE_URL=https://nilprlveermxswqlngyb.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbHBybHZlZXJteHN3cWxuZ3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NjU3MzIsImV4cCI6MjA1NjU0MTczMn0.GMyPg_zqI3s2GeMN0gpWmMcZKq_ZMYGgMzFGWYzCmRs
   ```
   These credentials are already set up and working with the project's Supabase instance.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:5173
```

### Database Configuration

The Supabase project is already configured with the necessary schema and security policies. You can access the dashboard at:
https://nilprlveermxswqlngyb.supabase.co

The schema includes:
- `survey_responses` table for storing submissions
- Row Level Security (RLS) policies:
  - Anyone can submit survey responses
  - Only authenticated users can read their own responses

### Troubleshooting

Common issues and solutions:

1. If the development server fails to start:
   - Make sure port 5173 is not in use
   - Try running `npm run dev -- --port 3000` to use a different port

2. For database connection issues:
   - Check your internet connection
   - Verify you're using the repository's `.env` file
   - Contact repository maintainers if you need access to the Supabase dashboard

## Database Setup

The application uses Supabase for data storage. The database schema includes:

- `survey_responses` table for storing all survey submissions
- Row Level Security policies for data protection

## Version Control

Since Git is not available in the Bolt environment, this project includes a custom version control script:

```bash
# Create a snapshot of the current state
npm run snapshot "Your commit message here"

# List all snapshots
npm run snapshots

# Compare two snapshots (replace with actual snapshot IDs)
npm run compare snapshot-id-1 snapshot-id-2

# Restore a previous snapshot (replace with actual snapshot ID)
npm run restore snapshot-id
```

## Deployment

This application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## License

MIT