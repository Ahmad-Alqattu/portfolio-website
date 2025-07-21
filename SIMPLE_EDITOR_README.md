# Portfolio Website - Clean & Simple

## Quick Setup

1. **Run the app:**
   ```bash
   npm start
   ```

2. **Edit your profile:**
   - Go to `/login` and login with Firebase
   - Click the "Edit" button in the navbar
   - Or visit `/edit` directly

## Profile Editor Features

### ✨ Simple & Clean Interface
- **Profile Picture**: Upload directly or paste URL
- **Basic Info**: Name, title, tagline, about section
- **Resume/CV**: Upload PDF or paste URL  
- **Live Preview**: See changes instantly
- **Save to Firebase**: Changes sync automatically

### 🖼️ Image Upload
- **Direct Upload**: Click "Upload New Photo" - files go to Firebase Storage
- **URL Option**: Paste any image URL for instant preview
- **Auto Preview**: See exactly how it looks on your portfolio

### 💾 Data Storage
- **Firebase**: Changes save to your user-specific database
- **JSON Structure**: Works with your existing sectionsData.json format
- **Local Fallback**: Works offline if Firebase is down

## How It Works

### Current JSON Structure (Preserved)
```json
{
  "id": "intro",
  "name": "Ahmad Al-Qattu", 
  "title": "Introduction",
  "type": "intro",
  "content": "Your about me text...",
  "data": {
    "subtitle": "Software Engineer",
    "highlight": "Your tagline",
    "image": "path/to/image.jpg",
    "cvLink": "path/to/resume.pdf"
  }
}
```

### What Changed
- ✅ Removed all complex admin interfaces
- ✅ Created one simple profile editor
- ✅ Added edit button to navbar (shows when logged in)
- ✅ Image upload with real Firebase Storage
- ✅ Practical UX - no file paths, real uploads with preview

### Routes
- `/` - Your portfolio (public)
- `/login` - Firebase authentication  
- `/edit` - Profile editor (requires login)
- `/admin` - Redirects to `/edit`

## Key Files

- `src/components/admin/SimpleProfileEditor.js` - The clean editor
- `src/App.js` - Simplified routing
- `src/components/layout/ResponsiveNavBar.js` - Added edit button
- `public/data/sectionsData.json` - Your current data structure

## Firebase Features

- **Authentication**: Login/logout system
- **Storage**: Upload images and documents
- **Firestore**: Save profile data dynamically
- **Real URLs**: Uploaded files get permanent URLs

---

**That's it!** No more complex interfaces. Just login → edit → save → done. 🎉
