# Bible Pathways Web Application

A responsive web application for exploring topical Bible studies through the **King James Version (KJV)** Bible. The application organizes Scripture into 49 topical studies, provides real-time Bible verse retrieval through a REST API, and offers QR code access for church communities.

## Live Demo

**Application:** https://YOUR-NETLIFY-LINK.netlify.app

## Features

- 49 organized topical Bible studies
- Dynamic King James Version (KJV) Scripture retrieval using the Bible API
- Real-time search by topic, study title, or Bible reference
- Responsive interface for desktop, tablet, and mobile devices
- QR code access for convenient use during church services and Bible study
- Deployed publicly using Netlify

## Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- REST API
- Netlify

## Screenshots

### Home Page

(Add homepage screenshot here)

### Search

(Add search screenshot here)

### Scripture View

(Add verse view screenshot here)

## Architecture

```
User
   │
   ▼
Browser
   │
   ▼
JavaScript Application
   │
   ├── studies.json
   │
   └── Bible API
            │
            ▼
     Scripture Retrieval
            │
            ▼
        Rendered UI
```

## Project Structure

```
Bible-Pathways-Web-Application/
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── data/
│   └── studies.json
│
├── screenshots/
│
├── index.html
│
└── README.md
```

## Real-World Usage

The application was developed for a church community and is distributed through a single QR code, allowing members to instantly access all topical Bible studies from any smartphone without installing an app.


