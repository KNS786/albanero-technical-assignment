var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)


//who i am follow 
router.get('/following',async function(req,res){
    var LoginUserName=req.body.username; //req.query
    if(LoginUserName){
        await client.connect();
        var myFolloweing=client.db('albanero');

          //var myFolloweing=results.db('albanero');
          var query={'username':LoginUserName}
          const MyFolloweing=await myFolloweing.collection('following').find(query).toArray();
          return res.status(200).json({'myFollowing':MyFolloweing});

    }else{
        return res.status(200).json({Feed:"please signup "})
    }
})
module.exports=router ;
