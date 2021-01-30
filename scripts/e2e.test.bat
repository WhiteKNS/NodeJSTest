@echo off
setlocal enabledelayedexpansion

for /f "tokens=3 delims=: " %%h in ('sc query "elasticsearch-service-x64" ^| findstr "STATE"') do (
  if /i "%%h" NEQ "RUNNING" (
   %ELASTIC_SEARCH%\bin\elasticsearch-service.bat install
   %ELASTIC_SEARCH%\bin\elasticsearch-service.bat run
   net start "elasticsearch-service-x64"
  )
)

curl --silent -o /dev/null -X DELETE "http://$ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT/$ELASTICSEARCH_INDEX"
yarn run test:e2e
curl --silent -o /dev/null -X DELETE "http://$ELASTICSEARCH_HOSTNAME:$ELASTICSEARCH_PORT/$ELASTICSEARCH_INDEX"

exit /B
