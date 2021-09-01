const express=require('express');
const router=express.Router();

//config
const {DB_NAME,DB_COLLECTION_FOLLOWING}=require('../config');

//db
const {get}=require('../db.connection')


//who i am follow 
router.get('/following',async function(req,res){
    var LoginUserName=req.body.username; 
    if(LoginUserName){
        var results=get();
        var myFolloweing=results.db(DB_NAME);
          var query={'username':LoginUserName}//followeing
          var MyFolloweing=await myFolloweing.collection(DB_COLLECTION_FOLLOWING).find(query).toArray();
          return res.status(200).json({'myFollowing':MyFolloweing});

    }else{
        return res.status(200).json({Feed:"please signup "})
    }
})
module.exports=router ;