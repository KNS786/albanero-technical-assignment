const express=require('express');
const router=express.Router();

//config
const {DB_NAME,DB_COLLECTION_FOLLOWER}=require('../config')

//db
const {get}=require('../db.connection');

router.get('/follower',async function(req,res){
    let LoginUserName=req.body.username;
    if(LoginUserName){
           let results=get();
           let myFollower=results.db(DB_NAME);

          let query={'username':LoginUserName}   // 'follower'
           let allFollower=await myFollower.collection(DB_COLLECTION_FOLLOWER).find(query).toArray();
           if(allFollower.length > 0)
             return res.status(200).json({Follower:allFollower})
            else return res.status(200).json({msg:'please choose like to following'});

    }else{
        return res.status(200).json({msg:"please signup "})
    }
})




module.exports=router ;