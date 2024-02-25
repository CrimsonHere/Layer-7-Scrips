const MongoClient  = require("mongodb").MongoClient;
const MONGO_URI = '';
const DATABASE_NAME = '';
const USER_KEYS_COLLECTION = '';
let cachedMongoClient;

async function ConnectToDB() 
{
  cachedMongoClient = new MongoClient(MONGO_URI);
  await cachedMongoClient.connect();
}

async function RestartConnectToDB() // I need to run this every 12 hours. Will do later
{
  try 
  {
    await cachedMongoClient.close();
    cachedMongoClient = new MongoClient(MONGO_URI);
    await cachedMongoClient.connect();
  } 
  catch (error) 
  {
  }
}

async function findUserByKey(cleanedKey) 
{
  const userKeysCollection = await cachedMongoClient.db(DATABASE_NAME).collection(USER_KEYS_COLLECTION);
  return userKeysCollection.findOne({ KEY: cleanedKey });
}

async function updateUserByKey(cleanedKey, updateObj)
{
  const userKeysCollection = await cachedMongoClient.db(DATABASE_NAME).collection(USER_KEYS_COLLECTION);
  await userKeysCollection.updateOne({ KEY: cleanedKey }, { $set: updateObj });
}

module.exports = { findUserByKey, updateUserByKey, ConnectToDB,  RestartConnectToDB };