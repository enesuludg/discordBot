#!/bin/bash 
echo "server deploy start"
git pull
npm install
pm2 restart all
echo "server deploy end"
