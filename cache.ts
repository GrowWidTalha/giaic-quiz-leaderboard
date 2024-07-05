// cache.js
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 600000 }); // TTL is in seconds (600 seconds = 10 minutes)

export default cache;
