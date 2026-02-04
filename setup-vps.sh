#!/bin/bash
# Hỷ Lạc Việt v4 - VPS Setup Script
# Run as root on fresh Ubuntu/Debian VPS

set -e

echo "=== Phase 0: Infrastructure Setup ==="

# 1. Create 4GB Swap (avoid OOM during Rust build)
echo ">>> Creating 4GB swap..."
if [ ! -f /swapfile ]; then
    fallocate -l 4G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    echo "Swap created successfully"
else
    echo "Swap already exists"
fi

# 2. Update system
echo ">>> Updating system..."
apt update && apt upgrade -y

# 3. Install essentials
echo ">>> Installing essentials..."
apt install -y curl git build-essential pkg-config libssl-dev sqlite3

# 4. Docker
echo ">>> Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
else
    echo "Docker already installed"
fi

# 5. Rust
echo ">>> Installing Rust..."
if ! command -v cargo &> /dev/null; then
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source ~/.cargo/env
else
    echo "Rust already installed"
fi

# 6. Node.js 22
echo ">>> Installing Node.js 22..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
    apt install -y nodejs
else
    echo "Node.js already installed"
fi

# 7. Create project structure
echo ">>> Creating project structure..."
mkdir -p /opt/hylacviet/{backend,frontend,admin,traefik/letsencrypt,data/uploads}

# 8. Docker network
echo ">>> Creating Docker network..."
docker network create traefik-network 2>/dev/null || echo "Network already exists"

echo ""
echo "=== Infrastructure setup complete! ==="
echo "Next: Copy project files to /opt/hylacviet"
