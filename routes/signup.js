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
        dbFind.collection('user').find({"username":body.username},{projection:{"username":body.username}}).toArray(function(errorDoc,docPresented){
            if(errorDoc) return errorDoc;
            if(docPresented.length==0){
                 dbFind.collection('user').insertOne(body,function(insertErr,doc){
                     if(insertErr) throw insertErr;
                     res.status(200).json({inserted : "user Registed successfully"})
                 })
            }else{
                res.status(404).json({msg:"username already exists"})
            }
    
        
        })
     
})


module.exports=router;