import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  clipboard,
  ipcRenderer,
  Menu,
  Tray,
  nativeImage,
  screen
} from 'electron'
import path, {
  join
} from 'path'
import appIcon from '../../resources/cut.ico?asset&asarUnpack'
import {
  electronApp,
  optimizer,
  is
} from '@electron-toolkit/utils'

import installExtension, {
  VUEJS3_DEVTOOLS
} from 'electron-devtools-installer';

import {
  loadMenu
} from './menu'
import {
  initHotKey
} from './hotkey'

import sequelize from './config/database';

import CutItemService  from './dao/CutItemDao'
import GroupService  from './dao/GroupDao'
import GroupItemService  from './dao/GroupItemDao'
import CutImageItemService  from './dao/CutImageItemDao'

import {configStore} from './config/config'
import { group } from 'console';

// 主窗口
var mainWindow = null
// 关于窗口
var aboutWindow = null
// 设置窗口
var settingWindow = null
// 详情窗口
var commonWindow = null
var tray = null

sequelize.sync()
    .then(() => console.log('Database synchronized'))
    .catch(error => console.error('Error synchronizing database:', error));

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 347,
    height: 441,
    // show: false,
    // autoHideMenuBar: true,
    ...(process.platform === 'linux' ? {
      icon
    } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      nodeIntegration: true,
    },
    icon: nativeImage.createFromPath(appIcon)
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    mainWindow.setAlwaysOnTop(true)
  })


  mainWindow.on('close', (event) => {
    if (!mainWindow.isMinimized()) {
      event.preventDefault();
      mainWindow.hide(); // 隐藏窗口而不是最小化
    }
  })

  var updateText = (readText) => mainWindow.webContents.send("update", readText)
  var lastText = ""
  var lastImage = null
  //剪切板处理逻辑
  setInterval(async () => {
    const image = clipboard.readImage();
    if (!image.isEmpty()) {
      
      if(lastImage && Buffer.compare(image.toBitmap(),lastImage) === 0) {
          return;
      }
      console.log("contain image")
      lastImage = image.toBitmap();
      const imageData = image.toJPEG(80);
      CutImageItemService.addCutImageItem(imageData)
      return;
    }
    const currText = clipboard.readText();
    if (currText !== lastText && currText) {
      console.log('copy text');
      lastText = currText; // 更新上一次的文本
      // 在这里执行其他操作，例如响应剪切板变化
      var item = await CutItemService.addCutItem(currText)
      updateText(item)
    }
  }, 1000); // 例如，每1000毫秒检查一次

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return {
      action: 'deny'
    }
  })

  

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  loadHtml(mainWindow, "/")
  if(is.dev)  {
    mainWindow.webContents.openDevTools();
  }
  // if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
  //   mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  // } else {
  //   mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  // }

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')
  //创建窗口
  createWindow()
  //加载菜单
  loadMenu()
  //注册热键
  initHotKey()

  installExtension(VUEJS3_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  tray = new Tray(nativeImage.createFromPath(appIcon))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '关于',
      type: 'normal',
      click: () => {
        createAboutWindow()
      }
    },
    {
      label: '退出',
      type: 'normal',
      click: () => {app.exit();}
    }
  ])
  tray.setToolTip('剪切板助手')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore() // 从最小化状态恢复窗口
      }
      mainWindow.focus() // 聚焦窗口
    } else {
      createWindow() // 如果窗口不存在，则创建一个新窗口
    }
  })

  // IPC test
  ipcMain.on('ping', (enent) => {
    console.log('pong')
  })
  // 设置窗口置顶 
  ipcMain.on('top', (_, isTop) => {
    mainWindow.setAlwaysOnTop(isTop)
    console.log("set always top state: %d", isTop)
  })
  // 拷贝剪切板
  ipcMain.on('sendCopyItem', (_, item) => {
    var item = JSON.parse(item)
    console.log(item)
    clipboard.writeText(item.content)
  })

  ipcMain.on('setStore', (_, key, value) => {
    configStore.set(key, value)
  })

  //查询数据接口
  ipcMain.handle('queryCutList', async () => {
    const start = performance.now();
    const docs = await CutItemService.getAllItem()
    const end = performance.now();
    console.log(`query all list time: ${end - start} milliseconds`);
    return docs
  })
  //查询配置
  ipcMain.handle('queryConfig', async () => {
    return configStore.store
  })



  //删除剪切板item
  ipcMain.on('deleteCutListItem', (_, item) => {
    CutItemService.deleteItem(JSON.parse(item))
  })


  ipcMain.on('openDetailWindow', (_, item) => {
    item = JSON.parse(item)
    console.log(item)
    createCommonSignalWindow(item)
    // deleteItem(JSON.parse(item))
  })

  //创建分组
  ipcMain.handle('createGroup', (_,name) => {
    console.log(name)
    var item =  GroupService.createGroup(name);
    return item;
  })
  //查询所有分组
  ipcMain.handle('queryGroups', (_,id) => {
    if(id == null) {
      return GroupService.getAllItem();
    }else {
      return GroupService.queryGroupById();
    }
     
  })
  // 查询分组items
  ipcMain.handle('queryGroupItems',(_,groupId) => {
    return GroupItemService.queryItemByGroupId(groupId)
  })
  // 删除分组item
  ipcMain.handle('deleteGroupItem',(_,groupItemId) => {
    return GroupItemService.deleteItem(groupItemId)
  })

  // 添加item到分组
  ipcMain.handle('addGroupItem',(_,groupItem) => {
    console.log("item:",groupItem)
    return GroupItemService.addGroupItem(groupItem)
  })


  // 查询所有图片
  ipcMain.handle('queryImageItems',async()=>{
    var imageList = await CutImageItemService.getAllItem();
    console.log(imageList)
    //转化数据为临时url
    imageList.forEach(element => {
      const buffer = element.content;
      element.content = `data:image/png;base64,${buffer.toString('base64')}`
    });
    return imageList;
  })


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



function createAboutWindow() {

  if (aboutWindow) {
    if (aboutWindow.isMinimized()) {
      aboutWindow.restore() // 从最小化状态恢复窗口
    }
    aboutWindow.focus() // 如果窗口已经存在，则只需将其聚焦
    return
  }

  // 创建一个新的浏览器窗口
  aboutWindow = new BrowserWindow({
    x: 200,
    y: 200,
    width: 300,
    height: 400,
    show: true,
    title: "关于",
    parent: mainWindow,
    autoHideMenuBar: true,
    // webPreferences: {
    //   preload: path.join(__dirname, 'preload.js') // 如果你有预加载脚本
    // },
    icon: nativeImage.createFromPath(appIcon)
  })

  loadHtml(aboutWindow, "about")
  // 监听窗口关闭事件，确保主窗口变量被清除
  aboutWindow.on('closed', () => {
    aboutWindow = null
  })
}


export function createSettingWindow() {

  if (settingWindow) {
    if (settingWindow.isMinimized()) {
      settingWindow.restore() // 从最小化状态恢复窗口
    }
    settingWindow.focus() // 如果窗口已经存在，则只需将其聚焦
    return
  }

  // 创建一个新的浏览器窗口
  settingWindow = new BrowserWindow({
    x: 200,
    y: 200,
    width: 500,
    height: 400,
    show: true,
    title: "设置",
    parent: mainWindow,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      nodeIntegration: true
    },
    icon: nativeImage.createFromPath(appIcon)
  })

  loadHtml(settingWindow, "setting")
  // 监听窗口关闭事件，确保主窗口变量被清除
  settingWindow.on('closed', () => {
    settingWindow = null
  })
}



export function createCommonSignalWindow(query="") {

  if (commonWindow) {
    if (commonWindow.isMinimized()) {
      commonWindow.restore() // 从最小化状态恢复窗口
    }
    commonWindow.focus() // 如果窗口已经存在，则只需将其聚焦
    return
  }

  // 创建一个新的浏览器窗口
  commonWindow = new BrowserWindow({
    x: 200,
    y: 200,
    width: 500,
    height: 400,
    show: true,
    title: "设置",
    parent: mainWindow,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      nodeIntegration: true
    },
    icon: nativeImage.createFromPath(appIcon)
  })

  loadHtml(commonWindow, "detail",query)
  // 监听窗口关闭事件，确保主窗口变量被清除
  commonWindow.on('closed', () => {
    commonWindow = null
  })
}

/**
 * 加载html
 * @param {窗口} window 
 * @param {路由} hash
 */
function loadHtml(window, hash = "",query="") {
  var url = null
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    console.log(process.env['ELECTRON_RENDERER_URL'])
    url = require('url').format({
      host: process.env['ELECTRON_RENDERER_URL'],
      path: "/",
      hash: hash,
      query: query
    })
    console.log(url)
  } else {
    url = require('url').format({
      protocol: 'file',
      slashes: true,
      pathname: join(__dirname, '../renderer/index.html'),
      hash: hash
    })
  }
  window.loadURL(url)
}

export function swtichMainWindowFocus() {
  if (mainWindow) {

    if (mainWindow.isMinimized()) {
      const {
        x,
        y
      } = screen.getCursorScreenPoint();
      console.log(x,y)
      const bounds = mainWindow.getBounds();
      mainWindow.restore() // 从最小化状态恢复窗口
      mainWindow.setBounds({
        x: x-50, // 新的 x 位置
        y: y-50, // 新的 y 位置
        width: bounds.width, // 保持原宽度
        height: bounds.height // 保持原高度
      });
      mainWindow.focus() // 如果窗口已经存在，则只需将其聚焦
    } else {
      mainWindow.minimize()
    }

  }
}
