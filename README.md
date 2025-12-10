# Portfolio Website - Edit Guide

This document explains where to edit different sections of your portfolio website.

## File Structure

```
Portfolio/
├── portfolio.jsx           # Main React component (99% of editing happens here)
├── src/
│   ├── index.css          # Global styles and animations
│   └── main.jsx           # React entry point
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite bundler configuration
```

## Editing Guide

### 📝 Personal Profile Information (Hero Section)
**File:** `portfolio.jsx` → Search for `profile` object around line 475-485

**What you can edit:**
- `name`: Your full name
- `designation`: Job title (e.g., "Senior Data Analyst")
- `bio`: Your professional bio/introduction

```jsx
profile: {
    name: "Alex Vercetti",
    designation: "Senior Data Analyst",
    bio: "I'm a data analyst with a passion for..."
}
```

---

### 🛠️ Technologies/Skills Section
**File:** `portfolio.jsx` → Search for `technologies` array around line 488-498

**What you can edit:**
- Add/remove technologies
- Supported icons: Python, SQL, Terminal, ML, Tableau, Excel, PowerBI, R

```jsx
technologies: [
    { name: "Python", icon: "Python" },
    { name: "SQL", icon: "SQL" },
    // Add more technologies here
]
```

---

### 📊 Projects Section
**File:** `portfolio.jsx` → Search for `projects` array around line 500-550

**What you can edit for each project:**
- `id`: Unique identifier (1, 2, 3, etc.)
- `order`: Display order on page
- `name`: Project title
- `description`: Brief project overview
- `repositoryUrl`: GitHub repository link
- `imageUrl`: Project image/dashboard screenshot URL
- `keySteps`: Array of steps/process points (1-5 items)

```jsx
{
    id: '1',
    order: 1,
    name: "E-commerce Customer Churn Prediction",
    description: "Developed an end-to-end ML pipeline...",
    repositoryUrl: "https://github.com/...",
    imageUrl: "https://...",
    keySteps: [
        "Step 1 description",
        "Step 2 description",
        // Add more steps
    ]
}
```

---

### 🎨 Colors & Theme
**File:** `portfolio.jsx` → Search for color hex codes

**Current Palette:**
- **Primary Accent (Lavender):** `#B39CD0`
- **Secondary Accent (Cyan):** `#A8DADC`
- **Tertiary Accent (Peach):** `#F4A7A1`
- **Dark Background:** `#2C2C2C`
- **Dark Text:** `#E4E4E4`
- **Light Background:** `#dce2eb`, `#dfe4ed`, `#d6deea`

To change colors globally:
1. Find and replace the hex code in `portfolio.jsx`
2. Example: Replace all `#B39CD0` with your new color

---

### ✉️ Contact Section
**File:** `portfolio.jsx` → Search for `Contact` component around line 430-495

**What you can edit:**
- Section heading: "Get In Touch"
- Description text
- Form field labels (Name, Email, Message)
- Button text: "Send Message"

Messages are saved to browser's `localStorage` under the key `contact_messages`.

---

### 🔗 Social Links & Navigation
**File:** `portfolio.jsx` → Search for `Header` or `NavItem` components around line 690-800

**What you can edit:**
- Email address: Search for `mailto:your.email@example.com`
- LinkedIn: Replace `https://linkedin.com/in/yourprofile`
- GitHub: Replace `https://github.com/yourusername`
- Navigation items in the sidebar/header

---

### 🎬 Animations
**File:** `src/index.css` → Lines 28-60

**Available animations:**
- `.animate-fade-in-up`: Initial fade-in animation (used on hero section)
- `.fade-scroll`: Scroll-triggered fade-in (used on projects/contact with `useFadeOnScroll` hook)

**To adjust timing:**
- Change `0.6s` to make animations faster/slower
- Change `ease-out` to different easing functions: `ease`, `ease-in`, `ease-in-out`, `linear`

---

### 🌐 Light/Dark Mode
**File:** `portfolio.jsx` → Background and text colors use `dark:` prefix

**How it works:**
- Light mode: Default colors (e.g., `bg-white`, `text-gray-900`)
- Dark mode: Colors with `dark:` prefix (e.g., `dark:bg-gray-900`, `dark:text-white`)

Toggle button is in the top-right corner (sun/moon icon).

---

### 📱 Responsive Design
**File:** All components use Tailwind CSS breakpoints

**Breakpoints used:**
- `sm:` - Small screens (640px+)
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)

To make elements responsive, use these prefixes in className.

---

## Running the Development Server

```bash
npm run dev
```

Then open `http://localhost:5173` (or the port shown in terminal) in your browser.

---

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder—ready to deploy!

---

## Key Components

### `SectionTitle`
Section headings with underline decoration. Used for "Key Analytical Projects", "Get In Touch", etc.

### `AnimatedButton`
Reusable button component with hover animations. Variants: `primary`, `secondary`, `danger`

### `ProjectCard`
Displays individual project with image, description, and key steps. Responsive layout.

### `TechnologyBar`
Grid of technology icons with hover effects.

### `Hero`
Landing section with name, title, bio, and scroll indicator.

---

## Helpful Tips

1. **Profile Data**: All profile/projects data is stored in localStorage. Clear browser cache to reset to defaults.

2. **Colors**: Use [color-hex.com](https://color-hex.com) to find hex codes for colors.

3. **Image URLs**: Use free image services like:
   - Unsplash: `https://unsplash.com/`
   - Pexels: `https://pexels.com/`
   - Placeholder: `https://placehold.co/`

4. **Icons**: Uses Lucide React icons. Check available icons at [lucide.dev](https://lucide.dev)

5. **Test Dark Mode**: Click the sun/moon icon in the top-right corner to toggle between light and dark themes.

---

## Need Help?

- Check the comments in `portfolio.jsx` for component explanations
- Tailwind CSS docs: [tailwindcss.com](https://tailwindcss.com)
- React docs: [react.dev](https://react.dev)
- Vite docs: [vitejs.dev](https://vitejs.dev)
