const crypto = require('crypto');
const IV_LEN = 16;
const ITERATIONS = 1000;
const KEY_LEN = 32;
const ALGORITHM = 'aes-256-cbc';

const Enc_Key = 'de7a5750d31794258f70310880357fa18946ad35c7b0dc5bb822a80f2feb83fe';
const IV_Key = '91e6b4f9';

function sha256(data)
{
  return crypto.createHash('sha256').update(data).digest('hex');
}

function Decrypt(encryptedTextBase64) 
{
  const encryptedData = Buffer.from(encryptedTextBase64, 'base64');
  const key = crypto.pbkdf2Sync(Enc_Key, sha256(IV_Key).substring(0, 16), ITERATIONS, KEY_LEN, 'sha1');
  const retrievedIV = encryptedData.slice(0, IV_LEN);
  const encryptedText = encryptedData.slice(IV_LEN);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, retrievedIV);
  let decryptedText = decipher.update(encryptedText, 'binary', 'utf8');
  decryptedText += decipher.final('utf8');
  return decryptedText;
}


function Encrypt(clearText)
{
  const ivHash = sha256(IV_Key).substring(0, IV_LEN);
  const key = crypto.pbkdf2Sync(Enc_Key, ivHash, ITERATIONS, KEY_LEN, 'sha1');
  const cipher = crypto.createCipheriv(ALGORITHM, key, Buffer.from(ivHash, 'binary'));
  let encrypted = cipher.update(clearText, 'utf8', 'binary');
  encrypted += cipher.final('binary');
  const encryptedData = Buffer.concat([Buffer.from(ivHash, 'binary'), Buffer.from(encrypted, 'binary')]);
  return encryptedData.toString('base64');
}

module.exports =
{
    Encrypt,
    Decrypt
};