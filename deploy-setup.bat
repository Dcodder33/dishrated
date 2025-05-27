@echo off
echo 🚀 Setting up DishRated for deployment...

REM Check if we're in the right directory
if not exist "frontend" (
    if not exist "backend" (
        echo ❌ Please run this script from the root of your DishRated project
        pause
        exit /b 1
    )
)

echo 📁 Current directory structure:
dir /b

REM Create .gitignore for root if it doesn't exist
if not exist ".gitignore" (
    echo 📝 Creating root .gitignore...
    (
        echo # Dependencies
        echo node_modules/
        echo npm-debug.log*
        echo yarn-debug.log*
        echo yarn-error.log*
        echo.
        echo # Environment variables
        echo .env
        echo .env.local
        echo .env.development.local
        echo .env.test.local
        echo .env.production.local
        echo.
        echo # Build outputs
        echo dist/
        echo build/
        echo.
        echo # IDE
        echo .vscode/
        echo .idea/
        echo *.swp
        echo *.swo
        echo.
        echo # OS
        echo .DS_Store
        echo Thumbs.db
        echo.
        echo # Logs
        echo logs
        echo *.log
    ) > .gitignore
)

REM Update backend .env.example
echo 📝 Creating backend environment example...
(
    echo # Server Configuration
    echo NODE_ENV=production
    echo PORT=5000
    echo.
    echo # Database
    echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dishrated?retryWrites=true^&w=majority
    echo.
    echo # JWT
    echo JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
    echo.
    echo # CORS
    echo CORS_ORIGIN=https://your-frontend-domain.vercel.app
    echo.
    echo # Rate Limiting
    echo RATE_LIMIT_WINDOW_MS=900000
    echo RATE_LIMIT_MAX_REQUESTS=100
) > backend\.env.example

REM Update frontend .env.example
echo 📝 Creating frontend environment example...
(
    echo # API Configuration
    echo VITE_API_URL=https://your-backend-domain.railway.app/api
    echo.
    echo # Optional: Analytics ^(for future features^)
    echo # VITE_GA_TRACKING_ID=G-XXXXXXXXXX
    echo.
    echo # Optional: Maps API ^(if using Google Maps instead of OpenStreetMap^)
    echo # VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
) > frontend\.env.example

echo ✅ Deployment setup complete!
echo.
echo 📋 Next steps:
echo 1. Copy backend\.env.example to backend\.env and fill in your values
echo 2. Copy frontend\.env.example to frontend\.env and fill in your values
echo 3. Test locally: npm run dev ^(in both frontend and backend directories^)
echo 4. Commit and push to GitHub
echo 5. Follow the DEPLOYMENT_GUIDE.md for platform-specific instructions
echo.
echo 📖 Read DEPLOYMENT_GUIDE.md for detailed instructions!
echo.
pause
