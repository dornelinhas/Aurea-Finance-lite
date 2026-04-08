# Tutorial para LLMs: Como converter o Aurea Finance (Vue/Vite + Node.js/SQLite) em um Executável Electron (.exe)

Este documento é um guia passo a passo otimizado para Large Language Models (LLMs). Ele detalha o processo exato que funcionou para converter esta codebase específica (um monorepo informal com frontend Vue 3/Vite e backend Node.js Express com SQLite) em um aplicativo desktop Windows usando Electron e `electron-builder`.

## 📌 Contexto da Codebase
- **Frontend:** Vue 3, Vite, TailwindCSS (na pasta raiz e em `src/`).
- **Backend:** Node.js, Express, SQLite (`sqlite3` e `better-sqlite3`), localizado na pasta `server/`.
- **Desafio Principal:** O banco de dados SQLite nativo precisa ser recompilado para o Electron e o banco de dados dentro de um pacote `.asar` é somente-leitura, exigindo realocação para uma pasta segura do sistema (`userData`).

---

## 🛠️ Passo 1: Unificação e Ajuste de Dependências

O `electron-builder` empacota as dependências listadas em `dependencies` no `package.json` raiz. Dependências do frontend devem ir para `devDependencies`.

1. **Mova dependências do backend para a raiz:**
   Mova `express`, `cors` e `sqlite3` do `server/package.json` para o `dependencies` do `package.json` da raiz.
2. **Mova dependências do frontend para `devDependencies`:**
   Bibliotecas como `vue`, `vue-router`, `chart.js`, `tailwindcss`, `@tailwindcss/vite`, etc., devem estar estritamente em `devDependencies`.
3. **Instale as ferramentas do Electron:**
   Adicione `electron`, `electron-builder`, `concurrently`, `cross-env` e `wait-on` como `devDependencies`.

*(Nota para o LLM: Evite usar o script `postinstall: "electron-builder install-app-deps"` se houver espaços no caminho do diretório do usuário no Windows, pois o `node-gyp` falhará. Deixe que a etapa de build recompile o `sqlite3` nativamente).*

---

## 🗄️ Passo 2: Adaptação do Banco de Dados (SQLite)

Arquivos embutidos no `.asar` do Electron são **somente leitura**. O banco de dados precisa ser salvo em um diretório gravável.

**No arquivo `server/database.js`:**
Permita que o caminho do banco de dados seja injetado via variável de ambiente:
```javascript
import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Usa DB_PATH se existir, caso contrário, usa o caminho local (útil para dev)
const dbPath = process.env.DB_PATH || join(__dirname, 'aurea.db');

const db = new Database(dbPath);
```

---

## 🌐 Passo 3: Adaptação do Frontend (Vite e API)

O Electron carrega os arquivos via protocolo `file://`. O frontend não é mais servido por um servidor web.

1. **No `vite.config.js`:**
   Adicione `base: './'` para que os caminhos dos assets gerados sejam relativos.
   ```javascript
   export default defineConfig({
     base: './', // CRÍTICO para o Electron
     plugins: [tailwindcss(), vue()],
     // ...
   })
   ```

2. **No cliente da API (`src/api/index.js`):**
   Altere a constante `BASE` para apontar o caminho absoluto do servidor local que o Electron irá rodar em segundo plano.
   ```javascript
   const BASE = 'http://localhost:3001/api'; // Alterado de '/api'
   ```

---

## 🖥️ Passo 4: O Processo Principal do Electron (`electron/main.js`)

Crie o arquivo `electron/main.js` na raiz. Este arquivo será responsável por definir o caminho do banco de dados, iniciar o backend Express e abrir a janela do Vue.

```javascript
import { app, BrowserWindow } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Defina o caminho do banco de dados NA PASTA DO USUÁRIO (AppData) ANTES de iniciar o servidor
const userDataPath = app.getPath('userData');
process.env.DB_PATH = join(userDataPath, 'aurea.db');

// 2. Inicie o servidor backend (Importação dinâmica para garantir que process.env.DB_PATH já esteja definido)
await import('../server/index.js');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
```

---

## 📦 Passo 5: Configuração de Build (`package.json`)

Adicione o script principal, os scripts de compilação e as diretrizes do `electron-builder`.

```json
{
  "main": "electron/main.js",
  "scripts": {
    "dev": "vite",
    "server": "node server/index.js",
    "start:all": "concurrently -k \"npm run server\" \"npm run dev -- --open\"",
    "build": "vite build",
    "electron:dev": "concurrently -k \"vite\" \"wait-on tcp:5173 && cross-env NODE_ENV=development electron .\"",
    "build:win": "vite build && electron-builder --win"
  },
  "build": {
    "appId": "com.aureafinance.app",
    "productName": "Aurea Finance",
    "directories": {
      "output": "release"
    },
    "files": [
      "dist/**/*",
      "electron/**/*",
      "server/**/*",
      "!server/node_modules",
      "package.json"
    ],
    "win": {
      "target": "nsis"
    },
    "asarUnpack": [
      "**/*.node"
    ]
  }
}
```

---

## 🐛 Passo 6: Troubleshooting Comum Registrado

1. **Erro `node-gyp` em caminhos com espaços:**
   No Windows, se a pasta do projeto contiver espaços (ex: `aureafinance - Copia`), o `node-gyp` falhará ao rodar via script de `postinstall` nativo.
   *Solução:* Remova `"postinstall": "electron-builder install-app-deps"` do `package.json` e deixe o comando de build `electron-builder --win` baixar as dependências pré-compiladas do sqlite3 ou compilar no momento certo.

2. **Erro de links simbólicos (`winCodeSign`) no Windows (7-Zip):**
   Às vezes o `electron-builder` falha ao extrair binários como `winCodeSign` devido a falta de privilégios de administrador para criar "symlinks" no cache do AppData.
   *Solução para o LLM:* Caso ocorra "Cannot create symbolic link", force a extração do cache ou baixe manualmente para a pasta `$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign`.

---

## 🚀 Resumo de Execução para o Usuário
Após aplicar estes passos, basta rodar:
1. `npm install`
2. `npm run build:win`

O instalador será gerado na pasta `release/` com o nome `Aurea Finance Setup 1.0.0.exe`.
