Plurawl APIs Deployment Guide

AWS EC2 Instance Details:

Instance ID: i-00e479abd6413bc50
Instance Name: plurawlapis
Instance Type: t2.micro
Public IP: 13.58.144.250
Private IP: 172.31.46.155
Region: us-east-2
Status: Running
Credentials:

Email: dev@plurawl.com
Password: Kin#Sal#1118
Deployment Process:

Connect to EC2 Instance:
Connect via AWS Console or SSH:
ssh -i your-key.pem ec2-user@13.58.144.250
Update Code:
cd PlurawlApis
git pull
Restart Server:
cd apis
pm2 restart index.js
Directory Structure:

Repository: PlurawlApis/
Application: apis/
Main Process: index.js
Process Management:

Uses PM2 for process management
Main application file: index.js
Restart command: pm2 restart index.js
Notes:

Instance runs Node.js application
Code updates require git pull and PM2 restart
Server restarts are handled via PM2
