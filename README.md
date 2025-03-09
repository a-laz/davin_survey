# BIM Survey Application

A modern web application for collecting feedback on Building Information Modeling (BIM) technology needs and preferences.

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

1. In the project root, initialize and install dependencies:
```bash
npm init -y
npm install
```

2. To run the development server:
```bash
npm run dev
```

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