import {globalShortcut } from 'electron'
import {swtichMainWindowFocus} from './index'
import {configStore,getHotKey} from './config/config'

export function initHotKey() {
    register()
}
/**
 * 注册热键
 */
function register() {
    globalShortcut.register(getHotKey().wakeup, () => {
    swtichMainWindowFocus()
  })
}


export function unregisterAll() {

}