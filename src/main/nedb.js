var Datastore = require('nedb')
var db = new Datastore({ filename: './app.db' });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});
var configDB = new Datastore({ filename: './config.db' });
configDB.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});

export function setWakeUpHotKey() {
  
}


// 添加
export function addCutList(data,callback){
    db.insert(data,callback);
}

//删除
export function deleteItem(item){
  db.remove({_id:item._id},{},(err,num)=>{
      console.log(err)
  });
}

//查询所有
export async function queryCutList(callback) {
      return new Promise((resolve, reject) => {
        db.find({}).sort({"time":-1}).exec((err, docs)=>{
              if(null == err) resolve(docs)
              reject(err)
        });
    })
}

