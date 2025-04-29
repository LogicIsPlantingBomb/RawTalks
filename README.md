# TruthStream Frontend

A modern, responsive React application for sharing and discussing opinions with a sleek dark theme and interactive UI elements.

![Rawtalks](https://github.com/user-attachments/assets/320b1a84-cada-4980-bb05-59623462aa10)


## Overview

TruthStream is a social platform where users can:
- Create and share opinions
- Vote on opinions (upvote/downvote)
- Comment on opinions
- Create user profiles

The frontend uses React with modern styling practices, custom animations, and a distinctive dark theme with lime accents.

## Tech Stack

- **React** - UI framework
- **React Router** - For navigation
- **Framer Motion** - For animations and transitions
- **Tailwind CSS** - For styling
- **Axios** - For API requests

## Key Features

- **Dark theme with lime accents** - Distinctive and modern visual identity
- **Particle animations** - Dynamic background elements
- **Responsive design** - Works on mobile, tablet, and desktop
- **Interactive UI elements** - Buttons with hover effects, transitions, and feedback
- **User authentication** - Registration, login, and profile management

## Pages

### Home
The landing page introduces users to the platform with animated particles and a glowing moon effect. It provides clear navigation options and a brief overview of the platform.

### Feed
Displays a list of opinions from all users with options to upvote, downvote, and view comments. Users can filter and sort opinions based on popularity or recency.

### Opinion Detail
Shows a single opinion with its full text, vote count, and comments. Authenticated users can add comments and vote on both the opinion and individual comments.

### Create Opinion
A form page where authenticated users can compose and submit new opinions. Features character counting and input validation.

### Login/Register
Authentication pages with form validation and error handling. Redirects users to their intended destination after successful authentication.

### Profile
Displays user information and provides options to create new opinions, browse the feed, or log out.

## Components Structure

```
src/
├── components/         # Reusable UI components
├── context/           # React context for global state management
│   └── AuthContext.js # Authentication context and provider
├── pages/             # Page components
│   ├── Home.jsx
│   ├── Feed.jsx
│   ├── OpinionDetail.jsx
│   ├── CreateOpinion.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Profile.jsx
├── utils/             # Utility functions
└── App.jsx            # Main application component with routing
```

## Design System

The application follows a consistent design system with:

- **Colors:**
  - Primary: Lime (`#84cc16`, `text-lime-400`)
  - Background: Black (`#000000`)
  - Secondary backgrounds: Dark gray with transparency (`bg-gray-900/80`)
  - Text: White and gray variants (`text-white`, `text-gray-300`)
  - Accent: Lime with transparency for buttons and interactive elements

- **Components:**
  - Buttons with hover and active states
  - Cards with subtle borders and transparency
  - Form inputs with focus states
  - Consistent spacing and typography

- **Animations:**
  - Page transitions
  - Button hover effects
  - Falling particles
  - Pulsing moon glow

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/truthstream.git
cd truthstream/frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Authentication

The application uses JWT-based authentication. The authentication flow is managed through the `AuthContext` which:

- Handles login/register requests
- Stores user data and tokens
- Provides authentication state to components
- Manages protected routes

## API Integration

The frontend communicates with the backend API using axios. API calls include:

- User authentication (login/register)
- Creating, reading, and voting on opinions
- Adding and voting on comments
- User profile management

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
