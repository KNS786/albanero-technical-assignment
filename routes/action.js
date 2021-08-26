var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";
var db=require('../db.connection');

//choose user to follow 
router.post('/choosefollowing/',function(req,res){
    console.log(req.query);
    var LoginUserName=String(req.query.username);
  //  var FolloweingName=(req.query.FollowingName);
  var FolloweingName=(req.body.FollowingName);
    var user={LoginUserName,FolloweingName}
     //var LoginUserName=req.body.username;
     if(LoginUserName){
     MangoDbClient.connect(url,function(error,results){
          var selectFollowing=results.db('albanero');
          var query ={
              username:LoginUserName,
              following:[]
          }
         var params ={};
         params['$set']={username:LoginUserName}
         params['$push']={following:{'$each':[FolloweingName]}};

         selectFollowing.collection('following').updateMany(query,params,{'upsert':true},function(errors,results){
              if(errors)throw errors;
              console.log(results);
              return res.status(200).json({msg : `your followeing ${FolloweingName}`});
         })

      
      })
   }
   else{
        return res.status(200).json({res:'please signup '})
   }

})
function Followers(result,LoginUserName ,callback){
   try{
     var followercnt=0;
     var followers={myFollower:[]};
     var result=result.filter(function(dbfollowing,index){
         
          var user=dbfollowing.following;
        
           if(typeof user=='object' && user.length  > 0 && user[0]==LoginUserName){
                console.log(user[0]);
               followers.myFollower.push(dbfollowing.username);
               followercnt++;
               
          }
         // console.log(followercnt);
     });

    return callback(null,followers);
   }catch(err){
       return callback(err);
   }
}


//my followers (who is following me)
router.get('/viewmyfollowers',function(req,res){
     var LoginUserName=req.body.username;
     console.log(LoginUserName);
     if(LoginUserName){
          MangoDbClient.connect(url,function(error,results){
             var selectFollowing=results.db('albanero');
             selectFollowing.collection('following').find({}).toArray(async function(errors,result){
                  if(errors) throw errors;
                 // console.log(result);
                  //if present in the following list in current login username return username
                  await Followers(result,LoginUserName,async function(err,resolve){
                       if(err) throw err;
                       var query ={
                         username:LoginUserName,
                         follower:[]
                     }
                    var params ={};
                    params['$set']={username:LoginUserName}
                    params['$push']={follower:{'$each':[resolve]}};
                    console.log(resolve);

                    selectFollowing.collection('follower').updateMany(query,params,{'upsert':true},function(errors,results){
                         if(errors)throw errors;
                         console.log(results);
                         selectFollowing.collection('follower').find({"username":LoginUserName}).toArray(function(errors,results){
                             if(errors) throw err;
                             return res.status(200).json({msg:results});
                         })
                         //return res.status(200).json({msg :"updated successfully "});
                    })
                      //return res.status(200).json({msg:resolve})
                  })
               
             })
           })
     }
     else{return res.status(200).json({msg :'please signup'})}
})


//display following collection-- who i am follow 
router.get('/viewFollowing',function(req,res){
    // var LoginUserName=req.query.username;
     MangoDbClient.connect(url,function(error,results){
          var selectFollowing=results.db('albanero');
          selectFollowing.collection('following').find({}).toArray(function(errors,result){
               if(errors) throw errors;
               return res.status(200).json({"all":result});
          })
     })
})



//test get db all follower value
router.get('/myallfollowers',function(req,res){
   if(req.body.username){
     MangoDbClient.connect(url,function(error,results){
          var selectFollowing=results.db('albanero');
          selectFollowing.collection('follower').find({}).toArray(function(errors,result){
               if(errors) throw errors;
               return res.status(200).json({"all":result});
          })
     })
  }else{
       return res.status(404).json({err:'please signup '})
  }
})
module.exports=router;