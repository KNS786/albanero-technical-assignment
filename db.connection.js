//connection mongodb
var MangoDbClient=require('mongodb').MongoClient;
//var MONGODB_URI="mongodb://localhost:27017/";
var {MONGODB_URI}=require('./config');
var client=new MangoDbClient(MONGODB_URI)
var db,results,mongodb;
async function Connection(){
     results=await client.connect();
     console.log("Db connected");
     
}
db=Connection();
module.exports=async()=>{
     try{
        client=await client.connect();
     }catch(err){
          console.log("coud'nt connact mongodb");
     }
}
module.exports.get=()=>client;
module.exports.close=()=>client.close()