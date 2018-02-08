#IP Carefully

[![Greenkeeper badge](https://badges.greenkeeper.io/wraithgar/ipcarefully.svg)](https://greenkeeper.io/)

Creates HTTP or HTTPS agents for node.js that can filter based on IP.
Accepts whitelists or blacklists.


```javascript

const Https = require(https);
const IPCarefully = require('ipcarefully');
const agent = IPCarefully.https({ type: 'blacklist', iplist: ['127.0.0.1'], agent: { maxSockets: 5 });


Https.request({host: 'localhost', agent }); //Socket will error out before connecting
```
