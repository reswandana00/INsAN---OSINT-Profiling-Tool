@echo off
echo Transferring files to server...

REM Create tar archive excluding node_modules and build files
tar --exclude=node_modules --exclude=.next --exclude=__pycache__ --exclude=.git -czf app-files.tar.gz .

REM Transfer the archive to server
scp app-files.tar.gz root@157.245.154.5:/tmp/

REM Connect to server and extract files
ssh root@157.245.154.5 "cd /tmp && tar -xzf app-files.tar.gz -C /var/www/insan-osint-saas/ && cd /var/www/insan-osint-saas && chmod +x *.sh"

echo Files transferred successfully!
pause 