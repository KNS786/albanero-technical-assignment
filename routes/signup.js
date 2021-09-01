const express=require('express');
const router=express.Router();

//config
const {DB_NAME,DB_COLLECTION_USER}=require('../config');

//db
const {get}=require('../db.connection')

router.post('/signup',async function(req,res){
    var body=req.body;
    if(Object.keys(body).length < 4) res.status(404).json({err:'please fill all the fields'})  
      var result=get();
      var dbFind=result.db(DB_NAME);
        var dbUserFined=await dbFind.collection(DB_COLLECTION_USER).find({"username":body.username},{projection:{"username":body.username}}).toArray();
            if(dbUserFined.length==0){
                 await dbFind.collection(DB_COLLECTION_USER).insertOne(body);
                 return res.status(200).json({'msg':'successfully signup '})
            }else{
               return res.status(404).json({msg:"username already exists"})
            }

     
})


module.exports=router;