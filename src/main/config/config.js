import Store from 'electron-store';
//默认配置
const defaultConfig = {
    //热键
    hotkey: {
      wakeup: "CommandOrControl+SPACE"
    },
    cut: {
      maxItem: 500
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
