# Link Saver + Auto-Summary

A full-stack web application that allows users to save bookmarks with automatically generated summaries.

## Evaluation Criteria (as per requirements)
- **Core functionality met: 40%**
- **Code clarity & structure: 30%**
- **UI / UX polish: 20%**
- **Git & README hygiene: 10%**

## Features

- **User Authentication**
  - Email and password signup/login
  - Secure password hashing with bcrypt
  - JWT-based session management with NextAuth.js
  - Proper validation and error handling

- **Bookmark Management**
  - Save URLs as bookmarks
  - Automatic fetching of website title & favicon (from document.title, favicon.ico, OpenGraph tags)
  - Auto-summary generation using Jina AI's free API endpoint
  - Delete bookmarks with confirmation
  - Filter bookmarks by tags
  - Properly handles API errors gracefully

- **List & View Features**
  - Responsive list/grid of saved links
  - Shows title, favicon and summary text
  - Delete bookmark button
  - Tag filtering with intuitive UI
  - Drag-drop reordering with visual feedback
  - Expandable summaries

- **UI/UX Implementation (Focus Area: 20% of Evaluation)**
  - Clean, responsive design adapting to mobile, tablet, and desktop views
  - Dark/light mode toggle with system preference detection
  - Visual feedback for all user interactions (hover states, loading indicators)
  - Grid layout for larger screens, list layout for mobile devices
  - Accessible design with proper contrast ratios and focus indicators
  - Form validation with clear error messaging
  - Loading states for all asynchronous operations
  - Smooth transitions for drag-and-drop operations

## Tech Stack

- **Frontend**
  - Next.js with React 19
  - TypeScript
  - Tailwind CSS
  - DND Kit for drag-and-drop
  - React Icons

- **Backend**
  - Next.js API Routes
  - NextAuth.js for authentication
  - MongoDB with Mongoose for database
  - isomorphic-unfetch for API requests

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or cloud service like MongoDB Atlas)

### Installation Steps

1. Clone the repository:
   ```
   git clone <repository-url>
   cd link-saver-automation-summary
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env.local` file in the root directory with the following:
   ```
   MONGODB_URI=mongodb://localhost:27017/linksaver
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-change-me-in-production
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to use the application.

## Code Structure

- `/src/app` - Next.js App Router pages and API routes
- `/src/components` - React components organized by feature
- `/src/lib` - Utility functions and database connection
- `/src/models` - MongoDB schema models
- `/src/types` - TypeScript type definitions

### Key Implementation Details

- **Authentication Flow**: Using NextAuth.js with credential provider and JWT strategy
- **Data Fetching**: Server-side and client-side data fetching strategies
- **UI Components**: Modular, reusable components with proper prop typing
- **API Error Handling**: Consistent error handling patterns across all API routes
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Key Features Implementation

### Authentication
The authentication system uses NextAuth.js with a credentials provider. Passwords are securely hashed using bcrypt before storage. The application maintains session state using JWT tokens, ensuring secure access to protected resources.

### Bookmark Management
When a user saves a URL:
1. The application extracts title and favicon using a combination of methods (document.title, favicon.ico, OpenGraph tags)
2. It then calls the Jina AI API endpoint (`https://r.jina.ai/http://<URL‑ENCODED_TARGET_PAGE>`) to generate a summary
3. All information is stored in MongoDB with proper data validation

### Drag-and-Drop Reordering
The drag-and-drop functionality is implemented using the DND Kit library:
- Provides immediate visual feedback during drag operations
- Updates the order in the database after reordering
- Maintains state consistency between client and server

### UI/UX Design Approach
- **Card-based Design**: Each bookmark is displayed in a card with consistent spacing and elevation
- **Visual Hierarchy**: Important information (title, favicon) is prominently displayed, with summaries available on expansion
- **Color Schemes**: Carefully selected color palette for both dark and light modes with proper contrast ratios
- **Interactive Elements**: Clear affordances for interactive elements like buttons and draggable cards
- **Micro-interactions**: Subtle animations for actions like adding/deleting bookmarks and expanding summaries
- **Responsive Layout**: Fluid grid system that adapts to different screen sizes
- **Accessibility**: Semantic HTML, keyboard navigation, and screen reader support

### Error Handling & Edge Cases
- Properly handles API errors with graceful fallbacks
- Implements proper error boundaries to prevent UI crashes
- Provides user-friendly error messages
- Handles edge cases like unavailable summaries or unreachable URLs

## Future Enhancements

Potential enhancements that could be added in future iterations:
- Full-text search across bookmarks and summaries
- Browser extension for easier bookmark saving
- Bookmark collections/folders for better organization
- Social sharing options
- Enhanced analytics on bookmark usage

## Testing

The application can be tested as follows:
1. Register a new user account
2. Login with the created credentials
3. Add bookmarks by pasting URLs
4. Test tag filtering, bookmark deletion, and drag-and-drop reordering
5. Toggle dark/light mode
6. Test on different device sizes for responsive design
