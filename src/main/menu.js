import { createSettingWindow } from './index'
import { Menu } from 'electron'

const menuTemplate = [
    {
      label: '文件',
      submenu: [
        {
          label: '设置',
          // accelerator: 'CmdOrCtrl+P',
          click: () => {
            console.log('open setting');
            createSettingWindow()
          }
        },
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '官网',
          click: () => {
            require('electron').shell.openExternal('https://electronjs.org');
          }
        }
      ]
    }
  ];

// 加载menu
export function loadMenu() {
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
}