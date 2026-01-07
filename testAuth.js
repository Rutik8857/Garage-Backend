const http = require('http');

const testForgotPassword = () => {
    const postData = JSON.stringify({
        email: 'taderutik3@gmail.com'
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
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const responseBody = JSON.parse(data);
            if (res.statusCode === 500 && responseBody.error === 'Gmail EAUTH') {
                console.log('Test passed: Successfully caught Gmail EAUTH error.');
                console.log('Response:', responseBody);
            } else {
                console.error('Test failed.');
                console.log('Status Code:', res.statusCode);
                console.log('Response:', responseBody);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`Test failed with error: ${e.message}`);
    });

    req.write(postData);
    req.end();
};

testForgotPassword();