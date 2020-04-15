const crypto = require("crypto");

const hashDigest = content => crypto.createHash("sha256").update(content).digest("hex").toString();
const hashSaltDigest = (content, salt) => hashDigest(`${content}${salt}`);

module.exports = {hashDigest, hashSaltDigest};
