#!/bin/bash

# DishRated Deployment Setup Script
echo "🚀 Setting up DishRated for deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo "❌ Please run this script from the root of your DishRated project"
    exit 1
fi

echo "📁 Current directory structure:"
ls -la

# Create .gitignore for root if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating root .gitignore..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity
EOF
fi

# Update backend .gitignore
echo "📝 Updating backend .gitignore..."
cat > backend/.gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
EOF

# Update frontend .gitignore
echo "📝 Updating frontend .gitignore..."
cat > frontend/.gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# Vite
.vite/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Coverage directory
coverage/

# Optional npm cache directory
.npm
EOF

# Create production environment file examples
echo "📝 Creating environment file examples..."

# Backend .env.example
cat > backend/.env.example << EOF
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dishrated?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# CORS
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Email (for future features)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password

# Optional: File Upload (for future features)
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret
EOF

# Frontend .env.example
cat > frontend/.env.example << EOF
# API Configuration
VITE_API_URL=https://your-backend-domain.railway.app/api

# Optional: Analytics (for future features)
# VITE_GA_TRACKING_ID=G-XXXXXXXXXX

# Optional: Maps API (if using Google Maps instead of OpenStreetMap)
# VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
EOF

# Add deployment scripts to package.json files
echo "📝 Adding deployment scripts..."

# Update backend package.json with deployment scripts
cd backend
npm pkg set scripts.start="node dist/server.js"
npm pkg set scripts.build="tsc"
npm pkg set scripts.deploy="npm run build && npm start"
cd ..

# Update frontend package.json with deployment scripts
cd frontend
npm pkg set scripts.preview="vite preview"
npm pkg set scripts.deploy="npm run build && npm run preview"
cd ..

# Create a simple health check endpoint test
echo "📝 Creating deployment verification script..."
cat > verify-deployment.js << EOF
const https = require('https');
const http = require('http');

async function checkEndpoint(url, name) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            console.log(\`✅ \${name}: \${res.statusCode}\`);
            resolve(res.statusCode === 200);
        });
        
        req.on('error', (err) => {
            console.log(\`❌ \${name}: \${err.message}\`);
            resolve(false);
        });
        
        req.setTimeout(10000, () => {
            console.log(\`⏰ \${name}: Timeout\`);
            req.destroy();
            resolve(false);
        });
    });
}

async function verifyDeployment() {
    console.log('🔍 Verifying deployment...');
    
    const backendUrl = process.argv[2];
    const frontendUrl = process.argv[3];
    
    if (!backendUrl || !frontendUrl) {
        console.log('Usage: node verify-deployment.js <backend-url> <frontend-url>');
        console.log('Example: node verify-deployment.js https://your-app.railway.app https://your-app.vercel.app');
        process.exit(1);
    }
    
    const backendHealth = await checkEndpoint(\`\${backendUrl}/api/health\`, 'Backend Health');
    const frontendHealth = await checkEndpoint(frontendUrl, 'Frontend');
    const apiConnection = await checkEndpoint(\`\${backendUrl}/api/trucks\`, 'API Trucks Endpoint');
    
    console.log('\\n📊 Deployment Status:');
    console.log(\`Backend: \${backendHealth ? '✅' : '❌'}\`);
    console.log(\`Frontend: \${frontendHealth ? '✅' : '❌'}\`);
    console.log(\`API Connection: \${apiConnection ? '✅' : '❌'}\`);
    
    if (backendHealth && frontendHealth && apiConnection) {
        console.log('\\n🎉 Deployment successful! Your app is live!');
    } else {
        console.log('\\n⚠️ Some issues detected. Check the logs above.');
    }
}

verifyDeployment();
EOF

echo "✅ Deployment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy backend/.env.example to backend/.env and fill in your values"
echo "2. Copy frontend/.env.example to frontend/.env and fill in your values"
echo "3. Test locally: npm run dev (in both frontend and backend directories)"
echo "4. Commit and push to GitHub: git add . && git commit -m 'Prepare for deployment' && git push"
echo "5. Follow the DEPLOYMENT_GUIDE.md for platform-specific instructions"
echo ""
echo "🔧 Useful commands after deployment:"
echo "- Verify deployment: node verify-deployment.js <backend-url> <frontend-url>"
echo "- View logs: Check your deployment platform's dashboard"
echo "- Update environment variables: Use your platform's settings panel"
echo ""
echo "📖 Read DEPLOYMENT_GUIDE.md for detailed instructions!"
EOF
