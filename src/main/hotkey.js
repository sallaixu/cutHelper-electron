import {globalShortcut } from 'electron'
import {swtichMainWindowFocus} from './index'
import {config,writeConfig} from './config/appConfig'

export function initHotKey() {
    register()
}
/**
 * 注册热键
 */
function register() {
    globalShortcut.register(config.hotkey.wakeup, () => {
    swtichMainWindowFocus()
  })
}


export function unregisterAll() {

}