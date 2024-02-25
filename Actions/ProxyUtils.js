const fs = require('fs');

class ProxyManager {
    constructor(proxyFilePath) {
        this.proxies = [];
        this.currentIndex = 0;
        this.loadProxiesFromFile(proxyFilePath);
    }

    loadProxiesFromFile(filePath) {
        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            this.proxies = fileContent.split('\n').map(line => line.trim()).filter(Boolean);
        } catch (error) {
            console.error('Error reading proxy file:', error.message);
            this.proxies = [];
        }
    }

    getRandomProxy() {
        return this.getRandomProxyByIndex(Math.floor(Math.random() * this.proxies.length));
    }

    getNextProxy() {
        return this.getNextProxyByIndex();
    }

    getRandomProxyByIndex(index) {
        return this.proxies.length === 0 ? null : this.proxies[index];
    }

    getNextProxyByIndex() {
        if (this.proxies.length === 0) {
            return null;
        }
        const nextProxy = this.proxies[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
        return nextProxy;
    }

    shuffleProxies() {
        for (let i = this.proxies.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.proxies[i], this.proxies[j]] = [this.proxies[j], this.proxies[i]];
        }
    }

    getNextShuffled() {
        this.shuffleProxies();
        return this.getNextProxy();
    }
}


module.exports = 
{
    ProxyManager
};