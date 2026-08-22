# 🛡️ JobGuard — Scam/Fake Job Posting Detector

Built for **Into the Scrape-Verse** hackathon (WeMakeDevs × Bright Data), Aug 17–23, 2026.

**🔗 Live site:** https://rafianoor5.github.io/jobguard-scrapeverse/

![JobGuard homepage](image/homepage.png)

## The Problem
Students and fresh graduates in Pakistan are frequently targeted by fake job
and internship postings — "pay to apply" scams, listings with no verifiable
company, symbolic salaries (like "1 PKR"), and unrealistic promises. These
posts are scattered across job boards and social media, making it hard to
tell real opportunities from scams at a glance.

## The Solution
A scraper built in **Bright Data Scraper Studio**, using two separate
collectors, that:
1. Pulls job/internship listings from **Rozee.pk** and **Mustakbil.com**
   across multiple search terms.
2. Self-heals when a page's structure doesn't match expectations, instead
   of crashing — recovering clean data even when many individual pages fail.
3. Feeds a rule-based scam-detection engine that scores each listing and
   flags red flags in plain language.
4. Displays results in a clean, filterable, searchable dashboard.

## Self-Healing in Numbers
Across our scraper runs, we hit real inconsistency in page structures on
Rozee.pk — some pages timed out, some had different layouts than expected.
Rather than crashing, Scraper Studio recovered cleanly. A second collector
built for Mustakbil.com (a structurally different site) proved the
extraction approach adapts across sites entirely:

| Source | Pages attempted | Listings recovered | Success rate |
|---|---|---|---|
| Rozee.pk — search run 1 | 21 | 8 | 38% |
| Rozee.pk — category pages | 321 | 11 | 3% |
| Rozee.pk — search run 2 (6 keywords) | 575 | 71 | 12% |
| Mustakbil.com — collector 1 | 20 | 20 | **100%** |
| Mustakbil.com — collector 2 | 69 | 69 | **100%** |
| **Final deduped total** | **1,000+** | **152** | — |

The contrast is the point: on Rozee.pk, inconsistent page layouts caused
heavy failure rates, but self-healing still recovered usable data instead
of returning nothing. On Mustakbil.com, once the schema was tuned to that
site's structure, extraction ran at a clean **100% success rate** — 89
listings recovered from 89 attempts across two collector runs, with zero
failed crawls. That's the two sides of self-healing: graceful recovery
under failure, and reliable extraction once adapted.

## Scam Detection Logic
Each listing is scored against weighted rules, with a resulting confidence
score (0–10) shown for flagged listings:

| Rule | Weight | What it catches |
|---|---|---|
| Payment/fee to apply or start | 3 | "Pay to apply" scams |
| Symbolic/near-zero salary (e.g. "1 PKR") | 3 | Fake or non-serious postings |
| Program/training fee required | 3 | Pay-to-join internship scams |
| Unrealistic pay promises | 3 | "Guaranteed high pay, no experience" |
| Vague description (<20 words) | 2 | Low-effort/copy-paste postings |
| No listed requirements | 1 | Missing qualification details |
| Urgency/pressure language | 1 | "Apply immediately, limited seats" |

A listing scoring 3+ is flagged **Suspicious**; otherwise **Verified**.
This logic lives in `assets/app.js` and is easy to extend with more rules.

## Real Examples Caught
- **"Online Graphic Designer Intern"** — description explicitly states a
  salary of "1 PKR," caught by the symbolic-salary rule.
- **"Online Summer Internship Program 2026"** — requires a one-time
  "program fee" of PKR 15,000 to join, caught by the payment-fee rule.
- **"Customer Service / Sales Internship – US Inbound"** — mentions a fee
  to apply/start, caught by the pay-to-apply rule.

## Tech Stack
- **Data layer:** Bright Data Scraper Studio (collector + self-healing extraction)
- **Frontend:** HTML / CSS / vanilla JS (no build step, fast to demo)
- **Hosting:** GitHub Pages (static site)
- **Logic:** Client-side rule-based scoring with a confidence score

## Project Structure
```
jobguard-scrapeverse/
├── index.html            # main dashboard
├── assets/
│   ├── style.css           # styling and animations
│   └── app.js                # fetch, scoring rules, search/sort, render logic
├── data/
│   └── listings.json         # real scraped Rozee.pk data (83 listings)
└── README.md
```

## Running Locally
Open `index.html` directly in a browser, or serve it:
```bash
npx serve .
```
Or visit the live GitHub Pages link above.

## Future Work
This was built solo in one week — a few directions it could grow:
- **More sources:** add other Pakistani job boards (e.g. Mustakbil) using
  the same field schema, to prove self-healing across different site
  structures, not just one.
- **Smarter detection:** move from keyword-based rules to a lightweight
  ML classifier trained on labeled real/scam listing examples.
- **Alerts:** a browser extension or WhatsApp bot that checks a listing
  URL on demand and returns a risk score instantly.
- **Community reporting:** let users flag listings themselves to improve
  the rule set over time.

## Ethical Note
Scoring is rule-based and not a guarantee — the dashboard should always
encourage users to independently verify listings, not replace their judgment.

## Judging Criteria This Targets
- **Potential impact** — protects students from real financial/personal risk
- **Creativity** — goes beyond scrape-and-display into a scoring engine
- **Technical excellence** — rule-based logic layer, search/sort, live deployment
- **Reliability & self-healing** — backed by real numbers (1,000+ pages across 2 sites, 152 recovered)
- **Presentation** — polished UI, Verified vs Suspicious instantly understandable
