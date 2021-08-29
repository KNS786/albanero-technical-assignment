var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)

//choose user to follow 
router.post('/choosefollowing/',async function(req,res){
     
    var LoginUserName=String(req.query.username);
  //  var FolloweingName=(req.query.FollowingName);
  var FolloweingName=(req.body.FollowingName);
    var user={LoginUserName,FolloweingName}
     //var LoginUserName=req.body.username;
     if(LoginUserName){
          await client.connect();
          var selectFollowing=client.db('albanero');
          var query ={
              username:LoginUserName,
              following:[]
          }
         var params ={};
         params['$set']={username:LoginUserName}
         params['$push']={following:{'$each':[FolloweingName]}};

         selectFollowing.collection('following').updateMany(query,params,{'upsert':true},function(errors,results){
              if(errors)throw errors;
             
              return res.status(200).json({msg : `your followeing ${FolloweingName}`});
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
          await client.connect();
          var selectFollowing=client.db('albanero');

             selectFollowing.collection('following').find({}).toArray(async function(errors,result){
                  if(errors) throw errors;
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
                    

                    selectFollowing.collection('follower').updateMany(query,params,{'upsert':true},function(errors,results){
                         if(errors)throw errors;
                         selectFollowing.collection('follower').find({"username":LoginUserName}).toArray(function(errors,results){
                             if(errors) throw err;
                             return res.status(200).json({msg:results});
                         })
                         //return res.status(200).json({msg :"updated successfully "});
                    })
                      //return res.status(200).json({msg:resolve})
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
router.get('/myallfollowers',async function(req,res){
   if(req.body.username){
          await client.connect();
          var selectFollowing=client.db('albanero');
         
          selectFollowing.collection('follower').find({}).toArray(function(errors,result){
               if(errors) throw errors;
               return res.status(200).json({"all":result});
          })
  }else{
       return res.status(404).json({err:'please signup '})
  }
})
module.exports=router;