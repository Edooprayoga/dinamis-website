# Website Edo - Web Programming Project

## Overview
This is a full-stack web application built with Node.js and Express, featuring user authentication with login and registration functionality. The project was created by Ahmad Edo Prayoga as a web programming assignment.

## Project Architecture

### Backend
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
  - `users.db`: Stores user accounts with username, password (hashed with bcrypt), email, and timestamps. Also contains comments table for storing user comments.
  - `sessions.db`: Stores user session data
- **Authentication**: Session-based authentication with express-session and bcrypt for password hashing
- **Server**: Runs on port 5000, bound to 0.0.0.0

### Features
- **User Authentication**: Secure login and registration with password hashing
- **Comment System**: Users can post, view, and delete their own comments in a dedicated comments page
- **Session Management**: Persistent user sessions with SQLite storage
- **Protected Routes**: Authentication required for accessing dashboard pages

### Frontend
- **Technology**: Vanilla HTML, CSS, JavaScript
- **Pages**:
  - `index.html`: Login page (main entry point)
  - `register.html`: User registration page
  - `home.html`: Home page (protected, requires authentication)
  - `about.html`: About page
  - `comments.html`: Comments page with community discussion feature (protected)
  - `contact.html`: Contact page
- **Authentication Check**: `auth-check.js` handles client-side authentication verification

### API Endpoints
**Authentication:**
- `POST /api/register`: Create new user account
- `POST /api/login`: Authenticate user and create session
- `POST /api/logout`: Destroy user session
- `GET /api/check-auth`: Check if user is authenticated

**Comments:**
- `GET /api/comments`: Retrieve all comments (requires authentication)
- `POST /api/comments`: Create a new comment (requires authentication, max 500 characters)
- `DELETE /api/comments/:id`: Delete a comment (requires authentication, only owner can delete)

## Dependencies
- express: Web framework
- express-session: Session management
- connect-sqlite3: SQLite session store
- better-sqlite3: SQLite database driver
- bcrypt: Password hashing

## Development Setup
- Server runs on: http://0.0.0.0:5000
- Cache control headers are set to prevent caching issues
- Session secret is auto-generated in development (set SESSION_SECRET env var for production)

## Recent Changes
- 2025-11-08: Comment system feature added
  - Created dedicated comments.html page with full comment functionality
  - Added comments table to database with CRUD operations
  - Implemented comment API endpoints (GET, POST, DELETE)
  - Added "Komentar" menu to navbar in all protected pages
  - Users can post comments (max 500 chars), view all comments, and delete their own
  - Proper authentication and authorization checks in place

- 2025-11-08: Initial import and setup in Replit environment
  - Installed npm dependencies
  - Created missing register.html page
  - Verified server configuration and frontend display
  - Configured workflow to run server on port 5000

## Notes
- The application includes multimedia files (images, audio, video) for UI enhancement
- Background music plays on login and registration pages
- Uses Indonesian language for UI text
- SQLite databases (*.db files) are gitignored for security
