var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)


router.post('/signup',async function(req,res){
    var body=req.body;
    if(Object.keys(body).length < 4) res.status(404).json({err:'please fill all the fields'})
   
       await client.connect();
      var dbFind=client.db('albanero');

      //  var dbFind=results.db('albanero');
        var dbUserFined=await dbFind.collection('user').find({"username":body.username},{projection:{"username":body.username}}).toArray();
            if(dbUserFined.length==0){
                 await dbFind.collection('user').insertOne(body);
                 return res.status(200).json({'msg':'successfully signup '})
            }else{
               return res.status(404).json({msg:"username already exists"})
            }

     
})


module.exports=router;