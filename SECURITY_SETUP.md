# Security Setup Guide

This guide explains how to protect sensitive data like database passwords from being pushed to GitHub.

## ✅ What I've Done

### 1. Added config.json to .gitignore
- `backend/config/config.json` is now ignored by Git
- Your database password won't be pushed to GitHub

### 2. Created config template
- `backend/config/config.json.template` - Safe template without real passwords
- Team members can copy this and add their own passwords

### 3. Migrated to Environment Variables
- Database configuration now uses environment variables
- No more hardcoded passwords in code

## 🔧 How to Set Up

### Step 1: Create Backend .env File

Create `backend/.env` with your database credentials:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=airbnb_db
DB_USER=root
DB_PASSWORD=911105

# Backend Configuration
PORT=5000
NODE_ENV=development
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your-very-long-random-secret-key-here

# File Upload
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

### Step 2: Create Frontend .env File

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AGENT_URL=http://localhost:5005
```

### Step 3: Update Your Existing config.json

Your current `backend/config/config.json` will still work, but now you can:

1. **Keep using it** (it's ignored by Git now)
2. **Or delete it** and use environment variables only

## 🛡️ Security Benefits

### Before (Insecure):
```json
{
  "development": {
    "password": "911105"  // ❌ Exposed in Git
  }
}
```

### After (Secure):
```env
DB_PASSWORD=911105  # ✅ In .env (ignored by Git)
```

## 📁 Files Protected

The following files are now ignored by Git:
- `backend/config/config.json` - Contains your database password
- `.env` files - Environment variables
- `backend/.env` - Backend environment variables
- `frontend/.env` - Frontend environment variables

## 🔄 Migration Steps

### Option 1: Keep config.json (Recommended for now)
1. Your current setup will continue working
2. `config.json` is now protected from Git
3. Gradually migrate to environment variables

### Option 2: Full Migration to Environment Variables
1. Create the `.env` files above
2. Delete `backend/config/config.json`
3. Restart your backend server

## 🚨 Important Security Notes

### Never Commit These Files:
- ❌ `backend/config/config.json`
- ❌ `.env` files
- ❌ Any file with passwords/keys

### Always Use These Instead:
- ✅ `backend/config/config.json.template`
- ✅ `.env.example` files
- ✅ Environment variables

## 🧪 Testing

### Test Your Setup:
1. **Create .env files** with your credentials
2. **Restart backend server**
3. **Check if database connects** properly
4. **Verify no sensitive data** in Git status

### Check Git Status:
```bash
git status
# Should NOT show:
# - backend/config/config.json
# - .env files
```

## 🎯 Next Steps

1. **Create your .env files** using the templates above
2. **Test your application** to ensure it works
3. **Commit your changes** (sensitive files are now protected)
4. **Share the template files** with your team

## 📋 Team Collaboration

### For New Team Members:
1. Copy `backend/config/config.json.template` to `backend/config/config.json`
2. Add their own database password
3. Create their own `.env` files
4. Never commit the real `config.json`

### For Production:
1. Use production environment variables
2. Use strong, unique passwords
3. Use secure hosting environment variable systems

Your sensitive data is now protected! 🔐
