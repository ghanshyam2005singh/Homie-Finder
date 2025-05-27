# 🏠 Homie Finder

**Homie Finder** is a platform where students can post available rooms and others can browse them with trust and transparency. Each student has a complete profile, so parents and roommates can feel confident in their choices.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router, TypeScript)
- **Styling**: Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Authentication**: Firebase Email/OTP (Resend support coming)
- **Image Upload**: Firebase Storage (optional UploadThing)
- **UI**: ShadCN UI / Headless UI
- **Maps (Future)**: Google Maps or Mapbox

## 🔧 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/homie-finder.git
cd homie-finder
npm install @supabase/supabase-js

````

### 2. Install dependencies

```bash
npm install
npm install firebase

```

### 3. Set up Firebase

* Go to [Firebase Console](https://console.firebase.google.com/)
* Create a new project: `Homie Finder`
* Enable:

  * Authentication (Email/Password or Phone)
  * Firestore Database (Start in test mode)
  * Firebase Storage (for image uploads)

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Features (Planned)

* ✅ Student Signup/Login (OTP/Email)
* ✅ Complete Student Profiles
* ✅ Post & Browse Room Listings
* 🕒 Filters by College, Rent, Gender
* 🕒 Parent-Friendly View Mode
* 🕒 Verification Badge
* 🕒 Maps Integration

## 📁 Project Structure (simplified)

```
src/
├── app/
│   ├── page.tsx        // Landing Page
│   └── auth/           // Auth pages
├── components/         // Reusable UI components
├── lib/                // Firebase, utils, etc.
├── styles/             // Global styles
└── types/              // TypeScript interfaces
```

## 🧑‍💻 Contributing

Pull requests and feedback are welcome. For major changes, open an issue first.

## 📄 License

[MIT](LICENSE)

```

---

## Issue
1. Filtering is not working
2. otp is not sending
3. after creating account user will be redirect to upload or download page with upper corner profile icon
4. save users informations in database