const constants = require('http2').constants;
const randomgenerator = require('randomstring');

function generateRandomString(length) {
    return randomgenerator.generate({ length, charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._' });
}

function generateRandomBase64(length) 
{
    const Lenth = length - 1;
    return randomgenerator.generate({ Lenth, charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/+' }) + '=';
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const contentTypes = 
[
    'application/json', 'application/xml', 'text/plain', 'text/html', 'application/javascript',
    'image/jpeg', 'image/png', 'audio/mp3', 'video/mp4', 'application/pdf', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/zip', 'application/gzip',
    'application/octet-stream', 'application/ld+json', 'application/xhtml+xml', 'application/rss+xml',
    'application/atom+xml', 'application/vnd.geo+json', 'application/vnd.apple.mpegurl',
    'application/x-www-form-urlencoded', 'multipart/form-data', 'text/css', 'text/csv', 'text/calendar'
];

const languages = 
[
    'en-US,en;q=0.9', 'en-GB,en;q=0.9', 'es-ES,es;q=0.9', 'es-MX,es;q=0.9', 'fr-FR,fr;q=0.9', 'fr-CA,fr;q=0.9', 'de-DE,de;q=0.9', 
    'de-AT,de;q=0.9', 'zh-CN,zh;q=0.9', 'zh-TW,zh;q=0.9', 'ja-JP,ja;q=0.9', 'ru-RU,ru;q=0.9', 'it-IT,it;q=0.9', 'is-IS,is;q=0.9',
    'pt-BR,pt;q=0.9', 'pt-PT,pt;q=0.9', 'ko-KR,ko;q=0.9', 'ar-SA,ar;q=0.9', 'ar-EG,ar;q=0.9', 'nl-NL,nl;q=0.9', 'nl-BE,nl;q=0.9',
    'sv-SE,sv;q=0.9', 'fi-FI,fi;q=0.9', 'no-NO,no;q=0.9', 'da-DK,da;q=0.9', 'pl-PL,pl;q=0.9', 'tr-TR,tr;q=0.9', 'he-IL,he;q=0.9',
    'hi-IN,hi;q=0.9', 'th-TH,th;q=0.9', 'cs-CZ,cs;q=0.9', 'hu-HU,hu;q=0.9', 'el-GR,el;q=0.9', 'ro-RO,ro;q=0.9', 'sk-SK,sk;q=0.9',
    'sl-SI,sl;q=0.9', 'uk-UA,uk;q=0.9', 'bg-BG,bg;q=0.9', 'hr-HR,hr;q=0.9', 'lt-LT,lt;q=0.9', 'lv-LV,lv;q=0.9', 'et-EE,et;q=0.9',
    'id-ID,id;q=0.9', 'ms-MY,ms;q=0.9', 'vi-VN,vi;q=0.9', 'tl-PH,tl;q=0.9', 'bn-BD,bn;q=0.9', 'bn-IN,bn;q=0.9', 'si-LK,si;q=0.9',
    'mn-MN,mn;q=0.9', 'ka-GE,ka;q=0.9', 'am-ET,am;q=0.9', 'ur-PK,ur;q=0.9', 'ur-IN,ur;q=0.9', 'fa-IR,fa;q=0.9', 'ne-NP,ne;q=0.9',
    'km-KH,km;q=0.9', 'lo-LA,lo;q=0.9', 'my-MM,my;q=0.9', 
];

const requestMethods = ['GET', 'POST'];

const userAgents = 
[
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Windows NT 10.0; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Android 11; Mobile; rv:97.0) Gecko/97.0 Firefox/97.0',
    'Mozilla/5.0 (iPad; CPU OS 15_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/37.0 Mobile/15E148 Safari/605.1.15',
    'Mozilla/5.0 (Linux armv7l; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Windows NT 6.1; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0',
    'Mozilla/5.0 (Windows; U; Win98; rv:1.7.3) Gecko/20040913 Firefox/0.10',
    'Mozilla/5.0 (X11; U; Linux i686; es-ES; rv:1.8.0.1) Gecko/20060124 Firefox/1.5.0.1',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.4) Gecko/20060629 Firefox/1.5.0.4',
    'Mozilla/5.0 (Windows; U; Win98; de-DE; rv:1.7.7) Gecko/20050414 Firefox/1.0.3',
    'Mozilla/5.0 (Windows; U; Windows NT 5.1; de-DE; rv:1.7) Gecko/20040803 Firefox/0.9.3',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.5) Gecko/20041204 Firefox/1.0 (Debian package 1.0.x.2-1)',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.7.6) Gecko/20050317 Firefox/1.0.2',
    'Mozilla/5.0 (X11; U; Linux x86_64; en-US; rv:1.7.10) Gecko/20050724 Firefox/1.0.6',
    'Mozilla/5.0 (Windows; U; Windows NT 5.0; rv:1.7.3) Gecko/20040913 Firefox/0.10',
    'Mozilla/5.0 (X11; U; FreeBSD i386; en-US; rv:1.8.0.2) Gecko/20060414 Firefox/1.5.0.2',
    'Mozilla/5.0 (Windows; U; Windows NT 5.0; de-DE; rv:1.7.6) Gecko/20050223 Firefox/1.0.1',
    'Mozilla/5.0 (Windows; U; Windows NT 5.0; fr; rv:1.8.0.11) Gecko/20070312 Firefox/1.5.0.11',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4; rv:107.0) Gecko/20110101 Firefox/107.0',
    'Mozilla/5.0 (Windows; U; Windows NT 5.0; rv:1.7.3) Gecko/20040913 Firefox/0.10.1',
    'Mozilla/5.0 (Windows; U; Windows NT 5.0; en-US; rv:1.8.0.11) Gecko/20070312 Firefox/1.5.0.11',
    'Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3) Gecko/20040913 Firefox/0.10.1'
];

function getRandomUserAgent() 
{
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

function getRandomAcceptLanguage() 
{
    return languages[Math.floor(Math.random() * languages.length)];
}

function spoofIP() 
{
    const firstOctet = getRandomInt(1, 254);
    const secondOctet = firstOctet === 10 ? getRandomInt(16, 31) : getRandomInt(0, 255);
    const thirdOctet = getRandomInt(0, 255);
    const fourthOctet = getRandomInt(1, 254);
    return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
}

function generateRandomCfClearance() 
{
    const DateandTime = new Date().getTime();
    const timestamp = Math.floor(DateandTime / 1000);
    return `cf_clearance=${generateRandomString(43)}-${timestamp}-1-${generateRandomBase64(87)}`;
}

function getRandomQuery(parsed) 
{
    return `${parsed.path}?${generateRandomString(6)}=${generateRandomString(8)}&${generateRandomString(5)}=${generateRandomString(8)}`;
}

function getProtocol(parsed) 
{
    return parsed.protocol === "https:" ? "https" : "http";
}

function getRandomMethod() 
{
    return requestMethods[Math.floor(Math.random() * requestMethods.length)];
}

function getContentType() 
{
    return contentTypes[Math.floor(Math.random() * contentTypes.length)];
}

function getPath(parsed, query) 
{
    return query ? getRandomQuery(parsed) : parsed.path;
}

function getMethod(extraOptions) 
{
    if (extraOptions.mix) 
    {
        return getRandomMethod();
    }
    if (extraOptions.Get) 
    {
        return 'GET';
    }
    if (extraOptions.Post) 
    {
        return 'POST';
    }
}

function getFetchsite(parsed) 
{
    return parsed.path === '/' ? 'same-origin' : 'none';
}

function getHeaders(parsed, extraOptions = {})
{
    const method = getMethod(extraOptions);
    const baseHeaders = 
    {
        [constants.HTTP2_HEADER_METHOD]: method,
        [constants.HTTP2_HEADER_PATH]: getPath(parsed, extraOptions.query),
        [constants.HTTP2_HEADER_AUTHORITY]: parsed.host,
        [constants.HTTP2_HEADER_SCHEME]: getProtocol(parsed),
        [constants.HTTP2_HEADER_USER_AGENT]: getRandomUserAgent(),
        [constants.HTTP2_HEADER_ACCEPT]: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        [constants.HTTP2_HEADER_ACCEPT_LANGUAGE]: getRandomAcceptLanguage(),
        [constants.HTTP2_HEADER_ACCEPT_ENCODING]: 'gzip, deflate, br',
        'Upgrade-Insecure-Requests': 1,
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': getFetchsite(parsed),
        'Sec-Fetch-User': '?1',
        //'Pragma': 'no-cache',
        //[constants.HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
        [constants.HTTP2_HEADER_TE]: 'trailers'
    };
    if (method === 'POST') 
    {
        baseHeaders[constants.HTTP2_HEADER_CONTENT_LENGTH] = 0;
        baseHeaders[constants.HTTP2_HEADER_CONTENT_TYPE] = getContentType();
    }
    if (extraOptions.spoof) 
    {
        baseHeaders['X-Forwarded-For'] = spoofIP();
    }
    return baseHeaders;
}     

module.exports = {
    getHeaders,
    getRandomInt
};