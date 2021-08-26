var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";
var db=require('../db.connection');

router.post('/signup',async function(req,res){
    var body=req.body;
    if(Object.keys(body).length < 4) res.status(404).json({err:'please fill all the fields'})
    await MangoDbClient.connect(url,async function(error,results){
        var dbFind=results.db('albanero');
        await dbFind.collection('user').find({"username":body.username},{projection:{"username":body.username}}).toArray(function(errorDoc,docPresented){
            if(errorDoc) return errorDoc;
            //console.log(docPresented);
            if(docPresented.length==0){
                 dbFind.collection('user').insertOne(body,function(insertErr,doc){
                     if(insertErr) throw insertErr;
                     console.log(doc);
                     res.status(200).json({inserted : "user Registed successfully"})
                 })
            }else{
                res.status(404).json({msg:"username already exists"})
            }
    
        
        })

    })
     
})


module.exports=router;