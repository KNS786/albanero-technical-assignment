var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var MONGODB_URI=process.env.MONGODB_URI;
var DB_NAME=process.env.DB_NAME;
var client=new MangoDbClient(MONGODB_URI)

var DB_COLLECTION_POST=process.env.DB_COLLECTION_POST
var DB_COLLECTION_FOLLOWING=process.env.DB_COLLECTION_FOLLOWING;

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
            await db.find({'postedBy':username}).toArray()
        )
    }
    
    return myRes;
}


router.get('/feed',async function(req,res){
    var username=req.body.username;
    await client.connect();
    var db=client.db(DB_NAME);
    var CurrentFollowing =db.collection(DB_COLLECTION_FOLLOWING)   //'following'
    var GetPostFollowing=db.collection(DB_COLLECTION_POST)//'createpost'
    var currentUser=await GetPostFollowing.find({'username':username}).toArray();
    var result=await CurrentFollowing.find({'username':username}).toArray();
    var myFollower=await GetMyFollower(result);
    var Feed=await GetFeed(myFollower,GetPostFollowing);
    // Feed.push(currentUser);
    return res.status(200).json({'Feed':[{"mypost":currentUser},{"Followingpost":Feed}]})
})


module.exports=router ;