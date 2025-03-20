# Confident Kids App

A web application for helping parents build confidence in their children based on the "Raising Confident Kids" playbook.

## Overview

This application implements a SaaS platform targeting parents of children in different age groups (toddlers 2-5, elementary 6-11, teens 12+) focused on helping kids gain confidence through 5 key pillars:

1. Independence & Problem-Solving
2. Growth Mindset & Resilience
3. Social Confidence & Communication
4. Purpose & Strength Discovery
5. Managing Fear & Anxiety

## Technology Stack

- MongoDB for database
- Node.js and Express for backend
- React for frontend
- JWT for authentication

## Features

- User authentication and profile management
- Content delivery based on the 5 pillars
- Age-specific content adaptation
- Progress tracking
- Daily challenges and 30-day challenge calendar
- Notification system

## Project Structure

The application follows a microservices architecture with the following services:

- **User Service**: Handles user authentication and profile management
- **Content Service**: Manages and delivers educational content
- **Progress Service**: Tracks and reports user progress
- **Challenge Service**: Manages daily and custom challenges
- **Notification Service**: Sends reminders and updates to users

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB

### Setup

1. Clone the repository
```
git clone <repository-url>
cd confident-kids-app
```

2. Install dependencies
```
npm install
```

3. Set up environment variables
Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/confident-kids
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

4. Seed the database
```
node config/seed.js
```

5. Start the application
```
npm start
```

## Usage

After starting the application, you can access it at `http://localhost:5000`.

1. Register a new account
2. Add your children to your profile
3. Explore the 5 pillars of confidence
4. Complete daily challenges
5. Track your progress

## API Endpoints

### User Management
- POST /api/users/register
- POST /api/users/login
- GET /api/users/profile
- PUT /api/users/profile
- POST /api/users/child

### Content
- GET /api/content/pillars
- GET /api/content/pillar/:id
- GET /api/content/techniques/:pillarId
- GET /api/content/technique/:id
- GET /api/content/age-group/:group

### Progress
- POST /api/progress/track
- GET /api/progress/user
- GET /api/progress/pillar/:pillarId
- GET /api/progress/summary
- PUT /api/progress/:id

### Challenges
- GET /api/challenges/daily
- GET /api/challenges/calendar
- POST /api/challenges/complete
- GET /api/challenges/custom
- POST /api/challenges/custom

### Notifications
- POST /api/notifications/send
- GET /api/notifications/user
- GET /api/notifications/all
- PUT /api/notifications/read/:id
- PUT /api/notifications/read-all

## License

This project is licensed under the MIT License.
