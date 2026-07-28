# Personal Portfolio Website (affanbinusman.github.io)

This is the source code for my personal portfolio website, featuring a responsive 2-column layout, interactive project carousels, dynamic experience duration calculations, and automated Google Scholar citation metrics.

Built with **HTML5**, **Vanilla CSS**, and **JavaScript (ES6)**.

---

## 🌐 View Live

You can view the live deployed website at:  
👉 **[https://affanbinusman.github.io/](https://affanbinusman.github.io/)**

---

## 🚀 Running Locally

### Option 1: Using Python Simple Server (Quickest)
Since content is loaded dynamically via `fetch()` from JSON files, run a local web server:

```bash
python3 -m http.server 8080
```
Open your browser and navigate to: **[http://localhost:8080](http://localhost:8080)**

### Option 2: Using Docker
Ensure Docker Desktop is running, then execute:

```bash
docker-compose up -d
```
Open your browser and navigate to: **[http://localhost:8080](http://localhost:8080)**

To stop the container:
```bash
docker-compose down
```

---

## 📂 Project Structure

```text
.
├── index.html                   # Main entry point & HTML structure
├── assets/
│   ├── css/style.css            # Custom CSS styling (dark sidebar & glassmorphism theme)
│   ├── js/main.js               # Core logic (data fetching, modal carousels, duration counter)
│   └── images/
│       ├── logos/               # Company & institution logos (Gatik, Honda, ASU, IRL, Jenius)
│       └── myimages/            # Profile photo & project screenshots
├── data/
│   ├── profile.json             # Personal details & contact info
│   ├── experience.json          # Work experience history & keyword chips
│   ├── education_pubs.json      # Education history & publication/patent details
│   ├── projects.json            # Project portfolio data & image carousel arrays
│   ├── skills.json              # Categorized skills (AI/ML, Model Engineering, Frameworks, etc.)
│   └── scholar.json             # Google Scholar citation count (auto-updated)
├── scripts/
│   └── fetch_scholar.py         # Python scraper for Google Scholar citation metrics
└── .github/workflows/
    └── update_scholar.yml       # GitHub Action running fetch_scholar.py on a weekly schedule
```

---

## 🛠️ Content Updates

- **Updating Experience / Skills / Projects:** Edit the corresponding JSON file inside the `data/` directory. Changes render automatically on refresh without altering HTML.
- **Updating Google Scholar Citations:** Run `python3 scripts/fetch_scholar.py` or let the automated GitHub Action handle weekly updates.

