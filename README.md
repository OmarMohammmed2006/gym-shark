# GymTrack — Omar's Fitness System

A full gym self-tracking website with Supabase database backend.
Works on **phone + PC** — data syncs automatically via Supabase cloud.

---

## 🛠 One-Time Setup (do this once)

### 1. Create Supabase tables

1. Go to [supabase.com](https://supabase.com) → your project → **SQL Editor**
2. Click **New Query**
3. Paste the contents of `supabase_setup.sql`
4. Click **Run**

You should see: `✓ Setup complete! All tables created.`

### 2. Deploy to GitHub Pages

1. Push this folder to a GitHub repo
2. Go to repo **Settings → Pages**
3. Set source to `main` branch, root folder
4. Your site will be at `https://yourusername.github.io/gym`

---

## 🔐 Login

- **Username:** omar
- **Password:** omar12345

---

## 📱 Features

| Tab | What it does |
|-----|-------------|
| **Dashboard** | Today's stats, streak, next workout, charts |
| **Workout** | Fixed-sequence trainer with set-by-set checkboxes |
| **Calories** | Log daily kcal with ring display + history chart |
| **Calendar** | Monthly view with color-coded training days |
| **Weight** | Weekly weigh-in with trend chart |

### Workout Sequence (fixed, auto-advances)
1. Upper A — Chest · Back · Biceps
2. Lower A — Quads · Hamstrings · Glutes · Calves
3. Upper B — Shoulders · Triceps · Upper Back
4. Lower B — Deadlift · Quads · Hamstrings

### Notifications
- Missing calorie log (after 6 PM)
- Missing weekly weight entry
- No workouts this week (Thursday+)
- Weekly weight prompt toast

---

## 🗂 File Structure

```
gym/
├── index.html          ← Main SPA
├── style.css           ← Dark/gold gym aesthetic
├── app.js              ← All logic + Supabase integration
├── supabase_setup.sql  ← Run once in Supabase SQL Editor
├── .gitignore
└── README.md
```
