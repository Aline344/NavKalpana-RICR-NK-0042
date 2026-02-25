import https from 'https';

const key = 'AIzaSyBeH_bMi5REXIdZzGWYvbPKBpKpTwhM2O4';
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const modelNames = json.models.map(m => m.name);
            console.log('Available Models:', modelNames.join('\n'));
        } catch (e) {
            console.log('Failed to parse:', data);
        }
    });
}).on('error', (err) => {
    console.error('Error:', err.message);
});
