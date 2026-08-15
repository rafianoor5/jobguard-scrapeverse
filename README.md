# 🛡️ JobGuard — Scam/Fake Job Posting Detector

Built for **Into the Scrape-Verse** hackathon (WeMakeDevs × Bright Data), Aug 17–23, 2026.

## The Problem
Students and fresh graduates in Pakistan are frequently targeted by fake job
and internship postings — "pay to apply" scams, listings with no verifiable
company, and unrealistic salary promises. These posts are scattered across
Facebook groups, job boards, and social media, making it hard to tell real
opportunities from scams at a glance.

## The Solution
A scraper built in **Bright Data Scraper Studio** that:
1. Pulls job/internship listings from multiple sources (job boards, public
   Facebook job groups, LinkedIn posts).
2. Self-heals when a source changes its page structure, so scanning keeps
   working over time.
3. Feeds a rule-based scam-detection engine that scores each listing and
   flags red flags in plain language (e.g. "Asks for payment", "No
   verifiable company site").
4. Displays results in a clean, filterable dashboard: Verified vs Suspicious.

## Scam Detection Logic
Each listing is scored against weighted rules:
| Rule | Weight | What it catches |
|---|---|---|
| Payment/fee requested | 3 | "Pay to apply" scams |
| No company website | 2 | Unverifiable employers |
| Free-email contact only | 2 | No real corporate domain |
| Unrealistic promises | 2 | "Guaranteed high pay, no experience" |
| Vague description | 1 | Low-effort/copy-paste postings |

A listing scoring 3+ is flagged **Suspicious**; otherwise **Verified**.
This logic lives in `assets/app.js` and is easy to extend with more rules.

## Tech Stack
- **Data layer:** Bright Data Scraper Studio (collector + self-healing extraction)
- **Frontend:** HTML / CSS / vanilla JS (no build step — fast to demo)
- **Logic:** Client-side rule-based scoring (swap for a smarter model later)

## Project Structure
```
scam-job-detector/
├── index.html            # main dashboard
├── assets/
│   ├── style.css           # styling
│   └── app.js               # fetch, scoring rules, render logic
├── data/
│   └── listings.json         # mock data (swap for live collector endpoint)
└── README.md
```

## Running Locally
Open `index.html` directly in a browser, or serve it:
```bash
npx serve .
```

## Hackathon Build Plan
- [ ] Set up Bright Data account + Scraper Studio collector
- [ ] Target 2-3 sources (job board, public FB group post exports, LinkedIn)
- [ ] Describe fields to extract in plain language (title, company, contact, description)
- [ ] Replace `DATA_URL` in `assets/app.js` with the live collector endpoint
- [ ] Tune scoring rules against real scraped listings
- [ ] Test self-healing: simulate a source layout change, confirm recovery
- [ ] Record demo video showing Verified vs Suspicious feed live
- [ ] Write submission description referencing Scraper Studio usage

## Ethical Note
Scoring is rule-based and not a guarantee — the dashboard should always
encourage users to independently verify listings, not replace their judgment.

## Judging Criteria This Targets
- **Potential impact** — protects students from real financial/personal risk
- **Creativity** — goes beyond scrape-and-display into a scoring engine
- **Technical excellence** — rule-based logic layer on top of extraction
- **Reliability & self-healing** — core to the scraping layer
- **Presentation** — Verified vs Suspicious is instantly understandable
