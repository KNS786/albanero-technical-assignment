var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)


router.get('/follower',async function(req,res){
    var LoginUserName=req.body.username;
    if(LoginUserName){
           await client.connect();
           var myFollower=client.db('albanero');

          var query={'username':LoginUserName}
           var allFollower=await myFollower.collection('follower').find(query).toArray();
           if(allFollower.length > 0)
             return res.status(200).json({Follower:allFollower})
            else return res.status(200).json({msg:'please choose like to following'});

    }else{
        return res.status(200).json({msg:"please signup "})
    }
})




module.exports=router ;
