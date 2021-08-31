var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var MONGODB_URI=process.env.MONGODB_URI;
var DB_NAME=process.env.DB_NAME
var client=new MangoDbClient(MONGODB_URI)

var DB_COLLECTION_FOLLOWING=process.env.DB_COLLECTION_FOLLOWING;

//who i am follow 
router.get('/following',async function(req,res){
    var LoginUserName=req.body.username; //req.query
    if(LoginUserName){
        await client.connect();
        var myFolloweing=client.db(DB_NAME);

          //var myFolloweing=results.db('albanero');
          var query={'username':LoginUserName}//followeing
          const MyFolloweing=await myFolloweing.collection(DB_COLLECTION_FOLLOWING).find(query).toArray();
          return res.status(200).json({'myFollowing':MyFolloweing});

    }else{
        return res.status(200).json({Feed:"please signup "})
    }
})
module.exports=router ;
