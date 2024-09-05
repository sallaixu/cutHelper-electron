const fs = require('fs');
const path = require('path');


// 读取配置文件
var config;
try {
    const data = fs.readFileSync("app.json", 'utf-8');
    config = JSON.parse(data);
} catch (error) {
    console.error('Error reading configuration:', error);
    config = {

    }; // 使用默认配置
}

function writeConfig(newConfig = config) {
    config = newConfig
    fs.writeFileSync("app.json", JSON.stringify(config, null, 2), 'utf-8');
}

export default config;

export {config,writeConfig};

