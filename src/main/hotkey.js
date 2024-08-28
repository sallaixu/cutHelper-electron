import {globalShortcut } from 'electron'
import {swtichMainWindowFocus} from './index'

export function initHotKey() {
    register()
}
/**
 * 注册热键
 */
function register() {
    globalShortcut.register('CommandOrControl+SPACE', () => {
    console.log('CommandOrControl+X is pressed')
    swtichMainWindowFocus()
  })
}


export function unregisterAll() {

}