const net = require('net');
const tls = require('tls');
const { constants } = require('crypto');

//const customCiphers = 'TLS_GREASE:TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_RSA_WITH_AES_128_GCM_SHA256:TLS_RSA_WITH_AES_256_GCM_SHA384:TLS_RSA_WITH_AES_128_CBC_SHA:TLS_RSA_WITH_AES_256_CBC_SHA';
const customCiphers = 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256:TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384:TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256:TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA:TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA:TLS_RSA_WITH_AES_128_GCM_SHA256:TLS_RSA_WITH_AES_256_GCM_SHA384:TLS_RSA_WITH_AES_128_CBC_SHA:TLS_RSA_WITH_AES_256_CBC_SHA';
const customSigAlgs = 'ecdsa_secp256r1_sha256:rsa_pss_rsae_sha256:rsa_pkcs1_sha256:ecdsa_secp384r1_sha384:rsa_pss_rsae_sha384:rsa_pkcs1_sha384:rsa_pss_rsae_sha512:rsa_pkcs1_sha512';

function createCustomTLSSocket(netSock, parsedUrl) 
{
    const tlsConnection = tls.connect(
    {
        host: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        servername: parsedUrl.hostname,
        socket: netSock,
        honorCipherOrder: true,
        rejectUnauthorized: false,
        ciphers: customCiphers,
        sigalgs: customSigAlgs,
        ALPNProtocols: ['h2', 'http/1.1'],
        echdCurve: 'X25519:P-256:P-384',
        secureOptions: constants.SSL_OP_CIPHER_SERVER_PREFERENCE | constants.ALPN_ENABLED | constants.SSL_OP_COOKIE_EXCHANGE | constants.SSL_OP_NO_SSLv2 | constants.SSL_OP_NO_SSLv3 | constants.SSL_OP_NO_COMPRESSION
    });
    tlsConnection.allowHalfOpen = true;
    tlsConnection.setKeepAlive(true);
    return tlsConnection;
}

class NetSocket 
{
    constructor() 
    {
        this.connectionPool = new Map();
    }
    HTTP(options, callback) 
    {
        const proxyAddress = `${options.host}:${options.port}`;
        let connection = this.connectionPool.get(proxyAddress);
        let ConnectionData = `CONNECT ${options.address}:443 HTTP/1.1\r\n`;
        ConnectionData += `Host: ${options.address}:443\r\n`;
        ConnectionData += 'Connection: Keep-Alive\r\n\r\n';
        if (!connection) 
        {
            connection = net.connect({ host: options.host, port: options.port, allowHalfOpen: true });
            this.connectionPool.set(proxyAddress, connection);
        }
        const buffer = Buffer.from(ConnectionData);
        connection.setTimeout(120 * 10000);
        connection.setKeepAlive(true);
        connection.on("connect", () => 
        {
            connection.write(buffer);
        });
        connection.on("data", chunk => 
        {
            const isAlive = chunk.toString("utf-8").includes("HTTP/1.1 200");
            if (!isAlive) 
            {
                this.destroy(connection, proxyAddress);
                return callback(undefined, "error: invalid response from proxy server");
            }
            return callback(connection, undefined);
        });
        connection.on("timeout", () => 
        {
            this.destroy(connection, proxyAddress);
            return callback(undefined, "error: timeout exceeded");
        });
        connection.on("error", error => 
        {
            this.destroy(connection, proxyAddress);
            return callback(undefined, "error: " + error);
        });
    }

    destroy(connection, proxyAddress) 
    {
        this.connectionPool.delete(proxyAddress);
        if (connection && !connection.destroyed) 
        {
            connection.destroy();
        }
    }

    destroyAllconnections() 
    {
        this.connectionPool.forEach(connection => 
        {
            if (connection && !connection.destroyed) 
            {
                connection.destroy();
            }
        });
        this.connectionPool.clear();
    }
}

module.exports = 
{
    NetSocket,
    createCustomTLSSocket
};