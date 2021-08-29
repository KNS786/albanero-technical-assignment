var express=require('express');
var router=express.Router();


//mongodb connection 
var MangoDbClient=require('mongodb').MongoClient;
var uri="mongodb://localhost:27017/";
var client=new MangoDbClient(uri)



router.post('/addpost',async (req,res)=>{
    var body=req.body;
    var LoginUserName=req.body.username;
    var message=req.body.message
    
   if(LoginUserName && message){
    //MangoDbClient.connect(url,function(err,results){
        await client.connect();
        var createMyPost=client.db('albanero');
        //if user existed to allowed create post 
      createMyPost.collection('user').find({'username':LoginUserName}).toArray(function(errors,result){
          var params={};
          var query={'username':LoginUserName,'mypost':[]}
          params['$push']={'mypost':{'$each':[message]}}
          createMyPost.collection('createpost').updateMany(query,params,{upsert:true},async function(errors,result){
            if(errors) throw errors;
            return true;
           
         })      

           //create login username created posted        
        createMyPost.collection('follower').find({'username':LoginUserName}).toArray(function(errors,result){
            if(errors) throw errors;
            if(result.length==0) return res.status(200).json({'msg':'Your post was created!'})
             if(result.length > 0){
            var AllFollower=result;

           var MyFollowerList = {}
            AllFollower.filter((value,index)=>{
                var c=value.follower[0];
                c.myFollower.forEach(value=>{
                    if(!MyFollowerList[value])
                          MyFollowerList[value]=1;
                }) 
             })
             MyFollowerList=Object.keys(MyFollowerList).map(String);
    
             //every MyFollowerList post my info 
             //fitst update current post in username
             var query={"username":LoginUserName,'mypost':[]}
             var params={};
             params['$push']={'mypost':{'$each':[message]}}
             createMyPost.collection('createpost').updateMany(query,params,async function(error,result){
                 if(error) throw error;
                 //share my post other my follower
                 async function PostMyFollower(currentFollower,params){
                
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
       
   // })
   }else{
       return res.status(200).json({err:'please fill all the fields'})
   }
})


//testing collection db
router.get('/getpostdb',async function(req,res){
    await client.connect();
    var createMypost=client.db('albanero');
    
       createMypost.collection('createpost').find({}).toArray(function(errors,myFollowers){
           if(errors)throw errors;
           return res.status(200).json({msg:myFollowers})
       
       })

})


function GetFeedForm(res,req,getmyPost){
 
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
            function GetMyFollowingPost(following){
                 getMyFollowing.collection('createpost').find({'username':following}).toArray(function(errors,result){
                    if(errors) throw errors;
                   MyFollowingList.push(result);
 
                })
            }

             function data(){
                var result=Promise.all(SpreadFollowing.map((value)=>{
                    value=""+value+"";
                 query={"username":value}
                  GetMyFollowingPost(query);
 
             }));
                MyFeedList.push(MyFollowingList);
               
               return res.status(200).json({msg:MyFollowingList}) 
            }
            await data();
            await res.status(200).json({msg:'successfully posted messages !'})
        })    

}

router.get('/feeds',async function(req,res){
    await client.connect();
    var getmyPost=client.db('albanero');

    var username=req.body.username;
    if(username){
        GetFeedForm(res,req);
    }

})

module.exports=router;