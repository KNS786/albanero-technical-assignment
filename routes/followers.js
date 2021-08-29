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

          // var myFollower=results.db('albanero');
          var query={'username':LoginUserName}
           if(error) throw err;
           myFollower.collection('follower').find(query).toArray(function(err,allFollower){
               if(err)throw err;
               if(allFollower.length==0) return res.status(200).json({msg:'You dont have a any follower'})
               return res.status(200).json({Follower:allFollower})
           })


    }else{
        return res.status(200).json({msg:"please signup "})
    }
})




module.exports=router ;
