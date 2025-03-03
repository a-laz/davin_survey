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

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and add your Supabase credentials
4. Run the development server with `npm run dev`

## Database Setup

The application uses Supabase for data storage. The database schema includes:

- `survey_responses` table for storing all survey submissions
- Row Level Security policies for data protection

## License

MIT
