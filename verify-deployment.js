const https = require('https');
const http = require('http');

async function checkEndpoint(url, name) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        const req = client.get(url, (res) => {
            console.log(`✅ ${name}: ${res.statusCode}`);
            resolve(res.statusCode === 200);
        });
        
        req.on('error', (err) => {
            console.log(`❌ ${name}: ${err.message}`);
            resolve(false);
        });
        
        req.setTimeout(10000, () => {
            console.log(`⏰ ${name}: Timeout`);
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
    
    const backendHealth = await checkEndpoint(`${backendUrl}/api/health`, 'Backend Health');
    const frontendHealth = await checkEndpoint(frontendUrl, 'Frontend');
    const apiConnection = await checkEndpoint(`${backendUrl}/api/trucks`, 'API Trucks Endpoint');
    
    console.log('\n📊 Deployment Status:');
    console.log(`Backend: ${backendHealth ? '✅' : '❌'}`);
    console.log(`Frontend: ${frontendHealth ? '✅' : '❌'}`);
    console.log(`API Connection: ${apiConnection ? '✅' : '❌'}`);
    
    if (backendHealth && frontendHealth && apiConnection) {
        console.log('\n🎉 Deployment successful! Your app is live!');
    } else {
        console.log('\n⚠️ Some issues detected. Check the logs above.');
    }
}

verifyDeployment();
