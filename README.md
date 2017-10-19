#IP Carefully

Creates HTTP or HTTPS agents for node.js that can filter based on IP.
Accepts whitelists or blacklists.


```javascript

const IPCarefully = require('ipcarefully');
const https = IPCarefully.https({ type: 'blacklist', iplist: ['127.0.0.1'], agent: { maxSockets: 5 });

https.get('localhost'); //Will throw an error
```
