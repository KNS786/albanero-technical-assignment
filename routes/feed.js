const express=require('express');
const router=express.Router();
//config
const {DB_NAME,DB_COLLECTION_POST,DB_COLLECTION_FOLLOWING}=require('../config')

//db
const  {get}=require('../db.connection');

async function GetMyFollower(result){
    let newArray=[],res=[];
    result.filter((value)=>{
        newArray.push(value);
    })
    newArray.forEach((value)=>{
       res.push(value.following[0])
    })    
   return res;   

}

async function GetFeed(arr,db){
    let myRes=[];
    for(let username of arr){
        myRes=myRes.concat(
            await db.find({'postedBy':username}).toArray()
        )
    }
    
    return myRes;
}


router.get('/feed',async function(req,res){
    let username=req.body.username;
    let results=get();
    let db=results.db(DB_NAME);
    let CurrentFollowing =db.collection(DB_COLLECTION_FOLLOWING)   //'following'
    let GetPostFollowing=db.collection(DB_COLLECTION_POST)//'createpost'
    let currentUser=await GetPostFollowing.find({'username':username}).toArray();
    let result=await CurrentFollowing.find({'username':username}).toArray();
    let myFollower=await GetMyFollower(result);
    let Feed=await GetFeed(myFollower,GetPostFollowing);
    return res.status(200).json({'Feed':[{"mypost":currentUser},{"Followingpost":Feed}]})
})


module.exports=router ;