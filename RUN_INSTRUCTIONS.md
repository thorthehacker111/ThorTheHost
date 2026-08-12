# How to Run ThorTheHost locally

To start the full ThorTheHost application locally on your Windows machine, you need to run three separate processes. It's recommended to open three separate Terminal/PowerShell tabs.

## 1. Start the Backend API (FastAPI)
This serves the API on `http://127.0.0.1:8000`.

```powershell
cd C:\Users\Admin\Desktop\ThorTheHost\backend
.\.venv\Scripts\activate
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## 2. Start the Frontend (Vite/React)
This serves the UI on `http://localhost:5173`.

```powershell
cd C:\Users\Admin\Desktop\ThorTheHost\frontend
npm run dev
```
*(If you ever add new packages to `package.json`, remember to run `npm install` first).*

## 3. (Optional) Start the Background Worker
If you are testing the email forwarding queue from Phase 5, you need to run the worker in a third tab. (Ensure Redis is running on your machine).

```powershell
cd C:\Users\Admin\Desktop\ThorTheHost\backend
.\.venv\Scripts\activate
python worker.py
```

---
**Note:** If you are exposing your application to the internet using Cloudflare Tunnels (as seen in your `command.txt`), ensure the tunnel points to the frontend port (`5173`) or your backend port (`8000`) depending on your reverse proxy setup.
