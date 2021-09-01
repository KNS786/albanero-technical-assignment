const express=require('express');
const router=express.Router();

//mongodb connection 
// var MangoDbClient=require('mongodb').MongoClient;
// var MONGODB_URI=process.env.MONGODB_URI;
// var DB_NAME=process.env.DB_NAME;
// var client=new MangoDbClient(MONGODB_URI)

// //collections
// var DB_COLLECTION_FOLLOWING=process.env.DB_COLLECTION_FOLLOWING;
// var DB_COLLECTION_FOLLOWER=process.env.DB_COLLECTION_FOLLOWER;


//config
const {DB_NAME,DB_COLLECTION_FOLLOWING,DB_COLLECTION_FOLLOWER} = require('../config');


//db
const {get}=require('../db.connection');

//choose user to follow 
router.post('/choosefollowing/',async function(req,res){
     
    var LoginUserName=String(req.query.username);
  //  var FolloweingName=(req.query.FollowingName);
  var FolloweingName=(req.body.FollowingName);
     //var LoginUserName=req.body.username;
     if(LoginUserName){
          //await client.connect();
          var results=get();
          var selectFollowing=results.db(DB_NAME);
          var query ={
              username:LoginUserName,
              following:[]
          }
         var params ={};
         params['$set']={username:LoginUserName}
         params['$push']={following:{'$each':[FolloweingName]}};//'following'
        const CurrentFollowing=await selectFollowing.collection(DB_COLLECTION_FOLLOWING).updateMany(query,params,{'upsert':true});
        return res.status(200).json({msg : `your followeing ${FolloweingName}`});
   }
   else{
        return res.status(200).json({res:'please signup '})
   }

})
async function Followers(result,LoginUserName ,callback){
   try{
     var followercnt=0;
     var followers={myFollower:[]};
     var result=result.filter(function(dbfollowing,index){
         
          var user=dbfollowing.following;
        
           if(typeof user=='object' && user.length  > 0 && user[0]==LoginUserName){
               followers.myFollower.push(dbfollowing.username);
               followercnt++;
               
          }
     });

    return callback(null,followers);
   }catch(err){
       return callback(err);
   }
}


//my followers (who is following me)
router.get('/viewmyfollowers',async function(req,res){
     var LoginUserName=req.body.username;
     if(LoginUserName){
          //await client.connect();
          var results=get();
          const selectFollowing=results.db(DB_NAME);
                                                                    //following
          const getMyFollowing = await selectFollowing.collection(DB_COLLECTION_FOLLOWING).find({}).toArray();
          //if present in the following list in current login username return username
          await Followers(getMyFollowing,LoginUserName,async function(err,resolve){
               if(err) throw err; 
                 var query ={
                    username:LoginUserName,
                    follower:[]
               }
               var params ={};
               params['$set']={username:LoginUserName}
               params['$push']={follower:{'$each':[resolve]}};
                                                                 //'follower'
              const UpdateFollower = await selectFollowing.collection(DB_COLLECTION_FOLLOWER).updateMany(query,params,{upsert:true});
                                                                 //follower
              const  myFollowers=await selectFollowing.collection(DB_COLLECTION_FOLLOWER).find({"username":LoginUserName}).toArray();
              res.status(200).json({myfollower:myFollowers});  
          })
                     
     }
     else{return res.status(200).json({msg :'please signup'})}
})


//display following collection-- who i am follow 
router.get('/viewFollowing',async function(req,res){
         // await client.connect();
         var results=get();
          var selectFollowing=results.db(DB_NAME);           //'following
          const myFollowing=await selectFollowing.collection(DB_COLLECTION_FOLLOWING).find({}).toArray();
          res.status(200).json({myFollowing:myFollowing});
})



//test get db all follower value
router.get('/myallfollowers',async function(req,res){
   if(req.body.username){
        //  await client.connect();
          var results=get();
          var selectFollowing=results.db(DB_NAME);                //'follower
          const getAllFollowing=await selectFollowing.collection(DB_COLLECTION_FOLLOWER).find({}).toArray();
          res.status(200).json({getAllFollowing:getAllFollowing});
  }else{
       return res.status(404).json({err:'please signup '})
  }
})
module.exports=router;