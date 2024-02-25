sudo apt update && sudo apt upgrade -y


sudo tee -a /etc/sysctl.conf > /dev/null <<EOT
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216
net.ipv4.tcp_wmem = 4096 65536 16777216
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_sack = 1
net.ipv4.tcp_no_metrics_save = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_tw_reuse = 1
net.ipv4.tcp_keepalive_probes = 5
net.core.somaxconn = 32000
kernel.shmmax = 268435456
vm.swappiness = 20
#net.ipv4.tcp_max_tw_buckets = 600000000
#net.core.netdev_max_backlog = 50000
#net.ipv4.tcp_max_syn_backlog = 3240000
EOT


sudo sysctl -p
ulimit -n 999999


echo "Networking optimizations applied."
