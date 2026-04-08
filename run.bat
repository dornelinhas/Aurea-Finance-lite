@echo off
setlocal
echo Limpando servidores antigos e processos Node...

:: Finaliza todos os processos Node de forma forçada
taskkill /F /IM node.exe /T >nul 2>&1

:: Aguarda um momento para os processos serem liberados
timeout /t 2 /nobreak >nul

:: Limpeza adicional específica por portas (caso processos fantasmas persistam)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING') do taskkill /f /pid %%a >nul 2>&1

echo Iniciando Aurea Finance - Servidor e Frontend...
npm run start:all
pause
endlocal
