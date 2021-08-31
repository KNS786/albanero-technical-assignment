var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var MONGODB_URI=process.env.MONGODB_URI;
var DB_NAME=process.env.DB_NAME
var client=new MangoDbClient(MONGODB_URI)

var DB_COLLECTION_FOLLOWER=process.env.DB_COLLECTION_FOLLOWER;

router.get('/follower',async function(req,res){
    var LoginUserName=req.body.username;
    if(LoginUserName){
           await client.connect();
           var myFollower=client.db(DB_NAME);

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
