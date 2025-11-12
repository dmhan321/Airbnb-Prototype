# Backend Environment Variables Setup Guide

## Quick Start

1. **Copy the example file:**
   ```bash
   cd backend
   cp .env.example .env
   ```

2. **Edit `.env` with your values** (see below)

3. **Never commit `.env` to git!** (it should be in `.gitignore`)

---

## Required Environment Variables

### 1. MongoDB Configuration

**Option A: Using MongoDB URI (Recommended)**
```env
MONGODB_URI=mongodb://127.0.0.1:27017/airbnb_db
```

**Option B: Using Individual Settings**
```env
DB_HOST=127.0.0.1
DB_PORT=27017
DB_NAME=airbnb_db
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/airbnb_db?retryWrites=true&w=majority
```

**For MongoDB with Authentication (Local):**
```env
MONGODB_URI=mongodb://username:password@127.0.0.1:27017/airbnb_db?authSource=admin
```

---

### 2. JWT Authentication

**JWT Secret (REQUIRED):**
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

**Generate a secure secret:**
```bash
# On Linux/Mac:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**JWT Expiration:**
```env
JWT_EXPIRES_IN=7d
```
- Options: `1h`, `24h`, `7d`, `30d`, etc.

---

### 3. Server Configuration

```env
PORT=5000
NODE_ENV=development
```

---

### 4. CORS & URLs

```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000
```

---

### 5. OpenAI API (Optional - for AI Agent)

```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

---

## Complete Example `.env` File

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/airbnb_db

# JWT
JWT_SECRET=my-super-secret-jwt-key-minimum-32-characters-long-for-security
JWT_EXPIRES_IN=7d

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# OpenAI (Optional)
OPENAI_API_KEY=sk-your-key-here
```

---

## Setup Steps

### Step 1: Create `.env` File

**Windows (PowerShell):**
```powershell
cd backend
Copy-Item .env.example .env
```

**Windows (Command Prompt):**
```cmd
cd backend
copy .env.example .env
```

**Linux/Mac:**
```bash
cd backend
cp .env.example .env
```

### Step 2: Edit `.env` File

Open `.env` in your text editor and update:

1. **MongoDB URI** - Make sure MongoDB is running
2. **JWT_SECRET** - Generate a secure random string
3. **JWT_EXPIRES_IN** - Set token expiration (default: 7d)
4. **OPENAI_API_KEY** - If using AI agent feature

### Step 3: Verify MongoDB is Running

**Check if MongoDB is running:**
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl status mongod
# or
brew services list | grep mongodb
```

**Start MongoDB if not running:**
```bash
# Windows
net start MongoDB

# Linux
sudo systemctl start mongod

# Mac (Homebrew)
brew services start mongodb-community
```

### Step 4: Test Configuration

Start the backend server:
```bash
cd backend
npm install  # Install dependencies first
npm start
```

You should see:
```
MongoDB connected successfully
Server is running on port 5000
```

---

## Common Issues

### Issue: "MongoDB connection error"

**Solution:**
1. Make sure MongoDB is running
2. Check `MONGODB_URI` is correct
3. Verify MongoDB port (default: 27017)
4. Check firewall settings

### Issue: "JWT_SECRET is not set"

**Solution:**
1. Make sure `.env` file exists in `backend/` folder
2. Check `JWT_SECRET` is set in `.env`
3. Restart the server after changing `.env`

### Issue: "Cannot find module 'dotenv'"

**Solution:**
```bash
cd backend
npm install dotenv
```

---

## Production Configuration

For production, use stronger secrets and secure MongoDB:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/airbnb_db
JWT_SECRET=<generate-strong-random-secret-64-chars>
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://your-frontend-domain.com
BACKEND_URL=https://your-api-domain.com
```

---

## Security Notes

1. **Never commit `.env` to git** - Add to `.gitignore`
2. **Use strong JWT secrets** - Minimum 32 characters
3. **Use environment-specific values** - Different for dev/staging/prod
4. **Rotate secrets regularly** - Especially in production
5. **Use MongoDB authentication** - In production environments

---

## Verification Checklist

- [ ] `.env` file created in `backend/` folder
- [ ] `MONGODB_URI` or `DB_HOST/DB_PORT/DB_NAME` set
- [ ] `JWT_SECRET` set (strong random string)
- [ ] `JWT_EXPIRES_IN` set
- [ ] `PORT` set (default: 5000)
- [ ] `FRONTEND_URL` matches your frontend port
- [ ] MongoDB is running
- [ ] Server starts without errors



