var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";

router.get('/feed',function(req,res){
     var LoginUserName=req.body.username;
     //if current user refer to the post table 
     //get my post
})
module.exports=router ;