const cryptoObj = require('crypto');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const secretKey = '<secret_key>';

const dataEncryption = (data) => {
  const iv = cryptoObj.randomBytes(16);
  const cipher = cryptoObj.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'base64'), iv);
  let encryptedData = cipher.update(data, 'utf8', 'base64');
  encryptedData += cipher.final('base64');
  const combinedData = Buffer.concat([iv, Buffer.from(encryptedData, 'base64')]);
  const encodedData = combinedData.toString('base64');
  return encodedData;
};

function createJwtSignedHMAC() {
  try {
    const filePath = path.resolve(__dirname, 'privateKey.key');
    const privateKey = fs.readFileSync(filePath);
    
    console.log(`PRIVATE KEY>>>>>>`, privateKey);

    const map = {
      mid: '<MID>',
      iss: '<iss>',
      agr: '<agr>',
    };

    const claims = {
      srv: '<srv>',
      data: '',
    };

    const data = JSON.stringify(map);
    const now = new Date();
    const encodedData = dataEncryption(data);
    claims.data = encodedData;
    const tokenTimeOut = 30;
    const jwtToken = jwt.sign(
      {
        ...claims,
        sub: Buffer.from('<userReferenceId>').toString('base64'),
        aud: 'Plural',
        jti: uuidv4(),
        iat: Math.floor(now.getTime() / 1000),
        exp: Math.floor(now.getTime() / 1000) + tokenTimeOut * 60,
      },
      privateKey,
      {
        algorithm: 'RS256',
      }
    );

    console.log('Encrypted String:', jwtToken);
    return jwtToken;
  } catch (err) {
    console.log(`INSIDE CREATE JWT >>>>`, err);
  }
}

createJwtSignedHMAC();
