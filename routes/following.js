var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";
var db=require('../db.connection');

//who i am follow 
router.get('/following',function(req,res){
    var LoginUserName=req.body.username; //req.query
    if(LoginUserName){
        MangoDbClient.connect(url,function(error,results){
            var myFolloweing=results.db('albanero');
            var query={'username':LoginUserName}
           if(error) throw err;
           myFolloweing.collection('following').find(query).toArray(function(err,allFolloweing){
               if(err)throw err;
               //console.log(allFolloweing);
               if(allFolloweing.length==0) return res.status(200).json({msg:'select you like to following '})
               return res.status(200).json({Followeing:allFolloweing})
           })

        })

    }else{
        return res.status(200).json({msg:"please signup "})
    }
})
module.exports=router ;
