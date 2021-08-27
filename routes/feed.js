var express=require('express');
var router=express.Router();

//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var url="mongodb://localhost:27017/";

/*
router.get('/feed',function(req,res){
     var LoginUserName=req.body.username;
     //if current user refer to the post table 
     //get my post
     MangoDbClient.connect(url,function(error,results){
         if(error) throw error;
         var feed=results.db('albanero');
         feed.collection('following').find({'username':req.body.username}).toArray(async function(errors,result){
             if(errors) throw errors;
             //if login username in createpost presnent the followers to take
            console.log(result);
            var currentFollowingList=result;
            var getmyFollowing={},c;
            currentFollowingList.filter((value,index)=>{
                c=value.following[0];
                if(!getmyFollowing[c])
                   getmyFollowing[c]=1;
            })
            console.log(getmyFollowing);
           var MyFeed=[]
            var FollowingList=Object.keys(getmyFollowing).map(String);
            //get postmessage in respect with createPost collection 
            async function getFeedFollowing(following){
                feed.collection('createpost').find(following).toArray(function(errors,result){
                    if(errors) throw errors;
                    result.filter((value,index)=>{
                        var params={};
                        params['$set']={'postedBy':value.username,'feed':value.post}
                        
                        feed.collection('feed').updateMany({'username':LoginUserName},params,{upsert:true},function(errors,results){
                            if(errors) throw errors ;
                            return true;
                        })
                    })
                    //return  res.status(200).json({feed:result})
                })
            }
            async function PostUniqueFollowing(){
                var result=Promise.all(FollowingList.map(async(value)=>{
                    query={"username":value}
                    await getFeedFollowing(query);

                })
             )
               //return res.status(200).json({feed:JSON.stringify(MyFeed)});
            }
            async function GetAllMyFeed(){
                await feed.collection('feed').find({}).toArray(function(errors,result){
                    if(errors) throw err;
                    return res.status(200).json({'feeds':result})
                })
            }
              await PostUniqueFollowing();
              await GetAllMyFeed();
    

         })
         
     })
})*/

router.get('/feed',function(req,res){
    var username=req.body.username;
    console.log(username)
    if(username){
        MangoDbClient.connect(url,function(errors,results){
            var MyFeed=results.db('albanero');
            MyFeed.collection("createpost").find({'username':req.body.username}).toArray(function(errors,result){
                if(errors) throw errors;
                return res.status(200).json({err:'this is cool '})
            })
        })
    }
    


})

module.exports=router ;