var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";

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
           console.log(followercnt);
      });

     return callback(null,followers);
    }catch(err){
        return callback(err);
    }
 }
 

//creating new post 
router.post('/addpost',function(req,res){
     var body=req.body;
     var LoginUserName=req.body.username;

     if(body.username){
        MangoDbClient.connect(url,function(err,results){
            var createMypost=results.db('albanero');
        
         createMypost.collection('follower').find({}).toArray(async function(errors,result){
                if(errors) throw errors;
               console.log(result);
                //if present in the following list in current login username return username
                await Followers(result,LoginUserName,async function(err,resolve){
                     if(err) throw err;
                    if(resolve.length > 0){
                     var query ={
                       username:LoginUserName,
                       message:req.body.message,
                       follower:[]
                   }
                  var params ={};
                  params['$set']={username:LoginUserName,message:req.body.message}
                  params['$push']={follower:{'$each':[resolve]}};
                    console.log(resolve);
                  createMypost.collection('createpost').updateMany(query,params,{'upsert':true},function(errors,results){
                       if(errors)throw errors;
                       console.log(results);
                       return res.status(200).json({msg :"updated successfully "});
                  })
                    //return res.status(200).json({msg:resolve})
                  }else{
                      //din't get follower =[] follower is empty 
                      var query={
                          "username":req.body.username,
                          "message":req.body.message,
                          "follower":[]
                      }

                      createMypost.collection("createpost").insertOne(query,function(errors,results){
                          if(errors) throw errors;
                          return res.status(200).json({post:'post successfully posted '})
                      })
                  }
                })

             
           })


        })
     }else{
         return res.status(404).json({msg:'please signup '})
     }
})

//testing collection db
router.get('/getpostdb',function(req,res){
    MangoDbClient.connect(url,function(err,results){
        var createMypost=results.db('albanero');
    
       createMypost.collection('follower').find({}).toArray(function(errors,myFollowers){
           if(errors)throw errors;
           return res.status(200).json({msg:myFollowers})
       
       })

    })
})

module.exports=router;