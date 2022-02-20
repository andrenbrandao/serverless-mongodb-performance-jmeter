#!/bin/bash
yum update -y
sudo su

echo "[mongodb-org-5.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/5.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-5.0.asc
" > /etc/yum.repos.d/mongodb-org-5.0.repo

yum install -y mongodb-org
echo "storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
net:
  port: 27017
  bindIp: 0.0.0.0
replication:
  replSetName: MongoReplicaSet
processManagement:
  timeZoneInfo: /usr/share/zoneinfo
" > /etc/mongod.conf

systemctl start mongod
