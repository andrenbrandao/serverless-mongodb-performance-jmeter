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

yum install -y mongodb-org-5.0.14 mongodb-org-database-5.0.14 mongodb-org-server-5.0.14 mongodb-org-shell-5.0.14 mongodb-org-mongos-5.0.14 mongodb-org-tools-5.0.14

echo "
# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# Where and how to store data.
storage:
  dbPath: /var/lib/mongo
  journal:
    enabled: true
#  engine:
#  wiredTiger:

# how the process runs
processManagement:
  fork: true  # fork and run in background
  pidFilePath: /var/run/mongodb/mongod.pid  # location of pidfile
  timeZoneInfo: /usr/share/zoneinfo

# network interfaces
net:
  port: 27017
  bindIp: 0.0.0.0  # Enter 0.0.0.0,:: to bind to all IPv4 and IPv6 addresses or, alternatively, use the net.bindIpAll setting.

replication:
  replSetName: \"rs0\"
" > /etc/mongod.conf

systemctl start mongod

echo "Starting replica set initialization"

until mongo --host 10.0.0.101 --eval "print(\"waited for connection\")"
do
   sleep 2
done

until mongo --host 10.0.0.102 --eval "print(\"waited for connection\")"
do
   sleep 2
done

echo "Connection finished"
echo "Creating replica set"

mongosh << EOF
rs.initiate(
{
_id: "rs0",
members: [
{ _id: 0, host: "10.0.0.100" },
{ _id: 1, host: "10.0.0.101" },
{ _id: 2, host: "10.0.0.102" }
]
})
EOF

echo "Replica set created"
