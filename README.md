# 🚀 Dynamic Multi-User Portfolio System

A modern, scalable portfolio platform built with React, Firebase, and Material-UI that allows multiple users to create and manage their own professional portfolios.

## ✨ Features

### 🔐 Multi-User System
- **User Registration & Authentication** - Email/password and Google sign-in
- **User Profile Management** - Profile pictures, CV uploads, bio, and contact info
- **Data Isolation** - Complete separation of user data in Firestore and Storage

### 📂 Media Management
- **User-based Storage Structure** - Organized as `/users/{uid}/media/`
- **File Upload with Previews** - Images, videos, and PDFs with real-time previews
- **Media Categories** - Profile pictures, CVs, and project media
- **Drag & Drop Interface** - Modern file upload experience

### 🎨 Admin Dashboard
- **Profile Admin Dashboard** - Comprehensive user profile management
- **Content Management** - Edit portfolio sections, projects, and skills
- **Media Upload Zones** - Specialized upload areas for different content types
- **Real-time Updates** - Live synchronization with Firestore

### 🌐 Public Portfolio Views
- **Username-based URLs** - `/u/{username}` for easy sharing
- **UID-based URLs** - `/p/{uid}` as alternative access
- **SEO-Friendly** - Clean, indexable portfolio pages
- **Responsive Design** - Mobile-optimized viewing experience

### 🛠 Technical Stack
- **Frontend**: React 18, Material-UI, Tailwind CSS, Vite
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Forms**: React Hook Form, Yup validation
- **File Uploads**: React Dropzone
- **State Management**: React Context
- **Routing**: React Router DOM

## 📸 Screenshots

### Homepage
![Portfolio Homepage](https://github.com/user-attachments/assets/955ba2fb-fde2-4df3-8c07-a108fa70e68a)

### User Registration
![Registration Page](https://github.com/user-attachments/assets/e8d5fcf9-13b2-4661-981c-2e28acb6ded7)

### Admin Login
![Login Page](https://github.com/user-attachments/assets/06e1e331-b206-44b5-9ee7-4c1a38f481d8)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Firebase project with Auth, Firestore, and Storage enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ahmad-Alqattu/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase project credentials
   ```

4. **Deploy Firestore and Storage rules**
   ```bash
   # Install Firebase CLI if not already installed
   npm install -g firebase-tools
   
   # Login and initialize
   firebase login
   firebase init
   
   # Deploy security rules
   firebase deploy --only firestore:rules
   firebase deploy --only storage:rules
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🏗 Architecture

### Data Structure

#### User Profile (`/users/{uid}`)
```javascript
{
  displayName: "John Doe",
  username: "johndoe",
  email: "john@example.com",
  bio: "Software developer...",
  title: "Senior Developer",
  website: "https://johndoe.com",
  location: "New York, NY",
  profilePicture: "download_url",
  cvUrl: "download_url",
  createdAt: "2024-01-01T00:00:00Z",
  lastUpdated: "2024-01-01T00:00:00Z"
}
```

#### Portfolio Sections (`/users/{uid}/sections/{sectionId}`)
```javascript
{
  id: "intro",
  type: "intro",
  title: "Introduction",
  content: "Portfolio description...",
  data: {
    subtitle: "Software Engineer",
    highlight: "Key achievements...",
    // Section-specific data
  },
  order: 1,
  lastUpdated: "2024-01-01T00:00:00Z"
}
```

### Storage Structure
```
/users/{uid}/
├── profile/          # Profile pictures
├── cv/              # CV/Resume files
├── media/           # General media files
└── projects/        # Project images/videos
```

## 🔒 Security

### Firestore Rules
- Users can only access their own data
- Public read access for portfolio viewing
- Write access requires authentication and ownership

### Storage Rules
- User-based folder isolation
- Public read for portfolio media
- Write access requires authentication and ownership

## 🌟 Key Components

### Authentication
- `Register.js` - User registration with validation
- `Login.js` - User authentication
- `AuthContext.js` - Global authentication state

### Admin Dashboard
- `ProfileAdminDashboard.js` - Main admin interface
- `MediaUploadZone.js` - File upload component
- `EnhancedProjectEditor.js` - Project management

### Public Portfolio
- `PublicPortfolio.js` - Public portfolio viewer
- Dynamic user data loading
- SEO-optimized structure

## 📋 Available Routes

### Public Routes
- `/` - Homepage
- `/u/{username}` - Public portfolio by username
- `/p/{uid}` - Public portfolio by user ID
- `/login` - User login
- `/register` - User registration

### Protected Admin Routes
- `/admin` - Profile admin dashboard
- `/admin/content` - Content management
- `/admin/media` - Media upload
- `/admin/projects/{id}` - Project editor

## 🧪 Testing

### Multi-User Testing
1. Create multiple user accounts
2. Upload different media for each user
3. Verify data isolation between users
4. Test public portfolio access
5. Confirm media files are properly segregated

### Build & Deploy
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Development

### Adding New Sections
1. Define section schema in Firestore
2. Create section component in `/components/sections/`
3. Add to section editor routing
4. Update data validation schemas

### Customizing Upload Types
1. Extend `MediaUploadZone` component
2. Add new storage paths in Firebase rules
3. Update file validation logic
4. Add preview components for new types

## 📚 Technologies Used

- **React 18** - Modern React with hooks
- **Material-UI v5** - Component library
- **Firebase v10** - Backend services
- **React Hook Form** - Form management
- **Yup** - Schema validation
- **React Dropzone** - File uploads
- **Vite** - Build tool
- **Tailwind CSS** - Utility-first CSS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋‍♂️ Support

For support, email support@example.com or create an issue in the repository.