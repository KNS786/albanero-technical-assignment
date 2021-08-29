var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)


async function GetMyFollower(result){
    var newArray=[],res=[];
    result.filter((value)=>{
        newArray.push(value);
    })
    newArray.forEach((value)=>{
       res.push(value.following[0])
    })    
   return res;   

}

async function GetFeed(arr,db){
    var myRes=[];
    for(var username of arr){
        myRes=myRes.concat(
            await db.find({'username':username}).toArray()
        )
    }
    
    return myRes;
}

router.get('/feed',async function(req,res){
    var username=req.body.username;
    await client.connect();
    var db=client.db('albanero');
    var CurrentFollowing =db.collection('following')
    var GetPostFollowing=db.collection('createpost')
    CurrentFollowing.find({'username':username}).toArray(async function(error,result){
        if(error);
        if(result.length > 0){
            //var Feed=[];
           var myFollower=await GetMyFollower(result);
           myFollower.unshift(req.body.username);
           var Feed=await GetFeed(myFollower,GetPostFollowing);
           res.status(200).json({msg:Feed})


        }


    })


 
})





module.exports=router ;