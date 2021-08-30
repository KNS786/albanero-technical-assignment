var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)


router.get('/alluser',async function(req,res){
    //if current user login get params if not present id please login message to alert the user 
    //if user present true provide all db users
      var username=req.body.username;//current login user
     if(username.length > 0){
      await client.connect();
      var dballUser=client.db('albanero');
      var alluser_results=await dballUser.collection('user').find({}).toArray();
      return res.status(200).json({alluser:alluser_results});
      
    }else{
        return res.status(404).json({msg:'please signup '})
    }
  
  })

module.exports=router;