// Test script to call the forgot-password endpoint and see the error
const http = require('http');

function testEndpoint() {
    console.log('Testing POST /api/auth/forgot-password endpoint...\n');
    
    const postData = JSON.stringify({
        email: 'admiiin@gmail.com'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/api/auth/forgot-password',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const req = http.request(options, (res) => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Headers:`, res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('\n✅ RESPONSE RECEIVED:');
            try {
                const parsed = JSON.parse(data);
                console.log(JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('Raw response:', data);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('\n❌ REQUEST ERROR ❌');
        console.error('Error:', error.message);
        console.error('Code:', error.code);
        
        if (error.code === 'ECONNREFUSED') {
            console.error('\n⚠️  Server is not running on port 3001!');
            console.error('Please start the server first: npm start');
        }
    });
    
    req.write(postData);
    req.end();
}

testEndpoint();

