//connection mongodb
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/albanero";

function Connection(){
     MangoDbClient.connect(url,function(err,db){
        if(err) throw err;
        console.log("Database connected");
        return db;
        
    })

}

var connection=Connection();

module.exports=connection;