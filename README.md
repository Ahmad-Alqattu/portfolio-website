# Ahmad Al-Qattu Portfolio Website

A dynamic React-based portfolio website powered by Firebase services, featuring an admin panel for content management and real-time updates.

## 🚀 Features

### Public Portfolio
- **Responsive Design**: Optimized for all device sizes
- **Modern UI**: Built with Material-UI and custom theming
- **Smooth Navigation**: Section-based navigation with scroll detection
- **Rich Content**: Sections for intro, skills, projects, education, and experience
- **Media Support**: Images and videos for projects
- **Real-time Updates**: Content updates automatically when changed via admin panel

### Admin Panel (`/admin`)
- **Secure Authentication**: Firebase Auth with email/password and Google login
- **Content Management**: Edit all portfolio sections through intuitive forms
- **Media Upload**: Upload and manage images/videos with Firebase Storage
- **Real-time Sync**: Changes reflect instantly on the live site
- **Data Migration**: Automatic migration from static JSON to Firestore

## 🛠️ Tech Stack

- **Frontend**: React.js, Material-UI, Framer Motion
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Routing**: React Router DOM
- **Forms**: React Hook Form, Formik
- **State Management**: React Context API
- **Styling**: Material-UI, Tailwind CSS

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ahmad-Alqattu/portfolio-website.git
   cd portfolio-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password and Google)
   - Create a Firestore database
   - Set up Firebase Storage
   - Copy your Firebase config

4. **Environment Variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Firebase configuration in `.env`:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Firebase Setup

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to portfolio data for everyone
    match /{collection}/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📁 Project Structure

```
src/
├── components/
│   ├── admin/           # Admin panel components
│   ├── layout/          # Layout components (navbar, footer)
│   ├── sections/        # Portfolio sections
│   └── common/          # Reusable components
├── contexts/            # React context providers
├── firebase/            # Firebase configuration and utilities
├── pages/              # Page components
└── theme.js            # Material-UI theme configuration
```

## 🎨 Customization

### Adding New Sections
1. Update the data structure in `src/firebase/firestore.js`
2. Add the section component in `src/components/sections/`
3. Update `MainComponent.js` to render the new section
4. Add editing support in the admin panel

### Styling
- Modify `src/theme.js` for global theme changes
- Use Material-UI's `sx` prop for component-specific styling
- Tailwind classes are available for utility styling

## 🚦 Usage

### First-time Setup
1. Visit `/admin` and log in with your Firebase auth
2. The system will offer to migrate data from the JSON file
3. Edit sections through the admin panel
4. Upload media files and copy URLs for use in content

### Content Management
- **Intro Section**: Update name, title, subtitle, profile image
- **Skills**: Add/remove skills by category
- **Projects**: Manage project details, images, and videos
- **Education**: Update education history
- **Experience**: Manage work experience
- **Media**: Upload and manage all media files

## 🔐 Security

- Admin access requires Firebase authentication
- Firestore rules ensure only authenticated users can write
- Media files are publicly readable but require auth to upload
- Environment variables keep Firebase config secure

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Ahmad-Alqattu/portfolio-website/issues).

## 📞 Contact

Ahmad Al-Qattu - [ahmadl.qatu@gmail.com](mailto:ahmadl.qatu@gmail.com)

Project Link: [https://github.com/Ahmad-Alqattu/portfolio-website](https://github.com/Ahmad-Alqattu/portfolio-website)

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
