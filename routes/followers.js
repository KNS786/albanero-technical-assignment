const express=require('express');
const router=express.Router();

//config
const {DB_NAME,DB_COLLECTION_FOLLOWER}=require('../config')

//db
const {get}=require('../db.connection');

router.get('/follower',async function(req,res){
    var LoginUserName=req.body.username;
    if(LoginUserName){
           var results=get();
           var myFollower=results.db(DB_NAME);

          var query={'username':LoginUserName}   // 'follower'
           var allFollower=await myFollower.collection(DB_COLLECTION_FOLLOWER).find(query).toArray();
           if(allFollower.length > 0)
             return res.status(200).json({Follower:allFollower})
            else return res.status(200).json({msg:'please choose like to following'});

    }else{
        return res.status(200).json({msg:"please signup "})
    }
})




module.exports=router ;