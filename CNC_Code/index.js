const MongoDBManger = require('./MongoDBManger.js');
const API = require('./ApiManager.js');
const requestIp = require('request-ip');
const fs = require("fs");
const express = require("express");
const app = express();

let Request = 0;

app.use(requestIp.mw());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => 
{
  if (req.path !== '/api/request-count')  
  {
    Request++;
  }
  next();
});


app.get('/', (req, res) => 
{
  const index = fs.readFileSync("./index.html");
  return res.status(200).end(index);
});

app.get('/api/request-count', (req, res) => res.status(200).json({ count: Request }));
app.get('/api/c2', API.Protocol7);
app.get('/api/portscan', API.PortScan);

app.listen(3000, () => 
{
  MongoDBManger.ConnectToDB();
});

setInterval(()=> 
{
  Request = 0;
}, 6000);