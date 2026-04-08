@echo off
title Iniciar Aurea Finance
color 0b

echo ========================================================
echo        Iniciando Aurea Finance - Por favor, aguarde...
echo ========================================================
echo.

:: Verifica se o Node.js esta instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERRO] O Node.js nao foi encontrado no seu computador!
    echo.
    echo Para usar o sistema, voce precisa baixar e instalar o Node.js.
    echo E um programa normal. Se voce nao tem, o site principal do Node vai abrir agora.
    echo Baixe a versao "LTS", instale e depois abra este arquivo novamente!
    echo.
    pause
    start https://nodejs.org/
    exit /b
)

:: Instalar dependencias na pasta principal se for a primeira vez
IF NOT EXIST "node_modules\" (
    echo [1/2] Preparando arquivos principais... (Isso so acontece na primeira vez)
    call npm install
)

echo [2/2] Tudo pronto! Ligando o sistema...
echo.
echo ==========================================================
echo    IMPORTANTE: Deixe esta janela preta ABERTA enquanto 
echo    quiser usar o Aurea Finance! Feche ao terminar de usar.
echo ==========================================================
echo.
echo O navegador deve abrir sozinho em poucos segundos.
echo.

call npm run start:all
