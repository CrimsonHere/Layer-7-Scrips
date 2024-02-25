#!/bin/bash

# Dont be a retard
CF_IPV4_URL="https://www.cloudflare.com/ips-v4"
CF_IPV6_URL="https://www.cloudflare.com/ips-v6"

# Create tables and chains for both IPv4 and IPv6 if they dont exist
sudo nft list table ip filter >/dev/null 2>&1 || sudo nft add table ip filter
sudo nft list chain ip filter INPUT >/dev/null 2>&1 || sudo nft add chain ip filter INPUT { type filter hook input priority 0 \; }

sudo nft list table ip6 filter >/dev/null 2>&1 || sudo nft add table ip6 filter
sudo nft list chain ip6 filter INPUT >/dev/null 2>&1 || sudo nft add chain ip6 filter INPUT { type filter hook input priority 0 \; }

# Resets rules in the INPUT chains
sudo nft flush chain ip filter INPUT
sudo nft flush chain ip6 filter INPUT


# Add IPv4 rules from Cloudflare so that niggers can't kill you
curl -s $CF_IPV4_URL | while read ip_range; do
    [ -z "$ip_range" ] && continue
    sudo nft add rule ip filter INPUT ip saddr $ip_range tcp dport { 80, 443 } accept
done

# Add IPv6 rules from Cloudflare so that niggers can't kill you
curl -s $CF_IPV6_URL | while read ip_range; do
    [ -z "$ip_range" ] && continue
    sudo nft add rule ip6 filter INPUT ip6 saddr $ip_range tcp dport { 80, 443 } accept
done

# Block other traffic on ports 80 and 443 for both IPv4 and IPv6 or what every the fuck you want I dont fucking care
sudo nft add rule ip filter INPUT tcp dport { 80, 443 } drop
sudo nft add rule ip6 filter INPUT tcp dport { 80, 443 } drop

echo "nftables rules updated to allow Cloudflare IPs on ports 80 and 443 for more questions My discord is Pc Principal#8752."