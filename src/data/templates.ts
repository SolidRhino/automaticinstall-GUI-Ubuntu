/**
 * Pre-configured templates for common server configurations
 */

interface TemplateConfig {
  packages?: string;
  snaps?: string;
  lateCommands?: string;
  updates?: string;
}

interface Template {
  name: string;
  description: string;
  config: TemplateConfig;
}

interface Templates {
  [key: string]: Template;
}

export const templates: Templates = {
  webserver: {
    name: 'Web Server',
    description: 'LAMP/LEMP stack with nginx, PHP, and MySQL',
    config: {
      packages:
        'nginx\nmysql-server\nphp-fpm\nphp-mysql\ncertbot\npython3-certbot-nginx\nufw',
      lateCommands:
        'curtin in-target -- systemctl enable nginx\ncurtin in-target -- ufw allow 22/tcp\ncurtin in-target -- ufw allow 80/tcp\ncurtin in-target -- ufw allow 443/tcp\ncurtin in-target -- ufw --force enable',
      updates: 'security',
    },
  },
  database: {
    name: 'Database Server',
    description: 'PostgreSQL database server with backup tools',
    config: {
      packages: 'postgresql\npostgresql-contrib\npgbackrest\npostgresql-client',
      lateCommands:
        'curtin in-target -- systemctl enable postgresql\ncurtin in-target -- sudo -u postgres createdb production',
      updates: 'security',
    },
  },
  docker: {
    name: 'Docker Host',
    description: 'Docker and Docker Compose for containerized applications',
    config: {
      packages: 'apt-transport-https\nca-certificates\ncurl\ngnupg\nlsb-release',
      snaps: 'name: docker\nclassic: false',
      lateCommands:
        'curtin in-target -- usermod -aG docker ubuntu\ncurtin in-target -- systemctl enable docker',
      updates: 'all',
    },
  },
  kubernetes: {
    name: 'Kubernetes Node',
    description: 'Kubernetes node with kubeadm, kubectl, and kubelet',
    config: {
      packages: 'apt-transport-https\nca-certificates\ncurl\ncontainerd',
      snaps: 'name: kubectl\nclassic: true',
      lateCommands: 'curtin in-target -- systemctl enable containerd',
      updates: 'all',
    },
  },
  development: {
    name: 'Development Workstation',
    description: 'Development tools, editors, and utilities',
    config: {
      packages:
        'git\nvim\nemacs\nbuild-essential\npython3-pip\nnodejs\nnpm\ncurl\nwget\nhtop',
      snaps: 'name: code\nclassic: true\n---\nname: postman',
      updates: 'all',
    },
  },
  minimal: {
    name: 'Minimal Server',
    description: 'Bare minimum installation with SSH',
    config: {
      packages: 'openssh-server',
      updates: 'security',
    },
  },
};
