import { app, shell, BrowserWindow, ipcMain, clipboard, ipcRenderer  } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
console.log(process.cwd());
import { queryCutList,addCutList }  from './nedb'

// 主窗口
var mainWindow = undefined


function createWindow() {
  // Create the browser window.
    mainWindow = new BrowserWindow({
    width: 347,
    height: 441,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true
    }
  })
  
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setAlwaysOnTop(true)
  })
  
  var updateText = (readText) => mainWindow.webContents.send("update",readText)
  var lastText = ""
  setInterval(() => {
    const currText = clipboard.readText();
    if (currText !== lastText) {
      console.log('剪切板文本内容已变化');
      lastText = currText; // 更新上一次的文本
      // 在这里执行其他操作，例如响应剪切板变化
      addCutList({"time":new Date().getTime(),"text":currText},(error,docs)=>{
        updateText(docs)
      })
      
      
    }
  }, 1000); // 例如，每1000毫秒检查一次

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', (enent) => {
    console.log('pong')
  })
  // 设置窗口置顶 
  ipcMain.on('top', (_,isTop) => {
    mainWindow.setAlwaysOnTop(isTop)
    console.log("set always top state: %d",isTop)
  })

  //查询数据接口
  ipcMain.handle('queryCutList',async () => {
     const docs = await queryCutList()
     return docs
  })


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.