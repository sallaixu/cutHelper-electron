import Store from 'electron-store';
// Store.initRenderer();
//默认配置
const defaultConfig = {
    //热键
    hotkey: {
      wakeup: "CommandOrControl+SPACE"
    }
}

const configStore = new Store({defaults:defaultConfig});

function getHotKey() {
   return configStore.get("hotkey")
}

export {
    configStore,
    getHotKey
}
