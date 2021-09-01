const express=require('express');
const router=express.Router();

//config
const {DB_COLLECTION_USER,DB_NAME}=require('../config');

//db
const {get}=require('../db.connection');


router.get('/alluser',async function(req,res){
    //if current user login get params if not present id please login message to alert the user 
    //if user present true provide all db users
      var username=req.body.username;//current login user
     if(username.length > 0){
     var results=get();
      var dballUser=results.db(DB_NAME);     
      var alluser_results=await dballUser.collection(DB_COLLECTION_USER).find({}).toArray();
      return res.status(200).json({alluser:alluser_results});
      
    }else{
        return res.status(404).json({msg:'please signup '})
    }
  
  })

module.exports=router;