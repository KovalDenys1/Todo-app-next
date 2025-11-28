# ✅ ToDo App – Secure Task Manager with Next.js & TypeScript

**Author:** Denys Koval   
**Repository:** [github.com/KovalDenys1/Todo-app-next](https://github.com/KovalDenys1/Todo-app-next)

A modern, feature-rich task manager with authentication, built using Next.js, React, TypeScript, and shadcn/ui. Organize your tasks by category (Home, Work, School), set priorities, track progress, and keep everything secure with bcrypt-encrypted authentication.

---

## 📸 Screenshots

### Login Page
![Login Page](https://i.imgur.com/B8i6K6d.png)

### Main Application
![Todo App Interface](https://i.imgur.com/tWjqihl.png)

---

## ✨ Features

### 🔐 Security & Authentication
- **Secure Login System** with bcrypt password hashing
- Session management with localStorage
- Demo accounts included for testing
- Auto-logout after 24 hours

### ✅ Task Management
- ➕ **Add tasks** with category and priority selection
- ✏️ **Edit tasks** (double-click or edit button)
- 🗑️ **Delete tasks** with smooth animations
- ☑️ **Complete tasks** with checkboxes and visual feedback
- 🎯 **Priority levels**: High, Medium, Low (color-coded)
- 📂 **Categories**: Home, Work, School with custom icons

### 📊 Progress Tracking
- **Overall progress bar** showing completion percentage
- **Per-category statistics** with task counters
- Visual progress indicators for each category
- Real-time updates as tasks are completed

### 🎨 User Experience
- 🌓 **Dark/Light theme** toggle with smooth transitions
- 📱 **Fully responsive** design for mobile, tablet, and desktop
- 🔔 **Toast notifications** for all actions (add, edit, delete, complete)
- ⚡ **Smooth animations** and transitions
- 💾 **Persistent storage** via localStorage
- 🎯 **Priority-based sorting** (incomplete tasks first, then by priority)

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (React 19)
- **Language:** TypeScript
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Styling:** Tailwind CSS v4
- **Authentication:** bcryptjs for password hashing
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** React hooks (`useState`, `useEffect`)
- **Storage:** localStorage for tasks and sessions

---

## 🚀 How to Run the Project / Getting Started

### Prerequisites
- Node.js 18+ installed on your computer
- npm or yarn package manager

### Step-by-Step Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/KovalDenys1/Todo-app-next.git
   cd Todo-app-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   > This will take 1-2 minutes. Around ~370 packages will be installed.

3. **Run the project**
   ```bash
   npm run dev
   ```
   > After starting, you'll see "Ready in ~2s" message

4. **Open in browser**
   - Navigate to: `http://localhost:3000`
   - Use demo accounts to login (see below)

5. **For production build:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔑 Demo Accounts

For testing, use these pre-configured accounts:

| Username | Password | Description |
|----------|----------|-------------|
| `admin`  | `admin123` | Business professional with work and home tasks |
| `demo`   | `demo123` | Student with school and home tasks |

> **Note:** 
> - Each user has their own separate task list
> - Tasks are stored per user in localStorage
> - Passwords are securely hashed using bcrypt
> - In production, implement a proper user registration system with a database

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main todo app page (with auth)
│   ├── login/
│   │   └── page.tsx      # Login page component
│   ├── layout.tsx        # Root layout with theme provider
│   └── globals.css       # Global styles & theme variables
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
└── lib/
    ├── auth.ts           # Authentication utilities (bcrypt)
    └── utils.ts          # Utility functions
```

---

## 🎯 Key Features Explained

### Task Management
- **Create**: Fill in task name, select category & priority, click "Add Task"
- **Edit**: Double-click task text or click "Edit" button
- **Complete**: Check the checkbox to mark as done (shows strikethrough + "Done" badge)
- **Delete**: Click "Remove" button to delete task
- **User Isolation**: Each user has their own separate task list (stored as `denys-todo-app-tasks-{username}`)

### Progress Tracking
- **Overall Progress**: Top card shows total completion percentage
- **Category Progress**: Each column displays its own completion stats with progress bar
- **Visual Feedback**: Completed tasks appear dimmed with strikethrough text

### Authentication
- Secure password storage using bcrypt (salt rounds: 10)
- Session persists in localStorage for 24 hours
- Automatic logout after session expiration
- Toast notifications for login/logout events

---

## 🔮 Future Enhancements

- 🗄️ Database integration (PostgreSQL/MongoDB)
- 👥 Multi-user support with user registration
- 📅 Due dates and reminders
- 🏷️ Custom tags and labels
- 🔍 Search and filter functionality
- 📤 Export tasks to JSON/CSV
- 🎨 Custom themes and color schemes
- 📱 Progressive Web App (PWA) support
- 🔔 Push notifications
- 📊 Analytics and insights dashboard

---

## 🐛 Known Issues

- Tasks are stored per device (localStorage) - not synced across devices
- No password recovery system (demo only)
- Limited to 3 fixed categories

---

---

## 🎓 What I Learned

### New Technologies and Concepts

1. **Next.js 15 & React 19**
   - Server Components and Client Components
   - App Router (new folder structure)
   - Turbopack for fast development
   - Production build optimization

2. **TypeScript**
   - Strong data typing
   - Interfaces and types (Task, Category, Priority)
   - Type safety across the entire application
   - Compile error handling

3. **Security**
   - **bcryptjs** - password hashing (10 salt rounds)
   - User data protection
   - Session management with localStorage
   - Data isolation between users

4. **State Management**
   - React hooks: `useState`, `useEffect`
   - Application state management
   - localStorage synchronization
   - User-specific data handling

5. **UI/UX Design**
   - **shadcn/ui** - modern component library
   - **Tailwind CSS v4** - utility-first styling
   - Dark/Light theme with next-themes
   - Responsive design for mobile devices
   - Smooth animations and transitions

6. **Working with Data**
   - localStorage API
   - JSON serialization/deserialization
   - Data validation and filtering
   - User-specific storage keys

---

## 💪 Challenges Faced

### 1. **bcrypt Hash Issues**
**Problem:** Initially used online generators to create bcrypt hashes, but they didn't work with bcryptjs.

**Solution:** Created a Node.js script to generate proper hashes:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('password123', 10);
```

**Lesson:** Always use the same library for generating and verifying hashes.

---

### 2. **TypeScript Compilation Errors**
**Problem:** Next.js 15 strictly checks page types and props.

```
Type 'OmitWithTag<LoginPageProps, keyof PageProps...'
```

**Solution:** Moved LoginPage from `app/login/page.tsx` to `components/LoginPage.tsx`, since it's not a route page but a regular component.

**Lesson:** Understanding the difference between Page components and regular React components in Next.js.

---

### 3. **User-specific Data**
**Problem:** Initially, all users saw the same tasks.

**Solution:** Implemented user-specific storage keys:
```typescript
const getUserStorageKey = (username: string) => 
  `denys-todo-app-tasks-${username}`;
```

**Lesson:** The importance of data isolation in multi-user applications.

---

### 4. **State Management on Logout**
**Problem:** Old tasks remained in the UI after logout.

**Solution:** Added state cleanup:
```typescript
const handleLogout = () => {
  clearSession();
  setTasksArray([]); // Clear tasks!
  setUsername('');
};
```

**Lesson:** Always clear sensitive data on logout.

---

### 5. **Responsive Design Challenges**
**Problem:** Layout broke on mobile devices.

**Solution:** Used Tailwind breakpoints:
```tsx
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

**Lesson:** Mobile-first approach and testing on different screen sizes.

---

### 6. **Production Build Optimization**
**Problem:** Large bundle size initially.

**Solution:** 
- Removed unused dependencies (pg, dotenv)
- Combined components into one file
- Next.js automatically optimized the code

**Result:** First Load JS = 161 KB (excellent!)

---

## 🐛 Bugs Encountered

### 1. **Invalid username or password (after deployment)**
- **Cause:** Incorrect bcrypt hashes
- **Fix:** Regenerated hashes using bcryptjs
- **Time:** ~30 minutes debugging

### 2. **Tasks weren't saving**
- **Cause:** Forgot to pass `username` to `saveTasks()`
- **Fix:** Updated function signature
- **Time:** ~15 minutes

### 3. **Theme wasn't switching**
- **Cause:** Missing `suppressHydrationWarning` in `<html>`
- **Fix:** Added attribute in layout.tsx
- **Time:** ~20 minutes

### 4. **Build failed: lint errors**
- **Cause:** Unused variable `getCategoryConfig`
- **Fix:** Removed unnecessary code
- **Time:** ~5 minutes

### 5. **Checkbox didn't work**
- **Cause:** Component not installed from shadcn/ui
- **Fix:** `npx shadcn@latest add checkbox`
- **Time:** ~10 minutes

---

## 🚢 Deployment

This app can be easily deployed to:

- **Vercel** (recommended for Next.js)
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**
  ```bash
  npm run build
  # Deploy the .next folder
  ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📬 Contact

**Denys Koval**  
IT & Media Production Student | 🇺🇦 → 🇳🇴

- 💼 [LinkedIn](https://www.linkedin.com/in/denys-koval-8b219223a/)
- 📱 [Telegram](https://t.me/kovaldenys1)
- 🐙 [GitHub](https://github.com/KovalDenys1)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Lucide Icons](https://lucide.dev/) - Icon set
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [bcrypt](https://www.npmjs.com/package/bcryptjs) - Password hashing

---

<div align="center">

**⭐ Star this repo if you find it useful!**

Made with ❤️ by [Denys Koval](https://github.com/KovalDenys1)

</div>