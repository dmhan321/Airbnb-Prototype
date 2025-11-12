# Quick Setup: backend/.env File

## Step-by-Step Instructions

### 1. Create the `.env` file

**Windows (PowerShell):**
```powershell
cd backend
New-Item -Path .env -ItemType File
```

**Windows (Command Prompt):**
```cmd
cd backend
type nul > .env
```

**Linux/Mac:**
```bash
cd backend
touch .env
```

### 2. Copy this content into your `.env` file:

```env
# ============================================
# Server Configuration
# ============================================
PORT=5000
NODE_ENV=development

# ============================================
# MongoDB Database
# ============================================
# For local MongoDB (default):
MONGODB_URI=mongodb://127.0.0.1:27017/airbnb_db

# ============================================
# JWT Authentication
# ============================================
# IMPORTANT: Change this to a random secret!
# Generate one: openssl rand -base64 32
JWT_SECRET=change-this-to-a-random-secret-key-minimum-32-characters
JWT_EXPIRES_IN=7d

# ============================================
# URLs
# ============================================
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# ============================================
# OpenAI (Optional - for AI Agent)
# ============================================
OPENAI_API_KEY=your-openai-api-key-here
```

### 3. Important: Update JWT_SECRET

**Generate a secure secret:**

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

**Or use an online generator:**
- Visit: https://randomkeygen.com/
- Use a "CodeIgniter Encryption Keys" (256-bit)

Replace `change-this-to-a-random-secret-key-minimum-32-characters` with your generated secret.

---

## Example Complete `.env` File

Here's what your final `.env` file should look like:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=mongodb://127.0.0.1:27017/airbnb_db

JWT_SECRET=aB3xK9mP2qR7vT5wY8zA1bC4dE6fG9hI0jK2lM3nO5pQ7rS9tU1vW3xY5zA7
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

OPENAI_API_KEY=sk-proj-abc123xyz789...
```

---

## Verify Your Setup

1. **Check MongoDB is running:**
   ```bash
   # Windows
   net start MongoDB
   
   # Or check if it's already running
   ```

2. **Test the backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

   You should see:
   ```
   MongoDB connected successfully
   Server is running on port 5000
   ```

---

## Troubleshooting

### "Cannot find module 'dotenv'"
```bash
cd backend
npm install
```

### "MongoDB connection error"
- Make sure MongoDB is installed and running
- Check `MONGODB_URI` is correct
- Try: `mongodb://localhost:27017/airbnb_db` instead of `127.0.0.1`

### "JWT_SECRET is not set"
- Make sure `.env` file is in the `backend/` folder (not root)
- Check there are no spaces around the `=` sign
- Restart the server after changing `.env`

---

## File Location

Your `.env` file should be here:
```
Airbnb-Prototype/
└── backend/
    ├── .env          ← HERE
    ├── .env.example
    ├── server.js
    └── ...
```

---

## Security Reminder

⚠️ **NEVER commit `.env` to git!** It should already be in `.gitignore`.



