# Environment Configuration Guide

This guide explains how to configure the application using environment variables instead of hardcoded URLs and ports.

## Backend Configuration

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Backend Environment Variables
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=airbnb_db
DB_USER=root
DB_PASSWORD=911105

# Backend URL (for image URLs)
BACKEND_URL=http://localhost:5000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Session Configuration
SESSION_SECRET=your-session-secret-key-here

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

## Frontend Configuration

Create a `.env` file in the `frontend/` directory with the following variables:

```env
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AGENT_URL=http://localhost:5005
```

## How to Use

### 1. Create Environment Files

**Backend:**
```bash
cd backend
cp .env.example .env  # If you create a .env.example file
# Or create .env manually with the variables above
```

**Frontend:**
```bash
cd frontend
cp .env.example .env  # If you create a .env.example file
# Or create .env manually with the variables above
```

### 2. Modify Ports/URLs

To change the backend port from 5000 to 5001:

**Backend .env:**
```env
PORT=5001
BACKEND_URL=http://localhost:5001
```

**Frontend .env:**
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_BACKEND_URL=http://localhost:5001
```

### 3. Production Configuration

For production, update the URLs to your actual domain:

**Backend .env:**
```env
PORT=5000
NODE_ENV=production
BACKEND_URL=https://your-api-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend .env:**
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_BACKEND_URL=https://your-api-domain.com
```

## Files Updated

The following files have been updated to use environment variables:

### Frontend Files:
- `src/services/api.js` - API base URL
- `src/utils/imageUtils.js` - Backend URL for images
- `src/components/traveler/PropertyDetails.jsx` - API URL for blocked dates
- `src/components/agent/AgentPanel.jsx` - API and Agent URLs

### Backend Files:
- `server.js` - CORS origin URL
- `controllers/propertyController.js` - Already using process.env.BACKEND_URL
- `controllers/authController.js` - Already using process.env.BACKEND_URL

## Benefits

1. **Easy Configuration**: Change ports/URLs by editing .env files only
2. **Environment-Specific**: Different configs for development, staging, production
3. **Security**: Sensitive data like database passwords in environment variables
4. **No Code Changes**: Modify configuration without touching source code
5. **Team Collaboration**: Each developer can have their own .env file

## Important Notes

- **Frontend**: React environment variables must start with `REACT_APP_`
- **Backend**: Node.js environment variables can be any name
- **Security**: Never commit .env files to version control
- **Fallbacks**: All environment variables have fallback values for development
