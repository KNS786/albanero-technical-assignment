var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var DB_NAME=process.env.DB_NAME
var MONGODB_URI=process.env.MONGODB_URI;

var DB_COLLECTION_USER=process.env.DB_COLLECTION_USER;

var client=new MangoDbClient(MONGODB_URI)

router.post('/signup',async function(req,res){
    var body=req.body;
    if(Object.keys(body).length < 4) res.status(404).json({err:'please fill all the fields'})
   
       await client.connect();
      var dbFind=client.db(DB_NAME);

      //  var dbFind=results.db('albanero');    'user collection'
        var dbUserFined=await dbFind.collection(DB_COLLECTION_USER).find({"username":body.username},{projection:{"username":body.username}}).toArray();
            if(dbUserFined.length==0){
                 await dbFind.collection(DB_COLLECTION_USER).insertOne(body);
                 return res.status(200).json({'msg':'successfully signup '})
            }else{
               return res.status(404).json({msg:"username already exists"})
            }

     
})


module.exports=router;