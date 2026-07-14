const https = require('https');

https
	.get('https://id.pinterest.com/pin/22729173115233969/', (res) => {
		let data = '';
		res.on('data', (chunk) => (data += chunk));
		res.on('end', () => {
			const match = data.match(/<meta property="og:image" name="og:image" content="([^"]+)"/);
			if (match) {
				console.log(match[1]);
			} else {
				console.log('Not found');
			}
		});
	})
	.on('error', (err) => {
		console.log('Error: ' + err.message);
	});
