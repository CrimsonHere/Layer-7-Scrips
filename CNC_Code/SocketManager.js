const ENC = require('./Encryption');
const WebSocket = require('ws');

let ws = new WebSocket.Server({ port: 8080 });

ws.on('connection', function connection(client) 
{
  client.on('message', function (message) 
  {
    console.log(ENC.Decrypt(message.toString()));
  });
  client.send(ENC.Encrypt('Connected!!!'));
});

function broadcastMessage(message) 
{
  ws.clients.forEach((client) => 
  {
    if (client.readyState === WebSocket.OPEN) 
    {
      client.send(ENC.Encrypt(message));
    }
  });
}

module.exports = 
{
    ws,
    broadcastMessage
}