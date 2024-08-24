var Datastore = require('nedb')
  , db = new Datastore({ filename: './app.db' });
db.loadDatabase(function (err) {    // Callback is optional
  // Now commands will be executed
});


export function addCutList(data,callback){
    db.insert(data,callback);
}

export async function queryCutList(callback) {
      return new Promise((resolve, reject) => {
        db.find({}).sort({"time":-1}).exec((err, docs)=>{
              if(null == err) resolve(docs)
              reject(err)
        });
    })
}

