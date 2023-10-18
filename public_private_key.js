const { generateKeyPair } = require('crypto');


generateKeyPair('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
}, (err, publicKey, privateKey) => {
  // Handle errors and use the generated key pair.
  console.log(publicKey);
  console.log(privateKey);
  console.log(err);
});