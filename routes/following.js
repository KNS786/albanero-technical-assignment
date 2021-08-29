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
           if(error) throw err;
           myFolloweing.collection('following').find(query).toArray(function(err,allFolloweing){
               if(err)throw err;
               if(allFolloweing.length==0) return res.status(200).json({msg:'select you like to following '})
               return res.status(200).json({Followeing:allFolloweing})
           })
    }else{
        return res.status(200).json({Feed:"please signup "})
    }
})
module.exports=router ;
