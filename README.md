# Headline Central 📰

A high-performance modern digital magazine & blog built with **Nuxt 3**, **Tailwind CSS CLI**, and custom **Yberry Warm Amber/Terracotta design palette**.

---

## 🎨 Visual Identity & Design System (Image 3)

- **Typography**: `Poppins` font family downloaded directly to the local build (`/public/fonts/` + `assets/css/fonts.css`), zero external Google CDN dependencies at runtime.
  - **Desktop Heading**: Poppins Medium, 40px (`leading-[1.2]`)
  - **Mobile Heading**: Poppins Medium, 32px (`leading-[1.25]`)
  - **Subheading**: Poppins Regular, 24px (`leading-[1.3]`)
  - **Body Text**: Poppins Regular, 16px (`leading-[1.5]`)
- **Custom Yberry Palette**:
  - `yberry-100`: `#feeee6`
  - `yberry-200`: `#fcdccc`
  - `yberry-300`: `#facbb4`
  - `yberry-400`: `#f8b99a`
  - `yberry-500`: `#f7a881`
  - `yberry-600`: `#f59767`
  - `yberry-700`: `#f4864e`
  - `yberry-800`: `#f17435`
  - `yberry-900`: `#f0631c`
  - `yberry-1000`: `#ee5102`
- **Button System**:
  - **Primary Button**: Solid `#ee5102`, pill-shaped (`rounded-full`), white text (`.btn-primary`).
  - **Primary Hover**: Soft `#facbb4` / `#fcdccc` background with dark `#111827` text.
  - **Secondary Button**: Crisp white background, `#111827` outline, dark text (`.btn-secondary`).
  - **Secondary Hover**: Soft `#fcdccc` background with orange `#ee5102` border.

---

## 🧭 Site Structure (Images 1 & 2)

### Core Categories
1. **Technology** (`/categories/technology`)
2. **Home and DIY** (`/categories/home-and-diy`)
3. **Food** (`/categories/food`)
4. **Parenting** (`/categories/parenting`)

### Complete Page Index
| Page | Route | Purpose |
| :--- | :--- | :--- |
| **Homepage** | `/` | Introduce the blog and showcase popular content |
| **Blog** | `/blog` | Display all published articles with search, tags & category filtering |
| **Categories Directory** | `/categories` | Organise articles by subject hub |
| **Category Specific** | `/categories/[slug]` | Dedicated subject hub with articles and topic metrics |
| **Individual Articles** | `/blog/[slug]` | High-impact SEO page with reading progress, Table of Contents, author bio & natural ad positions |
| **About Us** | `/about` | Establish credibility, journalistic independence, fact-checking and masthead |
| **Contact** | `/contact` | Provide contact method for story pitches, press, corrections and advertising |
| **Privacy Policy** | `/privacy` | Detail data collection practices, cookies, and transparent advertising disclosure |
| **Terms and Conditions** | `/terms` | Set website usage terms, licensing, user conduct, and disclaimers |

### Homepage Layout
1. **Professional logo & navigation**: Brand mark with category pills, live search modal, date ticker, and newsletter button.
2. **Featured article with large image**: Large hero banner with category tag, excerpt, author meta, and primary CTA.
3. **Popular articles**: Numbered 01–04 leaderboard cards with views and reading time.
4. **Main content categories**: 4 curated visual hubs with custom high-res photography.
5. **Latest articles in a grid**: Responsive card grid with tags, reading times, and authors.
6. **Newsletter subscription**: High-conversion daily dispatch sign-up with instant feedback.
7. **Footer with legal pages & social links**: Complete directory, editorial links, social channels, and copyright.

### Individual Article Layout
- Article title and introduction (deck)
- Author information and publication date
- Large featured image with caption
- Interactive Table of Contents with active scroll spy
- Main article with descriptive headings (`H2`, `H3`) and callout insights
- High-resolution editorial photography generated via Imagen 3 / Nano Banana Pro
- Related articles grid
- Full author biography card
- Natural advertisement positions (Top leaderboard, in-article sponsor break, sticky sidebar 300x250, and bottom leaderboard)

---

## 🚀 Development & Build Commands

```bash
# Start development server
npm run dev

# Run Tailwind CSS CLI build directly
npm run tailwind:build

# Watch Tailwind CSS CLI
npm run tailwind:watch

# Build production server
npm run build

# Preview production build
node .output/server/index.mjs
```

