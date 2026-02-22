# StreamVerse 🚀

StreamVerse is a premium, modern media streaming platform designed with a glassmorphic aesthetic. It provides a seamless experience for streaming music, videos, and sports content.

## ✨ Implemented Features

### 🎬 Media Streaming
- **Video Player**: A high-performance, responsive fullscreen video player with intuitive controls (Play/Pause, Seek, Volume, Fullscreen).
- **Music Integration**: Dedicated services for music streaming with rich metadata support.
- **Sports Central**: Specialized API integration for live sports updates and content.

### 🏠 Modern Dashboard
- **Glassmorphic UI**: A state-of-the-art design using transparency, blur effects, and neon accents.
- **Dynamic Layout**: Full-height sidebar navigation with collapsible functionality.
- **Interactive Components**: 
  - **Horizontal & Vertical Cards**: Modern content cards with hover effects.
  - **Expandable Carousel**: Smooth animations for featured content.
  - **Analytics Display**: SaaS-style progress tracking and stats cards.

### 🔍 Discovery & Personalization
- **Global Search**: Powerful search functionality to find movies, music, and sports.
- **Categories**: Browse content by type (Action, Comedy, Sports, etc.).
- **User Profiles**: Manage personal settings and view account analytics.

### 🛡️ Authentication & Security
- **Firebase Auth**: Secure Google Sign-In and Email/Password authentication.
- **Auth Gates**: Protected routes ensuring sensitive pages are only accessible to logged-in users.

### ⚖️ Legal & Compliance
- Integrated **Terms of Service**, **Privacy Policy**, and **Cookie Policy** pages.

---

## 🛠️ Technology Stack

- **Frontend**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Glassmorphism & Responsive Design)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Backend/Services**: 
  - [Firebase](https://firebase.google.com/) (Authentication, Hosting, Firestore)
  - [Axios](https://axios-http.com/) (HTTP Requests)
- **State Management**: React Context API (`ContentContext`, `PlayerContext`, `AuthContext`)

---

## 🚀 How It Works

1. **Architecture**: The app uses a component-based architecture with a centralized `Layout` component that manages global UI elements like the Sidebar and Navbar.
2. **State Management**:
   - `AuthContext`: Tracks user authentication status via Firebase.
   - `ContentContext`: Manages the discovery of movies, sports, and music data.
   - `PlayerContext`: Controls global media playback states.
3. **Data Fetching**: Custom API services (`musicApi.js`, `sports.js`) handle external data retrieval using Axios.
4. **Routing**: `react-router-dom` manages navigation across the single-page application (SPA).

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with your Firebase configuration.
4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173/`.
