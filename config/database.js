const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
  uri: 'mongodb://localhost:27017/share-book',
  secret: crypto,
  db: 'share-book'
}
