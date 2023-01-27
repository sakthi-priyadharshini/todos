const crypto = require("crypto");

const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");
console.table({ key1, key2 });

// this is just for creating the keys // we copy paste these keys to env file
