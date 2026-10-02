@echo off
cd /d "%~dp0"
if exist "..\..\tools\node\node.exe" (
  "..\..\tools\node\node.exe" server.cjs
) else (
  node server.cjs
)
