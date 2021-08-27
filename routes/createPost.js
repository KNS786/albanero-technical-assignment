var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";


async function Followers(result,LoginUserName){
    console.log("results : ", result);
    try{
      var followercnt=0;
      var followers={myFollower:[]};
      var result=result.filter(function(dbfollowing,index){
          
           var user=dbfollowing.follower ? dbfollowing.follower : null ;
          // console.log(dbfollowing.follower );
          /// console.log("User "+dbfollowing[0][0])
            if(typeof user=='object' && user.length  > 0 && dbfollowing.username==LoginUserName){
                var users=dbfollowing.follower[index]["myFollower"] ? dbfollowing.follower[index]["myFollower"] : 0;
                // console.log(users);
                // user.filter((value,index)=>{
                //     users=dbfollowing.follower[index]["myFollower"] ? dbfollowing.follower[index] : 0;
                //      followers.myFollower.push(users )
                // })
                followers.myFollower.push(users);
                followercnt++;
                
           }
    
      });
       console.log(" keys "+Object.keys(result) +" values " + Object.values(result));

     return followers;
    }catch(err){
        return (err);
    }
 }
 

async function SendMyPostFollower(res,results,LoginUserName,PostMessage){
       //console.log(results);
        try{
           var set=[];
            results.filter(function(value){
                if(value.username==LoginUserName && value.follower.length > 0 ){
                    //console.log(value.follower );
                    
                     value.follower.forEach((user,index)=>{
                        // console.log(user.myFollower[0]);
                         for(let i=0;i<user.myFollower[index].length;i++){
                             set.push(user.myFollower[index][i])//myfollower
                         }
                         
                     })
                     
                }
            })
         MangoDbClient.connect(url,async function(errors,results){
             if(errors) throw errors;
            
             var post={'postedBy':LoginUserName,'post':PostMessage}
             var params={};
            // params['$set']=post; /* current debuggig*/
            
             //params['$push']={'followerpost':[post]}
             params['$push']={"followerpost":{'$each':[post]}}
             //send all my loginuser followers
             //unique array remove dublicates user
              var newSet=set.filter((value,pos)=>{
                  return set.indexOf(value)==pos;
              })
              //console.log(set[0]);
              // res.status(200).json({err:'working'})
              var PostMyFollowers=results.db('albanero');
             // for(var i=0;i<set.length;i++){
                   async function PostMessageUserFollow(followers,post,params){
                       // console.log(followers);
                        await PostMyFollowers.collection('createpost').find({'username':followers}).toArray(async function(error,result){
                            console.log("follower yes");
                            if(error) throw errors;
                            if(result.length > 0){
                                 await PostMyFollowers.collection('createpost').updateMany(post,params,{'upsert':true},function(errors,results){
                                      if(errors) throw errors;
                                     return true;
                                      //return res.status(200).json({msg:'created post'})
                                    
                                })
                            }
                            else{
                              //in case followers not found insert create post    
                              var createUser={
                                  'username':followers,
                                   'post':post["post"],
                                   "followerpost":[post]
                                }
                              await postMyFollowers.collection('createpost').insertOne(createUser,function(insertErr,doc){
                                  if(insertErr) throw insertErr;
                                  console.log("true");
                                  return true;
                              })

                            }

                       })

                   }
                async function PostUniqueFollower(){
                    var result=Promise.all(newSet.map(async(value)=>{
                        await PostMessageUserFollow(value,post,params);

                    }))
                   return res.status(200).json({msg:'post was created!'});
                }
                await PostUniqueFollower();


         })
          


        }catch(err){
            throw err;
        }
  

}


router.post('/addpost',(req,res)=>{
    var body=req.body;
    var LoginUserName=req.body.username;
    var message=req.body.message
   if(LoginUserName && message){
    MangoDbClient.connect(url,async function(err,results){
        //if user existed to allowed create post 
        var createMyPost=results.db('albanero');
      await createMyPost.collection('user').find({'username':LoginUserName}).toArray(async function(errors,result){
          await createMyPost.collection('createpost').updateMany({'username':LoginUserName},{$set:{'post':message}},{upsert:true},async function(errors,result){
            if(errors) throw errors;
            return true;
           
         })      

           //create login username created posted        
           await createMyPost.collection('follower').find({'username':LoginUserName}).toArray(async function(errors,result){
            if(errors) throw errors;
            console.log(result);
            if(result.length==0) return res.status(200).json({'msg':'Your post was created!'})
             if(result.length > 0){
            var AllFollower=result;
           // console.log(AllFollower)
           var MyFollowerList = {}
            AllFollower.filter((value,index)=>{
                var c=value.follower[0];
                c.myFollower.forEach(value=>{
                    if(!MyFollowerList[value])
                          MyFollowerList[value]=1;
                }) 
             })
             MyFollowerList=Object.keys(MyFollowerList).map(String);
             console.log(MyFollowerList);
             //every MyFollowerList post my info 
                 
               

             //fitst update current post in username
             var query={"username":LoginUserName}
             var params={};
             params['$set']={'post':message}
             createMyPost.collection('createpost').updateMany(query,params,async function(error,result){
                 if(error) throw error;
                 //share my post other my follower
                 async function PostMyFollower(currentFollower,params){
                     console.log(currentFollower);
                    createMyPost.collection('createpost').updateMany(currentFollower,params,function(errors,result){
                        if(errors) throw errors;
                        return true
 
                    })
                 }
 
                 async function PostUniqueFollower(){
                     var result=Promise.all(MyFollowerList.map(async(value)=>{
                         query={"username":value}
                         params={};
                         params["$set"]={"post":message,'postedBy':LoginUserName}
                         await PostMyFollower(query,params);
 
                     })
                  )
                    return res.status(200).json({msg:'post was created!'});
                    
 
                 }
                 await PostUniqueFollower();
                    
                
 
             })
          }
          else{
              return res.status(200).json({err:'please sign up'})
          }
         })


        
       })
       
    })
   }else{
       return res.status(200).json({err:'please fill all the fields'})
   }
})


//testing collection db
router.get('/getpostdb',function(req,res){
    MangoDbClient.connect(url,function(err,results){
        var createMypost=results.db('albanero');
    
       createMypost.collection('createpost').find({}).toArray(function(errors,myFollowers){
           if(errors)throw errors;
           return res.status(200).json({msg:myFollowers})
       
       })

    })
})


async function GetFeedForm(res,req){
    MangoDbClient.connect(url,function(errors,results){
        var MyFeedList=[];
        var getmyPost=results.db('albanero')
        getmyPost.collection('createpost').find({'username':req.body.username}).toArray(function(errors,result){
            if(errors)throw errors;
            MyFeedList.push(result)
        })
        getmyPost.collection('following').find({'username':req.body.username}).toArray(async function(errors,result){
            if(errors) throw errors;
            var MyFollowing={};
            var ft=result;
            ft.filter((value,index)=>{
                if(!MyFollowing[value.following[0]])
                MyFollowing[value.following[0]]=1;
            })
            var SpreadFollowing=Object.keys(MyFollowing).map(String);
            var  MyFollowingList=[]
            async function GetMyFollowingPost(following){
                await getMyFollowing.collection('createpost').find({'username':following}).toArray(function(errors,result){
                    if(errors) throw errors;
                   MyFollowingList.push(result);
 
                })
            }

            async function data(){
                var result=Promise.all(SpreadFollowing.map(async(value)=>{
                    value=""+value+"";
                    console.log("map value : "+value);
                 query={"username":value}
                 await GetMyFollowingPost(query);
 
             }));
                MyFeedList.push(MyFollowingList);
                console.log(MyFeedList);
               return res.status(200).json({msg:MyFollowingList}) 
            }
            await data();
            await res.status(200).json({msg:'successfully posted messages !'})
        })    
   
    })
}

router.get('/feeds',async function(req,res){
    var username=req.body.username;
    if(username){
        await GetFeedForm(res,req);
    }

})


//following username with respect body
router.get('/feed',function(req,res){
    var username=req.body.username;
    console.log(username);

    MangoDbClient.connect(url,async function(errors,results){
        var getMyFollowing=results.db('albanero');
        var MyFeedList=[];
        async function Push(value){
            await MyFeedList.push(value);
        }
        await getMyFollowing.collection('createpost').find({'username':req.body.username}).toArray(async function(errors,result){
            if(errors)throw errors;
            var params={};
            params['$set']={"postedBy":result.following,"post":result.post}
            await getMyFollowing.collection('feed').updateMany({'username':username},params,{upsert:true},function(error,results){
                if(error) throw error;
                return true;
           });
            MyFeedList.push(result)
        })

        await getMyFollowing.collection('following').find({'username':req.body.username}).toArray(async function(errors,result){
            if(errors) throw errors;
            var MyFollowing={};
            console.log(result)
            var ft=result;
            ft.filter((value,index)=>{
            
                if(!MyFollowing[value.following[0]])
                     MyFollowing[value.following[0]]=1;

            })
           var SpreadFollowing=Object.keys(MyFollowing).map(String);
           var  MyFollowingList=[]
           console.log(SpreadFollowing);
           async function GetMyFollowingPost(following){
              // console.log("following "+Object.keys(following))
               //console.log("following values "+Object.values(following))
            
               await getMyFollowing.collection('createpost').find({'username':following.username}).toArray(async function(errors,result){
                   if(errors) throw errors;
             
                   var Keys=Object.keys(result);
                   //console.log(Keys);
                   var params={};
                   var Values=Object.values(result);
                   params['$set']={"postedBy":Values.following,"post":Values.post}

                   console.log(Values);
                    await getMyFollowing.collection('feed').updateMany({'username':username},params,{upsert:true},function(error,results){
                         if(error) throw error;
                         return true;
                    });
                  // console.log(newObj);
                    MyFeedList.push(Values);
                    newObj={}
               })
           }
           async function data(){
               var result=Promise.all(SpreadFollowing.map(async(value)=>{
                   value=""+value+"";
                  // console.log("map value : "+value);
                query={"username":value}
                await GetMyFollowingPost(query);

            }));
              
              //console.log(MyFeedList);
              await  getMyFollowing.collection('feed').find({'username':username}).toArray(function(errors,result){
                   if(errors) throw errors;
                   return res.status(200).json({res:MyFeedList});

              })
           }
            await data();
             //res.status(200).json({msg:result});
             //console.log(result)

        })

    })
})
// router.post('/feed',function(req,res){
       

// })

module.exports=router;