# HackMate – Your Hackathon Buddy Finder

**Find your perfect hackathon teammate — faster, smarter, and with a swipe!**

HackMate is a fun, Tinder-style web app designed to help developers instantly connect with potential teammates for hackathons. It seamlessly integrates with the **Commudle API** to fetch user data and allows real-time matching, analytics, and queue management through your **custom backend API**.

---

## Project Overview

HackMate helps hackathon participants discover teammates who share similar interests, skills, and goals.
Simply open a profile URL (like `hackmate.dev/hippyaki`), and the system automatically fetches their Commudle profile, extracts useful info like name and tags, and lets others **swipe right or left** to find their ideal hack partner.

---

## Features

* **Username-Based Discovery** – Enter or visit a URL with a Commudle username (e.g. `/hippyaki`) to auto-fetch data.
* **Commudle API Integration** – Pulls user profile details from:
`https://json.commudle.com/api/v2/users?username=<username>`
* **Smart Data Extraction** – Extracts tags, name, bio, and interests for matchmaking.
* **Tinder-Style Swipe UI** – Intuitive swipe interface to like or skip profiles.
* **Custom Backend Sync** – Sends fetched user data to your backend via **POST** for:
    - Match analytics
    - Queue management
    - Activity logging
 * **Mobile-Responsive Design** – Works flawlessly on all devices for hackathon demos.
 * **Hackathon-Ready Setup** – Plug-and-play for live showcases!

---

## Tech Stack

* **Frontend:** React.js + Vite
* **Styling:** Tailwind CSS + Framer Motion (for animations)
* **Backend:** Node.js / Express.js (for analytics and matchmaking queue)
* **API Source:** Commudle JSON API
* **Deployment:** Vercel / Netlify (frontend), Render / Railway (backend)

---

## Submission

**DevFest Build-a-Thon 2025**

> Theme: *Building Tools for Developers & Communities*

HackMate empowers developers to find like-minded hackers and make every hackathon a success story.

---

## Team

* **Project Lead:** [@hippyaki](https://commudle.com/hippyaki)
* **Design & Frontend:** React Team
* **Backend & Analytics:** Node.js Team

---

## Future Scope

* Real-time matchmaking algorithm
* WebSocket-based live swiping
* Skill-level scoring
* Community-based room creation

---