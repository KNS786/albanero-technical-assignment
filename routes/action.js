const express=require('express');
const router=express.Router();

//config
const {DB_NAME,DB_COLLECTION_FOLLOWING,DB_COLLECTION_FOLLOWER} = require('../config');

//db
const {get}=require('../db.connection');

//choose user to follow 
router.post('/choosefollowing/',async function(req,res){
     
    let LoginUserName=String(req.query.username);
    let FolloweingName=(req.body.FollowingName);
     if(LoginUserName){
          let results=get();
          let selectFollowing=results.db(DB_NAME);
          let query ={
              username:LoginUserName,
              following:[]
          }
         let params ={};
         params['$set']={username:LoginUserName}
         params['$push']={following:{'$each':[FolloweingName]}};
        let CurrentFollowing=await selectFollowing.collection(DB_COLLECTION_FOLLOWING).updateMany(query,params,{'upsert':true});
        return res.status(200).json({msg : `your followeing ${FolloweingName}`});
   }
   else{
        return res.status(200).json({res:'please signup '})
   }

})
async function Followers(result,LoginUserName ,callback){
   try{
     let followercnt=0;
     let followers={myFollower:[]};
     let result=result.filter(function(dbfollowing,index){
         
          let user=dbfollowing.following;
        
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
     let LoginUserName=req.body.username;
     if(LoginUserName){
          //await client.connect();
          let results=get();
          let selectFollowing=results.db(DB_NAME);
          let getMyFollowing = await selectFollowing.collection(DB_COLLECTION_FOLLOWING).find({}).toArray();
          //if present in the following list in current login username return username
          await Followers(getMyFollowing,LoginUserName,async function(err,resolve){
               if(err) throw err; 
                 let query ={
                    username:LoginUserName,
                    follower:[]
               }
               let params ={};
               params['$set']={username:LoginUserName}
               params['$push']={follower:{'$each':[resolve]}};
              let UpdateFollower = await selectFollowing.collection(DB_COLLECTION_FOLLOWER).updateMany(query,params,{upsert:true});
              let  myFollowers=await selectFollowing.collection(DB_COLLECTION_FOLLOWER).find({"username":LoginUserName}).toArray();
              res.status(200).json({myfollower:myFollowers});  
          })
                     
     }
     else{return res.status(200).json({msg :'please signup'})}
})


//display following collection-- who i am follow 
router.get('/viewFollowing',async function(req,res){
         let results=get();
          let selectFollowing=results.db(DB_NAME);  
          let myFollowing=await selectFollowing.collection(DB_COLLECTION_FOLLOWING).find({}).toArray();
          res.status(200).json({myFollowing:myFollowing});
})



//test get db all follower value
router.get('/myallfollowers',async function(req,res){
   if(req.body.username){
          let results=get();
          let selectFollowing=results.db(DB_NAME);
          let getAllFollowing=await selectFollowing.collection(DB_COLLECTION_FOLLOWER).find({}).toArray();
          res.status(200).json({getAllFollowing:getAllFollowing});
  }else{
       return res.status(404).json({err:'please signup '})
  }
})
module.exports=router;